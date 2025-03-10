import {
    Package,
    BarChart2,
    MapPin,
    PenTool,
    ShoppingCart,
    Users,
    ClipboardList,
    Truck,
    FileText,
    Lock,
  } from "lucide-react"
  
  const features = [
    { icon: Package, label: "Produits" },
    { icon: BarChart2, label: "Suivi" },
    { icon: MapPin, label: "Emplacements" },
    { icon: PenTool, label: "Ajustements" },
    { icon: ShoppingCart, label: "Ventes" },
    { icon: Users, label: "Clients" },
    { icon: ClipboardList, label: "Achats" },
    { icon: Truck, label: "Fournisseurs" },
    { icon: FileText, label: "Rapports" },
    { icon: Lock, label: "Utilisateurs" },
  ]
  
  const supplierFeatures = [
    "Base de données fournisseurs complète",
    "Cartographie des relations produits-fournisseurs",
    "Métriques de performance fournisseur",
    "Suivi des délais pour prévisions améliorées",
    "Options multiples de fournisseurs par produit",
    "Gestion des contacts fournisseurs",
    "Suivi des contrats et accords",
    "Désignation des fournisseurs privilégiés",
  ]
  
  export default function FeaturesSection() {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-black font-bold tracking-tight mb-6">
              Fonctionnalités Puissantes pour un{" "}
              <span className="relative">
                Contrôle d'Inventaire
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-cyan-100 opacity-30 -rotate-2 rounded"></div>
              </span>{" "}
              Complet
            </h2>
            <p className="text-xl text-gray-600">
              De la gestion des produits aux rapports détaillés, Inventory Pro couvre tous vos besoins en gestion de
              stock.
            </p>
          </div>
  
          {/* Navigation des fonctionnalités */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-8 max-w-7xl">
            {features.map((feature) => (
              <button
                key={feature.label}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-white hover:shadow-md transition-all"
              >
                <feature.icon className="w-6 h-6 mb-2 text-gray-600" />
                <span className="text-sm text-gray-600">{feature.label}</span>
              </button>
            ))}
          </div>
  
          {/* Section Gestion des Fournisseurs */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">Gestion des Fournisseurs</h3>
                <p className="text-gray-600">
                  Gérez les relations fournisseurs et liez les produits aux vendeurs préférés pour des achats optimisés.
                </p>
              </div>
            </div>
  
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {supplierFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-50 flex items-center justify-center">
                    <svg className="w-3 h-3 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  