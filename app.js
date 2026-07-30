/* ─── Vacances 2026 — vote de famille ─────────────────────────────
   Stockage 100% local (localStorage). Le bouton "partage ton vote"
   encode tes votes/notes dans une URL ; l'ouvrir chez quelqu'un
   d'autre fusionne tes votes dans sa vue. Pas de backend. */

const LS = { user: "hv_user", votes: "hv_votes", notes: "hv_notes" };
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// n'autorise que http(s) — bloque javascript: etc.
const safeUrl = u => { try { const p = new URL(u); return ["http:", "https:"].includes(p.protocol) ? u : "#"; } catch { return "#"; } };

/* Couleur stable par région (palette dopamine, index par ordre d'apparition) */
const REGION_PALETTE = [
  ["#f3e8ff", "#7c3aed"], // violet
  ["#ffe4ef", "#e0356f"], // rose
  ["#fff1dc", "#d97706"], // orange
  ["#dcf9f4", "#0f9488"], // teal
  ["#e0edff", "#2563eb"], // bleu
  ["#fef6d8", "#b45309"], // jaune/ocre
  ["#ffe8e0", "#dc4a26"], // corail
  ["#e8f7dc", "#4d7c0f"]  // vert
];
const regionStyle = r => {
  const i = [...new Set(all().map(l => l.region))].indexOf(r);
  const [bg, fg] = REGION_PALETTE[(i + REGION_PALETTE.length) % REGION_PALETTE.length];
  return `background:${bg};color:${fg}`;
};

/* Emoji par avantage — l'info se lit d'un coup d'œil */
const PERK_EMOJI = [
  [/piscine/i, "🏊"], [/jacuzzi|spa/i, "🫧"], [/sauna/i, "🧖"], [/clim/i, "❄️"],
  [/vue mer|mer\b/i, "🌊"], [/vue|panoram/i, "🏞️"], [/jardin/i, "🌿"],
  [/barbecue/i, "🍖"], [/parking|garage/i, "🅿️"], [/cheminée/i, "🔥"],
  [/ping-pong/i, "🏓"], [/pétanque/i, "🎯"], [/tennis/i, "🎾"], [/sport/i, "🏋️"],
  [/éco/i, "♻️"], [/appartement/i, "🏢"], [/hypercentre|ville/i, "🏙️"], [/chauffée/i, "♨️"]
];
const perkLabel = p => {
  const hit = PERK_EMOJI.find(([re]) => re.test(p));
  return (hit ? hit[1] + " " : "") + p;
};

let votes = load(LS.votes, {});     // {listingId: [prenoms]}
let notes = load(LS.notes, {});     // {listingId: [{who,text,ts}]}
let region = "Toutes";
let mapObj = null;

const all = () => LISTINGS;
const FAV_CHIP = "\u{1F49B} Coups de c\u0153ur";
const VOTED_CHIP = "\u2764\ufe0f Vot\u00e9s";
const me = () => (document.getElementById("me-name").value || "").trim();

