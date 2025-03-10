import { useState } from "react";
import { ChartNoAxesColumnIncreasing, Database, KeySquare, ShoppingCart, Store, Users } from "lucide-react";

const modules = [
  {
    label : "Produits",
    title: "Gestion du catalogue de produits",
    description:
      "Créez et gérez des informations produit complètes avec des attributs, une catégorisation et des prix personnalisés.",
    icon: <Database  className="w-6 h-6" />,
    features: [
      "Création de produits intuitive avec des attributs personnalisables",
      "Système de génération et de gestion des SKU",
      "Descriptions et spécifications détaillées des produits",
      "Organisation hiérarchique des catégories",
      "Gestion des coûts et des prix de vente",
      "Configuration du niveau de stock minimum",
      "Génération de codes-barres et de codes QR",
      "Capacités d'importation/exportation de produits"
    ]
  },
  {
    label : "Suivi",
    title: "Suivi des stocks en temps réel",
    description:
      "Surveillez vos niveaux de stock en temps réel avec des alertes automatisées et un suivi complet de l'historique.",
    icon: <ChartNoAxesColumnIncreasing className="w-6 h-6" />,
    features: [
      "Suivi de la quantité de bétail pour tous les produits",
      "Alertes de seuil de stock bas personnalisables",
      "Notifications par e-mail et dans l'application pour les événements d'inventaire",
      "Historique complet des mouvements d'inventaire",
      "Prévision du niveau des stocks basée sur des données historiques",
      "Suivi des lots et des dates d'expiration",
      "Suivi du numéro de série pour les articles de grande valeur",
      "Rapports d'évaluation des stocks avec les méthodes FIFO/LIFO",
    ]
  },
  {
    label : "Fournisseurs",
    title: "Gestion des Fournisseurs",
    description:
      "Gérez les relations fournisseurs et liez les produits aux vendeurs préférés pour des achats optimisés.",
    icon: <Store  className="w-6 h-6" />,
    features: [
      "Base de données fournisseurs complète",
      "Cartographie des relations produits-fournisseurs",
      "Métriques de performance fournisseur",
      "Suivi des délais pour prévisions améliorées",
      "Options multiples de fournisseurs par produit",
      "Gestion des contacts fournisseurs",
      "Suivi des contrats et accords",
      "Désignation des fournisseurs privilégiés",
    ]
  },
  {
    label : "Ventes",
    title: "Gestion des commandes de vente",
    description:
      "Traitez efficacement les commandes des clients avec un suivi du statut et une génération de factures automatisée.",
    icon: <ShoppingCart className="w-6 h-6"/>,
    features: [
      "Interface intuitive de création de commandes clients",
      "Vérification de la disponibilité des stocks en temps réel",
      "Suivi de l'état de la commande depuis sa création jusqu'à son exécution",
      "Génération automatisée de factures",
      "Options d'exécution partielle des commandes",
      "Historique des commandes et suivi des achats des clients",
      "Modèles de commandes personnalisables",
      "Intégration avec les fournisseurs de transport"
    ]
  },
  {
    label : "Clients",
    title: "Gestion de la relation client",
    description:
      "Maintenez des profils clients complets avec des prix spécialisés et un historique d’achat.",
    icon: <Users className="w-6 h-6" />,
    features: [
      "Base de données clients détaillée avec informations de contact",
      "Plusieurs adresses de livraison et de facturation",
      "Catégorisation des clients (détail vs. gros)",
      "Niveaux de tarification spécifiques au client",
      "Suivi complet de l'historique des achats",
      "Gestion des limites de crédit client",
      "Journal de l'historique des communications",
      "Analyses et informations sur les clients",
    ]
  },
  {
    label : "Role",
    title: "Contrôle d'accès basé sur les rôles",
    description:
      "Gestion sécurisée des utilisateurs avec des autorisations personnalisables pour différents rôles et responsabilités du personnel.",
    icon: <KeySquare className="w-6 h-6"/>,
    features: [
      "Définitions des rôles d'administrateur et d'utilisateur standard",
      "Capacités de création de rôles personnalisés",
      "Paramètres d'autorisation granulaires",
      "Restrictions d'accès spécifiques à l'emplacement",
      "Journalisation des actions et pistes d'audit",
      "Contrôles d'accès basés sur le temps",
      "Prise en charge de l'authentification à deux facteurs",
    ]
  }
];

export default function FeaturesSection() {

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="py-16 px-4 bg-gray-50 w-full">

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl text-black font-bold tracking-tight mb-6">
          Fonctionnalités Puissantes pour un{" "}
          <span className="relative">
            Contrôle d'Inventaire
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-red-100 opacity-30 -rotate-2 rounded"></div>
          </span>{" "}
          Complet
        </h2>
        <p className="text-xl text-gray-600">
          De la gestion des produits aux rapports détaillés, Safrimat IA couvre tous vos besoins en gestion de
          stock.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4 mb-8">
        {modules.map((module, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex flex-col items-center text-black p-4 rounded-lg transition-all ${activeIndex === index ? "bg-red-900 text-white" : "bg-gray-200 text-white-700"
              }`}
          >
            {module.icon}
            <span className="text-sm">{module.label}</span>
          </button>
        ))}
      </div>

      {/* Feature Content */}
      <div className="bg-white max-w-4xl mx-auto rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
            {modules[activeIndex].icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black">{modules[activeIndex].title}</h3>
            <p className="text-gray-600">{modules[activeIndex].description}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          {modules[activeIndex].features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-cyan-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
