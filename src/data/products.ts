import {type Product } from "../types";

export const PRODUCTS: Product[] = [
  {
    id: "p-1",
    name: "Vélo Route Aero X1",
    brand: "Cyclo",
    category: "Vélos",
    price: 129999,
    rating: 4.6,
    stock: 7,
    image: "https://picsum.photos/seed/bike1/600/400",
    description: "Cadre carbone, transmission 12v, freinage disque.",
    specs: { Poids: "7.5 kg", Taille: "M/L", Couleur: "Noir" },
    tags: ["route", "carbone", "disque"]
  },
  {
    id: "p-2",
    name: "Casque AirFlow Pro",
    brand: "SafeRider",
    category: "Équipements",
    price: 8999,
    rating: 4.4,
    stock: 25,
    image: "https://picsum.photos/seed/helmet/600/400",
    description: "Aération avancée et molette de réglage.",
    specs: { Poids: "220 g", Taille: "M", Certification: "CE" },
    tags: ["casque", "sécurité"]
  },
  {
    id: "p-3",
    name: "Gants Grip Gel",
    brand: "Gripster",
    category: "Équipements",
    price: 2999,
    rating: 4.1,
    stock: 40,
    image: "https://picsum.photos/seed/gloves/600/400",
    description: "Paume gel, évacuation de la transpiration.",
    tags: ["gants"]
  }
];
