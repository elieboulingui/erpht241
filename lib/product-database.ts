// Base de données des produits HIGH TECH 241
export const ProductDatabase = [
  // ORDINATEURS PORTABLES
  {
    id: "lp001",
    name: 'Ordinateur Portable HP Basic 15.6"',
    category: "Ordinateur Portable",
    price: 250000,
    description: "Intel Celeron, 4GB RAM, 500GB HDD, Windows 10",
    stock: 15,
  },
  {
    id: "lp002",
    name: "Ordinateur Portable Dell Inspiron 15",
    category: "Ordinateur Portable",
    price: 350000,
    description: "Intel Core i3, 8GB RAM, 256GB SSD, Windows 11",
    stock: 10,
  },
  {
    id: "lp003",
    name: "Ordinateur Portable Lenovo ThinkPad",
    category: "Ordinateur Portable",
    price: 450000,
    description: "Intel Core i5, 8GB RAM, 512GB SSD, Windows 11 Pro",
    stock: 8,
  },
  {
    id: "lp004",
    name: "Ordinateur Portable MacBook Air",
    category: "Ordinateur Portable",
    price: 650000,
    description: "Apple M1, 8GB RAM, 256GB SSD, macOS",
    stock: 5,
  },

  // ORDINATEURS DE BUREAU
  {
    id: "dt001",
    name: "Ordinateur de Bureau HP Pavilion",
    category: "Ordinateur de Bureau",
    price: 300000,
    description: "Intel Core i3, 8GB RAM, 1TB HDD, Windows 10",
    stock: 7,
  },
  {
    id: "dt002",
    name: "Ordinateur de Bureau Dell OptiPlex",
    category: "Ordinateur de Bureau",
    price: 400000,
    description: "Intel Core i5, 8GB RAM, 256GB SSD, Windows 11 Pro",
    stock: 6,
  },

  // IMPRIMANTES
  {
    id: "pr001",
    name: "Imprimante HP LaserJet Basic",
    category: "Imprimante",
    price: 85000,
    description: "Imprimante laser monochrome, 20 ppm",
    stock: 12,
  },
  {
    id: "pr002",
    name: "Imprimante Canon PIXMA",
    category: "Imprimante",
    price: 65000,
    description: "Imprimante à jet d'encre couleur, scanner",
    stock: 8,
  },

  // ÉCRANS
  {
    id: "mn001",
    name: 'Écran HP 22"',
    category: "Écran",
    price: 75000,
    description: "Écran Full HD, 75Hz, HDMI",
    stock: 10,
  },
  {
    id: "mn002",
    name: 'Écran Dell 24" IPS',
    category: "Écran",
    price: 120000,
    description: "Écran IPS Full HD, 60Hz, HDMI/DisplayPort",
    stock: 7,
  },

  // ACCESSOIRES
  {
    id: "ac001",
    name: "Clavier et Souris Logitech",
    category: "Accessoire",
    price: 25000,
    description: "Ensemble clavier et souris sans fil",
    stock: 20,
  },
  {
    id: "ac002",
    name: "Disque Dur Externe Seagate 1TB",
    category: "Accessoire",
    price: 45000,
    description: "Disque dur externe USB 3.0, 1TB",
    stock: 15,
  },
  {
    id: "ac003",
    name: "Câble HDMI Premium 2m",
    category: "Accessoire",
    price: 7500,
    description: "Câble HDMI 2.0 haute vitesse, 4K",
    stock: 40,
  },
  {
    id: "ac004",
    name: "Câble d'alimentation HP",
    category: "Accessoire",
    price: 15000,
    description: "Câble d'alimentation pour ordinateurs portables HP",
    stock: 25,
  },
  {
    id: "ac005",
    name: "Souris Gaming Razer",
    category: "Accessoire",
    price: 40000,
    description: "Souris gaming filaire, 16000 DPI, RGB",
    stock: 7,
  },
  {
    id: "ac006",
    name: "Adaptateur HDMI vers VGA",
    category: "Accessoire",
    price: 8000,
    description: "Convertisseur HDMI vers VGA",
    stock: 30,
  },
  {
    id: "ac007",
    name: "Câble Ethernet CAT6 3m",
    category: "Accessoire",
    price: 6000,
    description: "Câble réseau Gigabit Ethernet",
    stock: 50,
  },
  {
    id: "ac008",
    name: "Hub USB-C 7-en-1",
    category: "Accessoire",
    price: 28000,
    description: "Hub USB-C avec HDMI, USB 3.0, lecteur de carte SD",
    stock: 12,
  },
  {
    id: "ac009",
    name: "Batterie Externe 20000mAh",
    category: "Accessoire",
    price: 35000,
    description: "Batterie portable avec USB-C PD",
    stock: 8,
  },
  {
    id: "ac010",
    name: "Support pour Ordinateur Portable",
    category: "Accessoire",
    price: 18000,
    description: "Support ergonomique ajustable en aluminium",
    stock: 15,
  }
] as const;

// Types TypeScript pour une meilleure sécurité
export type Product = typeof ProductDatabase[number];
export type ProductCategory = Product['category'];

/**
 * Fonction de recherche de produits
 * @param options - Options de recherche
 * @returns Tableau de produits correspondants
 */
export function searchProducts(options: {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: ProductCategory;
  limit?: number;
} = {}) {
  const { query = '', minPrice, maxPrice, category, limit } = options;
  
  return ProductDatabase.filter((product) => {
    const matchesText = 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    
    const matchesPrice = 
      (minPrice ? product.price >= minPrice : true) &&
      (maxPrice ? product.price <= maxPrice : true);
    
    const matchesCategory = category ? product.category === category : true;
    
    return matchesText && matchesPrice && matchesCategory;
  }).slice(0, limit);
}

/**
 * Trouve un produit par son ID
 * @param id - ID du produit
 * @returns Produit ou undefined si non trouvé
 */
export function getProductById(id: string): Product | undefined {
  return ProductDatabase.find(product => product.id === id);
}