# 🏖️ Vacances 2026 — le vote

Petit site statique pour choisir le logement des vacances en famille :
cartes par région, votes ❤️, notes 📝, carte interactive 🗺️.

## Déployer sur GitHub Pages

```bash
cd site
git init && git add . && git commit -m "feat: site de vote vacances 2026"
# ⚠️ repo PERSO → identité perso AVANT le premier commit :
git config user.name "t-mercier"
git config user.email "<ton-noreply-perso>@users.noreply.github.com"
gh repo create vacances-2026 --public --source=. --push
gh api repos/t-mercier/vacances-2026/pages -X POST -f 'source[branch]=main' -f 'source[path]=/'
```

Le site sera sur `https://t-mercier.github.io/vacances-2026/`.

## Comment ça marche

- **Votes & notes** : stockés dans le navigateur de chacun (localStorage — pas de backend).
- **« Partage ton vote »** : copie une URL qui contient tes votes/notes ; quand un autre
  membre l'ouvre, ils fusionnent dans sa vue. Chacun partage, tout le monde voit tout.
- **Ajouter un bien** : bouton `＋ Ajouter` → stocké localement + inclus dans ton lien de
  partage. Pour l'ajouter en dur pour tout le monde : `Exporter (JSON)` en bas de page,
  coller le bloc dans `listings.js`, push.
- **Prix "à vérifier"** : Airbnb ne montrait pas le total pour ces annonces au moment du
  scan — clique sur le lien pour vérifier.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | squelette + dialog d'ajout |
| `listings.js` | **les données** — c'est ici qu'on ajoute des biens en dur |
| `app.js` | votes, notes, filtres, carte, partage |
| `styles.css` | design (dopamine minimal) |

Leaflet + OpenStreetMap via CDN (SRI activé).