/* ─── Fusion depuis une URL partagée (#d=…) ─── */
(function mergeFromHash() {
  const m = location.hash.match(/#d=(.+)/);
  if (!m) return;
  try {
    const shared = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    for (const [id, names] of Object.entries(shared.votes || {})) {
      votes[id] = [...new Set([...(votes[id] || []), ...names])];
    }
    for (const [id, list] of Object.entries(shared.notes || {})) {
      const mine = notes[id] || [];
      const seen = new Set(mine.map(n => n.ts + "|" + n.who));
      notes[id] = [...mine, ...list.filter(n => !seen.has(n.ts + "|" + n.who))];
    }
    save(LS.votes, votes); save(LS.notes, notes);
    history.replaceState(null, "", location.pathname);
    setTimeout(() => alert("Votes et notes partagés fusionnés dans ta vue ✔"), 300);
  } catch (e) { console.warn("hash invalide", e); }
})();

/* ─── Rendu ─── */
function fmtDates(l) {
  const f = d => new Date(d + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const nights = Math.round((new Date(l.checkout) - new Date(l.checkin)) / 864e5);
  return `${f(l.checkin)} → ${f(l.checkout)} · ${nights} nuits`;
}
function priceHtml(l) {
  if (l.price == null) return `<span class="price unknown">prix à vérifier</span>`;
  const over = l.price > BUDGET_MAX;
  return `<span class="price ${over ? "over" : ""}">${l.price.toLocaleString("fr-FR")} €</span>` +
    (over ? ` <span class="dates">⚠ au-dessus des ${BUDGET_MAX.toLocaleString("fr-FR")} €</span>` : "");
}
function regions() { return ["Toutes", VOTED_CHIP, FAV_CHIP, ...new Set(all().map(l => l.region))]; }

/* Trajets depuis Bordeaux et Lyon. Temps de route OSRM (hors bouchons d'août).
   L'avion n'est affiché que s'il existe une ligne directe depuis Bordeaux ;
   le transfert aéroport→logement est compté, sinon le chiffre ne veut rien dire. */
const mins = t => t < 60 ? `${t} min`
  : `${Math.floor(t / 60)} h${t % 60 ? " " + String(t % 60).padStart(2, "0") : ""}`;
const hm = h => mins(Math.round(h * 60));
function travelHtml(l) {
  const bx = l.driveH != null
    ? `<span class="trip">🚗 <b>Bordeaux</b> ${hm(l.driveH)} <em>· ${l.driveKm} km</em></span>` : "";
  const ly = l.lyonH != null
    ? `<span class="trip">🚗 <b>Lyon</b> ${hm(l.lyonH)} <em>· ${l.lyonKm} km</em></span>` : "";
  const air = l.fly
    ? `<span class="trip">✈️ ${hm(l.fly.h)} → ${esc(l.fly.to)} <em>+ ${mins(l.fly.road)} de route</em></span>` : "";
  return bx || ly || air ? `<div class="trips">${bx}${ly}${air}</div>` : "";
}

function renderChips() {
  document.getElementById("region-chips").innerHTML = regions().map(r =>
    `<button class="chip ${r === region ? "active" : ""}" data-r="${esc(r)}">${esc(r)}</button>`).join("");
}

function sorted(list) {
  const mode = document.getElementById("sort").value;
  const v = l => (votes[l.id] || []).length;
  const r = l => parseFloat(String(l.rating || "0").replace(",", "."));
  if (mode === "none") return list;                       // ordre du fichier — les votes ne font pas remonter
  return [...list].sort((a, b) =>
    mode === "price" ? (a.price ?? 1e9) - (b.price ?? 1e9) :
    mode === "drive" ? (a.driveH ?? 99) - (b.driveH ?? 99) :
    mode === "lyon" ? (a.lyonH ?? 99) - (b.lyonH ?? 99) :
    mode === "votes" ? v(b) - v(a) : r(b) - r(a));
}

function render() {
  renderChips();
  const list = sorted(all().filter(l =>
    region === "Toutes" ? true
      : region === VOTED_CHIP ? (votes[l.id] || []).length > 0
      : region === FAV_CHIP ? l.fav
      : l.region === region));
  const maxVotes = Math.max(0, ...all().map(l => (votes[l.id] || []).length));
  document.getElementById("cards").innerHTML = list.map(l => {
    const vs = votes[l.id] || [];
    const ns = notes[l.id] || [];
    const iVoted = vs.includes(me());
    const isWinner = maxVotes > 0 && vs.length === maxVotes;
    return `
    <article class="card ${isWinner ? "winner" : ""}" data-id="${esc(l.id)}">
      ${l.img ? `<img class="card-img" src="${esc(l.img)}" alt="${esc(l.title)}" loading="lazy">`
              : `<div class="card-img placeholder" aria-hidden="true">🏡</div>`}
      <div class="badge-row">
        <span class="region-badge" style="${regionStyle(l.region)}">📍 ${esc(l.region)}</span>
        ${l.fav ? '<span class="fav-badge" title="Élu Coup de cœur voyageurs par Airbnb">💛 Coup de cœur</span>' : ""}
        ${isWinner ? '<span class="crown" title="en tête des votes">👑</span>' : ""}
      </div>
      <h3><a href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${esc(l.title)} ↗</a></h3>
      <div class="meta">
        <span>🏘 ${esc(l.city)}</span>
        <span>👥 ${esc(l.guests)} voy. · 🛏 ${esc(l.bedrooms)} ch. · 🛁 ${esc(l.baths)} sdb</span>
        ${l.rating ? `<span>⭐ ${esc(l.rating)}</span>` : ""}
      </div>
      <div class="price-row">${priceHtml(l)} <span class="dates">📅 ${fmtDates(l)}</span></div>
      ${travelHtml(l)}
      <div class="perks">${(l.perks || []).map(p => `<span class="perk">${esc(perkLabel(p))}</span>`).join("")}</div>
      ${(l.poi || []).length ? `<details class="poi">
        <summary>🧭 Autour du logement</summary>
        ${l.poi.map(p => `<div class="poi-row"><span>${p.e} ${esc(p.n)}</span><em>${mins(p.m)}</em></div>`).join("")}
      </details>` : ""}
      <div class="vote-row">
        <button class="btn-vote ${iVoted ? "voted" : ""}" data-vote="${esc(l.id)}">
          ${iVoted ? "❤️" : "🤍"} ${vs.length}</button>
        <span class="voters">${vs.length ? esc(vs.join(", ")) : "aucun vote"}</span>
      </div>
      <details class="notes" ${ns.length ? "open" : ""}>
        <summary>📝 Notes (${ns.length})</summary>
        ${ns.map(n => `<div class="note"><b>${esc(n.who)}</b> — ${esc(n.text)}
          <span class="when">${new Date(n.ts).toLocaleDateString("fr-FR")}</span></div>`).join("")}
        <form class="note-form" data-note="${esc(l.id)}">
          <input placeholder="ta remarque…" maxlength="300" required>
          <button class="btn">OK</button>
        </form>
      </details>
    </article>`;
  }).join("");
  const voters = new Set(Object.values(votes).flat());
  document.getElementById("stats").textContent =
    `${all().length} biens · ${voters.size} votant·e·s (${[...voters].join(", ") || "personne"})`;
  if (mapObj) renderMarkers();
}

/* ─── Carte ─── */
function ensureMap() {
  if (mapObj) return;
  mapObj = L.map("map").setView([44.3, 5.5], 6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mapObj);
  renderMarkers();
}
let markerLayer = null;
function renderMarkers() {
  if (markerLayer) markerLayer.remove();
  markerLayer = L.layerGroup().addTo(mapObj);
  const pts = [];
  for (const l of all()) {
    if (l.lat == null || l.lng == null) continue;
    pts.push([l.lat, l.lng]);
    const vs = (votes[l.id] || []).length;
    L.marker([l.lat, l.lng]).addTo(markerLayer).bindPopup(
      `<div class="popup-title">${esc(l.title)}</div>` +
      `${l.price != null ? l.price.toLocaleString("fr-FR") + " €" : "prix à vérifier"} · ❤️ ${vs}<br>` +
      `<a href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">Voir sur Airbnb ↗</a>`);
  }
  if (pts.length) mapObj.fitBounds(pts, { padding: [40, 40] });
}

/* ─── Événements ─── */
document.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (chip) { region = chip.dataset.r; render(); return; }
  const voteBtn = e.target.closest("[data-vote]");
  if (voteBtn) {
    const name = me();
    if (!name) { alert("Écris ton prénom en haut à droite d'abord 🙂"); document.getElementById("me-name").focus(); return; }
    const id = voteBtn.dataset.vote;
    const vs = votes[id] || [];
    votes[id] = vs.includes(name) ? vs.filter(n => n !== name) : [...vs, name];
    save(LS.votes, votes); render();
  }
});

