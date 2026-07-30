// ─── Les logements ───────────────────────────────────────────────
// Curation via push : envoyer les liens Airbnb à Tim, elle scrape et met à jour.
// `fav: true` = élu « Coup de cœur voyageurs » par Airbnb.
const LISTINGS = [
  {
    id: "p6273999a",
    driveH: 6.4, driveKm: 617,
    lyonH: 2.0, lyonKm: 171,
    poi: [{ e: "👶", n: "Ferme aux crocodiles", m: 1 }, { e: "🍷", n: "Château de Grignan", m: 25 }, { e: "👶", n: "Gorges de l'Ardèche, Vallon-Pont-d'Arc", m: 37 }],
    img: "img/pierrelatte.jpg",
    title: "Maison de caractère avec jardin et piscine",
    city: "Pierrelatte (Drôme)",
    region: "Drôme provençale",
    url: "https://www.abritel.fr/location-vacances/p6273999a?chkin=2026-08-02&chkout=2026-08-09&adults=10",
    price: 3157,
    checkin: "2026-08-02", checkout: "2026-08-09",
    guests: 10, bedrooms: 6, baths: "2+",
    rating: "10/10",
    lat: 44.37943, lng: 4.69551,
    perks: ["piscine privée", "jardin", "barbecue", "parking"]
  },
  {
    id: "magical-house",
    driveH: 7.9, driveKm: 701,
    lyonH: 2.1, lyonKm: 154,
    poi: [{ e: "👶", n: "Lac du Chambon, baignade", m: 20 }, { e: "🍷", n: "Montée de l'Alpe d'Huez", m: 17 }, { e: "👶", n: "Grenoble, téléphérique de la Bastille", m: 62 }],
    img: "img/oisans.webp",
    title: "Chalet 5 chambres — piscine et jacuzzi",
    city: "Le Bourg-d'Oisans (Isère)",
    region: "Isère — Oisans",
    url: "https://www.booking.com/hotel/fr/magical-house.fr.html?checkin=2026-08-02&checkout=2026-08-09&group_adults=10&no_rooms=1",
    price: 1897,
    checkin: "2026-08-02", checkout: "2026-08-09",
    guests: 10, bedrooms: 5, baths: "1",
    rating: "",
    lat: 45.062742, lng: 6.037968,
    perks: ["piscine privée", "jacuzzi", "jardin", "parking", "160 m²"]
  },
  {
    id: "maison-90-lechaffard",
    driveH: 6.4, driveKm: 579,
    lyonH: 0.6, lyonKm: 32,
    poi: [{ e: "🍷", n: "Lyon, Vieux-Lyon", m: 34 }, { e: "👶", n: "Grand Parc Miribel-Jonage, baignade", m: 58 }, { e: "🍷", n: "Pérouges, cité médiévale", m: 38 }],
    img: "img/satolas.webp",
    title: "Maison 90 — 8 chambres, piscine privée",
    city: "Satolas-et-Bonce (Isère)",
    region: "Isère — proche Lyon",
    url: "https://www.booking.com/hotel/fr/maison-90-avec-8-chambres-lechaffardcom.fr.html?checkin=2026-08-02&checkout=2026-08-09&group_adults=10&no_rooms=1",
    price: 3511,
    checkin: "2026-08-02", checkout: "2026-08-09",
    guests: 10, bedrooms: 8, baths: "4",
    rating: "9,5",
    lat: 45.6673658, lng: 5.1397074,
    perks: ["piscine privée", "clim", "jardin", "balcon", "parking", "250 m²"]
  }
];
const BUDGET_MAX = 4000;
