// ============================================================
// MOCK DATA — Marketplace Romania
// ============================================================

var CATEGORIES = [
  "Electronice", "Auto", "Imobiliare", "Sport", "Modă",
  "Casă & Grădină", "Servicii", "Altele"
];

var CITIES = [
  "București", "Cluj-Napoca", "Timișoara", "Iași", "Brașov",
  "Constanța", "Craiova", "Galați", "Ploiești", "Sibiu", "Online"
];

var MOCK_LISTINGS = [
  {
    id: 1,
    title: "iPhone 14 Pro 256GB Deep Purple",
    price: 4500,
    city: "București",
    category: "Electronice",
    description: "iPhone 14 Pro în stare excelentă, folosit 8 luni. Vine cu carcasă originală și cablu Lightning–USB-C. Baterie la 94%. Nu are nicio zgârietură sau fisură. Cutie originală inclusă. Garanție Apple până în decembrie 2024.",
    seller: { id: 1, name: "Ion Popescu", rating: 4.8, totalListings: 12, memberSince: "2023" },
    status: "active", date: "23 mai 2026", views: 142, featured: true
  },
  {
    id: 2,
    title: "Bicicletă MTB Scott Aspect 930 27.5\"",
    price: 1200,
    city: "Cluj-Napoca",
    category: "Sport",
    description: "Bicicletă mountain bike Scott Aspect 930, cadru aluminiu, furcă suspendată 100mm, roți 27.5 inch. Folosită un sezon, impecabilă. Schimbătoare Shimano Deore, frâne hidraulice Shimano MT200.",
    seller: { id: 2, name: "Maria Dumitru", rating: 4.5, totalListings: 7, memberSince: "2024" },
    status: "active", date: "22 mai 2026", views: 89, featured: false
  },
  {
    id: 3,
    title: "Apartament 2 camere, zona Floreasca",
    price: 120000,
    city: "București",
    category: "Imobiliare",
    description: "Apartament 2 camere decomandat, etaj 3/8, 58mp utili. Renovat complet 2023. Parcare inclusă în preț. Orientat sud-vest, luminos. Bloc 1985, izolat termic. Zonă centrală, aproape de metrou.",
    seller: { id: 3, name: "Andrei Ionescu", rating: 5.0, totalListings: 3, memberSince: "2022" },
    status: "active", date: "21 mai 2026", views: 312, featured: true
  },
  {
    id: 4,
    title: "Laptop ASUS ROG Strix G15 Gaming",
    price: 5800,
    city: "Timișoara",
    category: "Electronice",
    description: "Laptop gaming ASUS ROG Strix G15, AMD Ryzen 9 5900HX, RTX 3070 8GB, 32GB RAM DDR4, 1TB SSD NVMe. Display 15.6\" 144Hz. Garanție 8 luni. Include geantă originală.",
    seller: { id: 4, name: "Cristian Moldovan", rating: 4.7, totalListings: 21, memberSince: "2021" },
    status: "active", date: "20 mai 2026", views: 201, featured: false
  },
  {
    id: 5,
    title: "Jachetă Columbia Powder Lite — măr. L",
    price: 280,
    city: "Brașov",
    category: "Modă",
    description: "Jachetă Columbia Powder Lite, mărime L, culoare navy/gri. Folosită 2 sezoane de ski, spălată și curățată. Umplutură ThermaRator, rezistentă la apă. Stare bună.",
    seller: { id: 5, name: "Elena Constantin", rating: 4.3, totalListings: 15, memberSince: "2023" },
    status: "active", date: "19 mai 2026", views: 67, featured: false
  },
  {
    id: 6,
    title: "VW Golf 7 1.6 TDI 2016 — 135.000 km",
    price: 14500,
    city: "Cluj-Napoca",
    category: "Auto",
    description: "VW Golf 7, 1.6 TDI 110 CP, 2016, 135.000 km reali documentați. Climatronic, scaune încălzite, senzori parcare față–spate, cruise control. Carte service completă la dealer. Fără accidente.",
    seller: { id: 1, name: "Ion Popescu", rating: 4.8, totalListings: 12, memberSince: "2023" },
    status: "active", date: "18 mai 2026", views: 445, featured: false
  },
  {
    id: 7,
    title: "Canapea extensibilă 3 locuri, bej",
    price: 950,
    city: "Iași",
    category: "Casă & Grădină",
    description: "Canapea extensibilă 3 locuri, material textil bej, spațiu depozitare sub saltea. Dimensiuni: 230×90cm, deschisă 200cm. Cumpărată acum 2 ani, în stare bună. Posibilitate transport.",
    seller: { id: 6, name: "Radu Popa", rating: 4.1, totalListings: 8, memberSince: "2024" },
    status: "paused", date: "17 mai 2026", views: 134, featured: false
  },
  {
    id: 8,
    title: "PlayStation 5 + 2 controllere + 3 jocuri",
    price: 2800,
    city: "București",
    category: "Electronice",
    description: "PlayStation 5 disc edition în stare perfectă + 2 controllere DualSense (alb + negru) + 3 jocuri: God of War Ragnarök, Spider-Man 2, Hogwarts Legacy. Vând tot pachetul.",
    seller: { id: 7, name: "Alex Toma", rating: 4.9, totalListings: 5, memberSince: "2025" },
    status: "sold", date: "16 mai 2026", views: 523, featured: false
  },
  {
    id: 9,
    title: "Meditații programare web (React / JS)",
    price: 150,
    city: "Online",
    category: "Servicii",
    description: "Ofer meditații de programare web: HTML, CSS, JavaScript, React. Prețul este per oră/sesiune. Pachet 10 ore la 1.200 RON. Online via Teams/Zoom. 3+ ani experiență predare.",
    seller: { id: 8, name: "Dan Florescu", rating: 5.0, totalListings: 1, memberSince: "2024" },
    status: "active", date: "15 mai 2026", views: 78, featured: false
  },
  {
    id: 10,
    title: "Frigider Samsung 350L NoFrost A++",
    price: 1100,
    city: "Constanța",
    category: "Casă & Grădină",
    description: "Frigider Samsung RT35K5440S8, 350L, clasa A++, sistem NoFrost, înălțime 185cm, lățime 60cm. 2 ani garanție rămași la producător. Stare perfectă, mutat de urgență.",
    seller: { id: 9, name: "Mihaela Dinu", rating: 4.6, totalListings: 4, memberSince: "2023" },
    status: "active", date: "14 mai 2026", views: 167, featured: false
  },
  {
    id: 11,
    title: "Skateboard complet Element 8\"",
    price: 380,
    city: "Brașov",
    category: "Sport",
    description: "Skateboard complet Element Disperse 8 inch, roți Bones 52mm, rulmenți ABEC 7, truck Tensor. Folosit 3 luni de un intermediar. Grip aplicat recent.",
    seller: { id: 10, name: "Vlad Stan", rating: 4.2, totalListings: 6, memberSince: "2024" },
    status: "active", date: "13 mai 2026", views: 43, featured: false
  },
  {
    id: 12,
    title: "Camera Nikon D7500 + obiectiv 18–140mm",
    price: 3200,
    city: "Sibiu",
    category: "Electronice",
    description: "Camera foto Nikon D7500 + obiectiv Nikon 18–140mm f/3.5–5.6G VR + grip + 2 acumulatori originali + geantă Lowepro. 12.000 cadre. Stare excelentă, fără defecte.",
    seller: { id: 3, name: "Andrei Ionescu", rating: 5.0, totalListings: 3, memberSince: "2022" },
    status: "active", date: "12 mai 2026", views: 289, featured: false
  }
];