document.addEventListener("submit", e => {
  const form = e.target.closest("[data-note]");
  if (!form) return;
  e.preventDefault();
  const name = me();
  if (!name) { alert("Écris ton prénom en haut à droite d'abord 🙂"); return; }
  const text = form.querySelector("input").value.trim();
  if (!text) return;
  const id = form.dataset.note;
  (notes[id] = notes[id] || []).push({ who: name, text, ts: Date.now() });
  save(LS.notes, notes); render();
});

document.getElementById("sort").addEventListener("change", render);

document.getElementById("me-name").addEventListener("change", e => {
  save(LS.user, e.target.value.trim()); render();
});

document.getElementById("btn-view-map").addEventListener("click", () => {
  const wrap = document.getElementById("map-wrap");
  wrap.classList.toggle("hidden");
  document.getElementById("btn-view-map").textContent =
    wrap.classList.contains("hidden") ? "🗺️ Carte" : "🗂 Masquer la carte";
  if (!wrap.classList.contains("hidden")) { ensureMap(); setTimeout(() => mapObj.invalidateSize(), 60); }
});

document.getElementById("btn-share").addEventListener("click", async () => {
  const payload = { votes, notes };
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const url = location.origin + location.pathname + "#d=" + b64;
  try { await navigator.clipboard.writeText(url); alert("Lien copié 📋 — envoie-le sur le groupe WhatsApp !"); }
  catch { prompt("Copie ce lien :", url); }
});

document.getElementById("btn-reset").addEventListener("click", () => {
  if (!confirm("Effacer TES votes, notes et biens ajoutés (sur cet appareil) ?")) return;
  localStorage.removeItem(LS.votes); localStorage.removeItem(LS.notes);
  votes = {}; notes = {}; render();
});

/* ─── Init ─── */
document.getElementById("me-name").value = load(LS.user, "");
render();
