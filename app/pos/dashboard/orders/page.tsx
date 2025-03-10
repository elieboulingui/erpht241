"use client"

import { useState } from "react"
import {
  Search,
  Calendar,
  Bell,
  Plus,
  Share,
  MoreVertical,
  Home,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Modifier les données des ventes pour inclure les informations client
const ventes = [
  {
    id: 24616,
    date: "10 Mars 2025",
    heure: "11:45",
    montant: 316000,
    mode: "Espèces",
    produits: ["Sony WH-1000XM4", "HP Pavilion"],
    client: "Thomas Dubois",
  },
  {
    id: 24615,
    date: "10 Mars 2025",
    heure: "11:40",
    montant: 120000,
    mode: "Mobile",
    produits: ["Bose QuietComfort"],
    client: "Marie Laurent",
  },
  {
    id: 24614,
    date: "10 Mars 2025",
    heure: "11:30",
    montant: 64000,
    mode: "Mobile",
    produits: ["Accessoires divers"],
    client: "Jean Petit",
  },
  {
    id: 24613,
    date: "10 Mars 2025",
    heure: "11:21",
    montant: 227000,
    mode: "Carte",
    produits: ["Dell XPS 13"],
    client: "Sophie Martin",
  },
  {
    id: 24612,
    date: "10 Mars 2025",
    heure: "11:14",
    montant: 145000,
    mode: "Espèces",
    produits: ["Canon PIXMA"],
    client: "Lucas Bernard",
  },
  {
    id: 24611,
    date: "10 Mars 2025",
    heure: "10:59",
    montant: 100000,
    mode: "Mobile",
    produits: ["Accessoires divers"],
    client: "Emma Dupont",
  },
  {
    id: 24610,
    date: "10 Mars 2025",
    heure: "10:37",
    montant: 454000,
    mode: "Carte",
    produits: ["MacBook Air"],
    client: "Antoine Moreau",
  },
  {
    id: 24609,
    date: "10 Mars 2025",
    heure: "10:22",
    montant: 260000,
    mode: "Carte",
    produits: ["Sony WH-1000XM4", "Accessoires divers"],
    client: "Camille Leroy",
  },
  {
    id: 24608,
    date: "10 Mars 2025",
    heure: "10:12",
    montant: 30000,
    mode: "Espèces",
    produits: ["Accessoires divers"],
    client: "Hugo Roux",
  },
]

// Ajouter l'état pour la recherche
export default function Orders() {

  const [periodeFiltre, setPeriodeFiltre] = useState("Quotidien")
  const [recherche, setRecherche] = useState("")

  // Filtrer les ventes en fonction de la recherche
  const ventesFiltrees = ventes.filter(
    (vente) =>
      vente.client.toLowerCase().includes(recherche.toLowerCase()) ||
      vente.id.toString().includes(recherche) ||
      vente.produits.some((produit) => produit.toLowerCase().includes(recherche.toLowerCase())) ||
      vente.montant.toString().includes(recherche),
  )

  // Formater le prix en FCFA
  const formatPrice = (price:any) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  // Obtenir la classe de badge pour le mode de paiement
  const getModeBadgeClass = (mode:any) => {
    switch (mode) {
      case "Espèces":
        return "bg-gray-100 text-gray-800"
      case "Carte":
        return "bg-blue-100 text-blue-800"
      case "Mobile":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (

        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Ajouter la barre de recherche sous le titre de la page */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">Historique des Ventes</h1>
              <div className="flex items-center">
                <div className="relative mr-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-10 w-64 bg-white"
                    placeholder="Rechercher..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                  />
                </div>
                <Select value={periodeFiltre} onValueChange={setPeriodeFiltre}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quotidien">Quotidien</SelectItem>
                    <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                    <SelectItem value="Mensuel">Mensuel</SelectItem>
                    <SelectItem value="Annuel">Annuel</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Exporter en PDF</DropdownMenuItem>
                    <DropdownMenuItem>Exporter en Excel</DropdownMenuItem>
                    <DropdownMenuItem>Imprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">N° Facture</th>
                    <th className="text-left py-4 px-4 font-semibold">Date</th>
                    <th className="text-left py-4 px-4 font-semibold">Heure</th>
                    <th className="text-left py-4 px-4 font-semibold">Client</th>
                    <th className="text-left py-4 px-4 font-semibold">Montant</th>
                    <th className="text-left py-4 px-4 font-semibold">Mode de Paiement</th>
                    <th className="text-right py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ventesFiltrees.map((vente) => (
                    <tr key={vente.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{vente.id}</td>
                      <td className="py-4 px-4">{vente.date}</td>
                      <td className="py-4 px-4">{vente.heure}</td>
                      <td className="py-4 px-4 font-medium">{vente.client}</td>
                      <td className="py-4 px-4 font-medium">{formatPrice(vente.montant)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getModeBadgeClass(vente.mode)}`}>
                          {vente.mode}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="default" size="sm" className="mr-2 bg-orange-500 hover:bg-orange-600">
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="border-orange-500 text-orange-500">
                          <Share className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Affichage de 1 à {ventesFiltrees.length} sur {ventes.length} entrées
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Précédent
                </Button>
                <Button variant="outline" size="sm" className="bg-orange-500 text-white border-orange-500">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>

  )
}