var MOCK_USERS = [
  { id: 1, name: "Ion Popescu",      email: "ion.popescu@email.com",   status: "active",  listings: 12, memberSince: "Mar 2023", role: "user" },
  { id: 2, name: "Maria Dumitru",    email: "maria.d@email.com",        status: "active",  listings: 7,  memberSince: "Ian 2024", role: "user" },
  { id: 3, name: "Andrei Ionescu",   email: "andrei.i@email.com",       status: "active",  listings: 3,  memberSince: "Iul 2022", role: "user" },
  { id: 4, name: "Cristian Moldovan",email: "cristian.m@email.com",     status: "blocked", listings: 21, memberSince: "Nov 2021", role: "user" },
  { id: 5, name: "Elena Constantin", email: "elena.c@email.com",        status: "active",  listings: 15, memberSince: "Sep 2023", role: "user" },
  { id: 6, name: "Radu Popa",        email: "radu.p@email.com",         status: "active",  listings: 8,  memberSince: "Feb 2024", role: "user" },
  { id: 7, name: "Alex Toma",        email: "alex.t@email.com",         status: "active",  listings: 5,  memberSince: "Ian 2025", role: "user" },
  { id: 8, name: "Dan Florescu",     email: "dan.f@email.com",          status: "active",  listings: 1,  memberSince: "Mar 2024", role: "user" },
  { id: 9, name: "Admin Principal",  email: "admin@marketplace.ro",     status: "active",  listings: 0,  memberSince: "Ian 2021", role: "admin" }
];

var DEFAULT_USER = {
  id: 99,
  name: "Alexandru Radu",
  email: "alex.radu@email.com",
  memberSince: "Apr 2024",
  role: "user"
};

var ADMIN_USER = {
  id: 9,
  name: "Admin Principal",
  email: "admin@marketplace.ro",
  memberSince: "Ian 2021",
  role: "admin"
};
