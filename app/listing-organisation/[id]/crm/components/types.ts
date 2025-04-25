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
  contacts: Contact[];
};

export type Deal = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  merchantId?: string;
  tags: string[];
  tagColors: string[];
  icons?: string[];
  avatar?: string;
  iconColors?: string[];
  deadline?: string;
};

export type DealStage = {
  id: string;
  title: string;
  color: string;
};

export const INITIAL_DEAL_STAGES: DealStage[] = [
  {
    id: "new",
    title: "Nouveau",
    color: "bg-gray-500",
  },
  {
    id: "qualified",
    title: "Qualifié",
    color: "bg-orange-300",
  },
  {
    id: "proposal",
    title: "Proposition",
    color: "bg-red-500",
  },
  {
    id: "won",
    title: "Gagné",
    color: "bg-green-500",
  },
  {
    id: "lost",
    title: "Perdu",
    color: "bg-black",
  },
];

export const merchantsData: Merchant[] = [
  {
    id: "m1",
    name: "Dec Ads/dt",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    contacts: [
      {
        id: "c1",
        name: "Sophie Martin",
        email: "sophie@decads.com",
        phone: "+123456789",
        position: "Sales Manager",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "c2",
        name: "Pierre Dupont",
        email: "pierre@decads.com",
        phone: "+987654321",
        position: "Account Executive",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
      }
    ]
  },
  {
    id: "m2",
    name: "Ready M4K",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    contacts: [
      {
        id: "c3",
        name: "Jean Leroy",
        email: "jean@readym4k.com",
        phone: "+1122334455",
        position: "CEO",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
      }
    ]
  },
  {
    id: "m3",
    name: "Azure Interior",
    photo: "https://randomuser.me/api/portraits/women/50.jpg",
    contacts: [
      {
        id: "c4",
        name: "Marie Lambert",
        email: "marie@azure.com",
        phone: "+3344556677",
        position: "Design Director",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg"
      },
      {
        id: "c5",
        name: "Thomas Garnier",
        email: "thomas@azure.com",
        phone: "+5566778899",
        position: "Project Manager",
        avatar: "https://randomuser.me/api/portraits/men/30.jpg"
      }
    ]
  }
];

export const initialDealsData: Record<string, Deal[]> = {
  new: [
    {
      id: "new-1",
      title: "Office Design Project",
      description: "Conception de bureau moderne pour espace ouvert",
      amount: 24000,
      merchantId: "m1",
      tags: ["Design", "Urgent"],
      tagColors: ["bg-purple-100 text-purple-800", "bg-red-100 text-red-800"],
      iconColors: ["text-blue-500"],
      deadline: "2023-12-15",
    },
    {
      id: "new-2",
      title: "Global Solutions Furnitures",
      description: "Meubles de bureau haut de gamme",
      amount: 3800,
      merchantId: "m2",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
    },
  ],
  qualified: [
    {
      id: "qualified-1",
      title: "Quote for 12 Tables",
      description: "Devis pour tables de conférence",
      amount: 40000,
      merchantId: "m1",
      tags: ["Product", "Important"],
      tagColors: ["bg-blue-100 text-blue-800", "bg-yellow-100 text-yellow-800"],
    },
    {
      id: "qualified-2",
      title: "Global Solutions Furnitures",
      description: "Meubles pour espace coworking",
      amount: 3800,
      merchantId: "m2",
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
    },
  ],
  proposal: [
    {
      id: "proposal-1",
      title: "Defiance to Computer Desks",
      description: "Bureaux informatiques sur mesure",
      amount: 35500,
      merchantId: "m2",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
      iconColors: ["text-blue-500"],
    },
    {
      id: "proposal-2",
      title: "Balance Inc: Potential Distributor",
      description: "Partenariat de distribution",
      amount: 1000,
      merchantId: "m3",
      tags: ["Services"],
      tagColors: ["bg-orange-100 text-orange-800"],
    },
  ],
  won: [
    {
      id: "won-1",
      title: "Proposition",
      description: "Projet signé avec client premium",
      amount: 11000,
      merchantId: "m1",
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
      iconColors: ["text-green-500"],
    },
    {
      id: "won-2",
      title: "Modern Open Space",
      description: "Aménagement d'espace ouvert",
      amount: 4500,
      merchantId: "m3",
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
    },
  ],
  lost: [
    {
      id: "lost-1",
      title: "Customizable Desk",
      description: "Bureau modulable haut de gamme",
      amount: 15000,
      merchantId: "m3",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
    },
    {
      id: "lost-2",
      title: "Need 20 Desks",
      description: "Commande groupée de bureaux",
      amount: 60000,
      merchantId: "m1",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
    },
  ],
};