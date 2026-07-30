// ─── Les logements ───────────────────────────────────────────────
// Pour ajouter un bien de façon permanente : copier un bloc, l'adapter,
// et push. (Sinon, bouton "+ Ajouter" sur le site → stockage local + export JSON.)
const LISTINGS = [
  {
    id: "31921420",
    title: "Gîte de charme — vue exceptionnelle & spa",
    city: "Montréal-les-Sources",
    region: "Drôme provençale",
    url: "https://www.airbnb.fr/rooms/31921420?check_in=2026-08-01&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: 2377,
    checkin: "2026-08-01", checkout: "2026-08-08",
    guests: 8, bedrooms: 4, baths: "2",
    rating: "4,5",
    lat: 44.40247, lng: 5.30976,
    perks: ["piscine", "spa", "jacuzzi", "vue panoramique", "jardin", "barbecue", "cheminée", "ping-pong"]
  },
  {
    id: "1170421735447933869",
    title: "Villa l'Arbanaise — vue mer, presqu'île de Giens",
    city: "Hyères",
    region: "Var — côte",
    url: "https://www.airbnb.fr/rooms/1170421735447933869?check_in=2026-08-02&check_out=2026-08-07&guests=8&adults=7&children=1&infants=2",
    price: 3981,
    checkin: "2026-08-02", checkout: "2026-08-07",
    guests: 10, bedrooms: 5, baths: "4",
    rating: "4,3",
    lat: 43.03765, lng: 6.10861,
    perks: ["piscine", "vue mer", "clim", "jardin", "barbecue"]
  },
  {
    id: "1739140052901104186",
    title: "Villa d'architecte avec piscine privée",
    city: "Six-Fours-les-Plages",
    region: "Var — côte",
    url: "https://www.airbnb.fr/rooms/1739140052901104186?check_in=2026-08-01&check_out=2026-08-07&guests=8&adults=7&children=1&infants=2",
    price: 3859,
    checkin: "2026-08-01", checkout: "2026-08-07",
    guests: 8, bedrooms: 4, baths: "3",
    rating: "4,0",
    lat: 43.08412, lng: 5.82771,
    perks: ["piscine privée", "clim", "parking"]
  },
  {
    id: "919375358132572747",
    title: "Anatole — cadre idyllique avec piscine",
    city: "Les Angles (face Avignon)",
    region: "Gard / Avignon",
    url: "https://www.airbnb.fr/rooms/919375358132572747?check_in=2026-08-02&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: null, // ne s'affichait pas — à vérifier sur Airbnb
    checkin: "2026-08-02", checkout: "2026-08-08",
    guests: 11, bedrooms: 5, baths: "2,5",
    rating: "4,7",
    lat: 43.9564, lng: 4.7593,
    perks: ["piscine", "clim", "jardin", "barbecue", "parking"]
  },
  {
    id: "1000703526294624122",
    title: "Villa à Grasse — piscine, vieille ville à pied",
    city: "Grasse",
    region: "Côte d'Azur",
    url: "https://www.airbnb.fr/rooms/1000703526294624122?check_in=2026-08-02&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: 4541,
    checkin: "2026-08-02", checkout: "2026-08-08",
    guests: 10, bedrooms: 5, baths: "3",
    rating: "4,6",
    lat: 43.66546, lng: 6.92622,
    perks: ["piscine", "jacuzzi", "clim", "jardin", "barbecue", "cheminée"]
  },
  {
    id: "8979070",
    title: "Maison hypercentre — clim, piscine, pétanque",
    city: "Aix-en-Provence",
    region: "Provence — Aix",
    url: "https://www.airbnb.fr/rooms/8979070?check_in=2026-07-31&check_out=2026-08-07&guests=8&adults=7&children=1&infants=2",
    price: 5673,
    checkin: "2026-07-31", checkout: "2026-08-07",
    guests: 8, bedrooms: 5, baths: "4",
    rating: "4,91",
    lat: 43.5328, lng: 5.4497,
    perks: ["piscine", "clim", "parking", "pétanque", "hypercentre"]
  },
  {
    id: "546681176260395984",
    title: "Chalet vallée de Chamonix — piscine, spa, sauna, salle de sport",
    city: "Servoz",
    region: "Alpes — Chamonix",
    url: "https://www.airbnb.fr/rooms/546681176260395984?check_in=2026-08-01&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: null, // ne s'affichait pas — à vérifier sur Airbnb
    checkin: "2026-08-01", checkout: "2026-08-08",
    guests: 14, bedrooms: 5, baths: "4",
    rating: "5,0",
    lat: 45.93384, lng: 6.75344,
    perks: ["piscine", "spa", "sauna", "jacuzzi", "salle de sport", "jardin", "parking"]
  },
  {
    id: "43332322",
    title: "Villa contemporaine — piscine chauffée",
    city: "Saint-Cyr-sur-Mer",
    region: "Var — côte",
    url: "https://www.airbnb.fr/rooms/43332322?check_in=2026-08-01&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: 5047,
    checkin: "2026-08-01", checkout: "2026-08-08",
    guests: 10, bedrooms: 4, baths: "4",
    rating: "4,88",
    lat: 43.18935, lng: 5.68322,
    perks: ["piscine chauffée", "clim", "barbecue", "parking"]
  },
  {
    id: "54143335",
    title: "Le Majestic Mind — vue mer d'exception",
    city: "La Grande-Motte",
    region: "Occitanie — mer",
    url: "https://www.airbnb.fr/rooms/54143335?check_in=2026-08-01&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: 4509,
    checkin: "2026-08-01", checkout: "2026-08-08",
    guests: 8, bedrooms: 4, baths: "2",
    rating: "4,91",
    lat: 43.5571, lng: 4.0879,
    perks: ["vue mer", "piscine", "clim", "garage", "appartement"]
  },
  {
    id: "857816540820477764",
    title: "Mas le Garric — lieu éco-responsable",
    city: "Nîmes",
    region: "Gard / Avignon",
    url: "https://www.airbnb.fr/rooms/857816540820477764?check_in=2026-08-01&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: 4011,
    checkin: "2026-08-01", checkout: "2026-08-08",
    guests: 8, bedrooms: 4, baths: "4",
    rating: "4,91",
    lat: 43.8739, lng: 4.3657,
    perks: ["piscine", "jacuzzi", "jardin", "barbecue", "pétanque", "éco-responsable"]
  },
  {
    id: "9357886",
    title: "La Salamandre Bleue",
    city: "Chantemerle-lès-Grignan",
    region: "Drôme provençale",
    url: "https://www.airbnb.fr/rooms/9357886?check_in=2026-08-01&check_out=2026-08-08&guests=8&adults=7&children=1&infants=2",
    price: null, // ne s'affichait pas — à vérifier sur Airbnb
    checkin: "2026-08-01", checkout: "2026-08-08",
    guests: 12, bedrooms: 5, baths: "3,5",
    rating: "4,96",
    lat: 44.40362, lng: 4.83475,
    perks: ["piscine", "jacuzzi", "cheminée", "pétanque"]
  },
  {
    id: "619372808921130995",
    title: "Villa La Rodina — usage exclusif, 12 personnes",
    city: "Diano Marina",
    region: "Italie — Ligurie",
    url: "https://www.airbnb.fr/rooms/619372808921130995?check_in=2026-08-02&check_out=2026-08-09&guests=8&adults=7&children=1&infants=2",
    price: 4746,
    checkin: "2026-08-02", checkout: "2026-08-09",
    guests: 12, bedrooms: 4, baths: "2",
    rating: "4,9",
    lat: 43.91892, lng: 8.09063,
    perks: ["piscine", "jacuzzi", "clim", "jardin", "barbecue", "parking"]
  }
];
const BUDGET_MAX = 5500;
