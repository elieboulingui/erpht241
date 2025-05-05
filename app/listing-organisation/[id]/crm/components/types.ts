export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  avatar?: string;
};

export type Merchant = {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  role: string;
  contacts: Contact[];
};

export type Deal = {
  id: string;
  label: string;
  description?: string;
  amount: number;
  merchantId?: string;
  tags: string[];
  tagColors: string[];
  icons?: string[];
  contactId?: string;
  avatar?: string;
  iconColors?: string[];
  deadline?: string;
  stepId?: string;
};

export type DealStage = {
  id: string;
  label: string;
  color: string;
};

export const INITIAL_DEAL_STAGES: DealStage[] = [
  {
    id: "new",
    label: "Nouveau",
    color: "bg-gray-500",
  },
  {
    id: "qualified",
    label: "Qualifié",
    color: "bg-orange-300",
  },
  {
    id: "proposal",
    label: "Proposition",
    color: "bg-red-500",
  },
  {
    id: "won",
    label: "Gagné",
    color: "bg-green-500",
  },
  {
    id: "lost",
    label: "Perdu",
    color: "bg-black",
  },
];

export const merchantsData: Merchant[] = [
  {
    id: "m1",
    name: "Fatoumata Diallo",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    phone: "+241 01 23 45 67",
    email: "contact@designinterieur.ga",
    role: "Fournisseur de solutions d'aménagement",
    contacts: [
      {
        id: "c1",
        name: "Aïcha Bongo",
        email: "aicha@designinterieur.ga",
        phone: "+241 06 12 34 56",
        position: "Directrice Commerciale",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg"
      },
      {
        id: "c2",
        name: "Kévin Mba",
        email: "kevin@designinterieur.ga",
        phone: "+241 07 65 43 21",
        position: "Responsable Projets",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    ]
  },
  {
    id: "m2",
    name: "Pauline Mba",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    phone: "+241 02 34 56 78",
    email: "info@mobilierpro.ga",
    role: "Fabricant de mobilier de bureau",
    contacts: [
      {
        id: "c3",
        name: "Jean Ondo",
        email: "jean@mobilierpro.ga",
        phone: "+241 01 23 45 67",
        position: "Directeur Général",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg"
      }
    ]
  },
  {
    id: "m3",
    name: "Jean Ondo",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    phone: "+241 03 45 67 89",
    email: "contact@solutionsbureau.ga",
    role: "Intégrateur de solutions professionnelles",
    contacts: [
      {
        id: "c4",
        name: "Fatoumata Diallo",
        email: "fatou@solutionsbureau.ga",
        phone: "+241 04 56 78 90",
        position: "Directrice Créative",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "c5",
        name: "Mohamed Diop",
        email: "mohamed@solutionsbureau.ga",
        phone: "+241 05 67 89 01",
        position: "Chef de Projet",
        avatar: "https://randomuser.me/api/portraits/men/36.jpg"
      }
    ]
  }
];

export const initialDealsData: Record<string, Deal[]> = {
  new: [
    {
      id: "new-1",
      label: "Projet Aménagement Bureau",
      description: "Conception de bureau moderne pour espace ouvert à Libreville",
      amount: 24000,
      merchantId: "m1",
      contactId: "c1", // Ajouté
      tags: ["Design", "Urgent"],
      tagColors: ["bg-purple-100 text-purple-800", "bg-red-100 text-red-800"],
      iconColors: ["text-blue-500"],
      deadline: "2023-12-15",
    },
    {
      id: "new-2",
      label: "Mobilier Haut de Gamme",
      description: "Meubles de bureau premium pour entreprise",
      amount: 3800,
      merchantId: "m2",
      contactId: "c3", // Ajouté
      tags: ["Produit"],
      tagColors: ["bg-blue-100 text-blue-800"],
    },
  ],
  qualified: [
    {
      id: "qualified-1",
      label: "Devis pour 12 Tables",
      description: "Tables de conférence pour salle de réunion",
      amount: 40000,
      merchantId: "m1",
      contactId: "c2", // Ajouté
      tags: ["Produit", "Important"],
      tagColors: ["bg-blue-100 text-blue-800", "bg-yellow-100 text-yellow-800"],
    },
    {
      id: "qualified-2",
      label: "Espace Coworking",
      description: "Aménagement d'espace de travail partagé",
      amount: 3800,
      merchantId: "m2",
      contactId: "c3", // Ajouté
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
    },
  ],
  proposal: [
    {
      id: "proposal-1",
      label: "Bureaux Informatiques Sur Mesure",
      description: "Conception de postes de travail ergonomiques",
      amount: 35500,
      merchantId: "m2",
      contactId: "c3", // Ajouté
      tags: ["Produit"],
      tagColors: ["bg-blue-100 text-blue-800"],
      iconColors: ["text-blue-500"],
    },
    {
      id: "proposal-2",
      label: "Partenariat Distribution",
      description: "Accord de distribution exclusive",
      amount: 1000,
      merchantId: "m3",
      contactId: "c4", // Ajouté
      tags: ["Service"],
      tagColors: ["bg-orange-100 text-orange-800"],
    },
  ],
  won: [
    {
      id: "won-1",
      label: "Projet Client Premium",
      description: "Contrat signé avec une grande entreprise gabonaise",
      amount: 11000,
      merchantId: "m1",
      contactId: "c1", // Ajouté
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
      iconColors: ["text-green-500"],
    },
    {
      id: "won-2",
      label: "Espace Moderne",
      description: "Aménagement complet d'un open space",
      amount: 4500,
      merchantId: "m3",
      contactId: "c5", // Ajouté
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
    },
  ],
  lost: [
    {
      id: "lost-1",
      label: "Bureau Modulable",
      description: "Proposition non retenue pour bureau directeur",
      amount: 15000,
      merchantId: "m3",
      contactId: "c4", // Ajouté
      tags: ["Produit"],
      tagColors: ["bg-blue-100 text-blue-800"],
    },
    {
      id: "lost-2",
      label: "Commande Groupée",
      description: "20 bureaux pour administration publique",
      amount: 60000,
      merchantId: "m1",
      contactId: "c2", // Ajouté
      tags: ["Produit"],
      tagColors: ["bg-blue-100 text-blue-800"],
    },
  ],
};