"use client"
import { Search, Filter, MoreHorizontal, Plus, PenIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import PaginationGlobal from "@/components/paginationGlobal"
import { CreateCommandeForm } from "./CreateCommandeForm"

export default function TableauCommandes() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sample orders data
  const commandes = [
    {
      id: "CMD24106025",
      dateCommande: "05/03/2025",
      dateLivraison: "12/03/2025",
      client: "Dupont SARL",
      montant: "1250,00 fcfa",
      statut: "Validé",
    },
    {
      id: "CMD24100225",
      dateCommande: "03/03/2025",
      dateLivraison: "10/03/2025",
      client: "Martin & Co",
      montant: "875,50 fcfa",
      statut: "Expédié",
    },
    {
      id: "CMD24330225",
      dateCommande: "11/03/2025",
      dateLivraison: "18/03/2025",
      client: "Entreprise Dubois",
      montant: "2340,75 fcfa",
      statut: "Validé",
    },
    {
      id: "CMD24113225",
      dateCommande: "07/03/2025",
      dateLivraison: "14/03/2025",
      client: "Société Leroy",
      montant: "560,25 fcfa",
      statut: "En attente",
    },
    {
      id: "CMD24106026",
      dateCommande: "06/03/2025",
      dateLivraison: "13/03/2025",
      client: "Company A",
      montant: "980,00 fcfa",
      statut: "Expédié",
    },
    {
      id: "CMD24106027",
      dateCommande: "08/03/2025",
      dateLivraison: "15/03/2025",
      client: "Company B",
      montant: "1500 fcfa",
      statut: "Validé",
    },
    {
      id: "CMD24106028",
      dateCommande: "09/03/2025",
      dateLivraison: "16/03/2025",
      client: "Company C",
      montant: "750 fcfa",
      statut: "En attente",
    },
    {
      id: "CMD24106029",
      dateCommande: "10/03/2025",
      dateLivraison: "17/03/2025",
      client: "Company D",
      montant: "2100 fcfa",
      statut: "Expédié",
    },
  ]

  // Pagination calculations
  const totalItems = commandes.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const paginatedData = commandes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Handle dropdown actions
  const handleManualClick = () => {
    setIsDropdownOpen(false)
    setFormOpen(true)
  }

  const handleAIClick = () => {
    setIsDropdownOpen(false)
    // Add your AI order logic here
  }

  // Determine badge color based on status
  const getBadgeVariant = (statut: string) => {
    switch (statut) {
      case "Validé":
        return "warning"
      case "Expédié":
        return "success"
      case "En attente":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher une commande" className="pl-8 bg-[#e6e7eb]" />
          </div>
          <Button variant="outline" className="flex items-center gap-1 bg-[#e6e7eb]">
            <Filter className="h-4 w-4" />
            Filtres avancés
          </Button>
        </div>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold">
              <Plus className="h-4 w-4 mr-1" /> Ajouter une commande
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[210px]">
            <DropdownMenuItem onClick={handleManualClick} className="cursor-pointer">
              <PenIcon className="h-4 w-4 mr-2" />
              <span>Manuellement</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAIClick} className="cursor-pointer">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Via IA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#e6e7eb]">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead className="w-[180px]">
                ID Commande
                <Filter className="ml-2 inline h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead>
                Date de commande
                <Filter className="ml-2 inline h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead>
                Date de livraison
                <Filter className="ml-2 inline h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>
                Statut
                <Filter className="ml-2 inline h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((commande) => (
              <TableRow key={commande.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{commande.id}</TableCell>
                <TableCell>{commande.dateCommande}</TableCell>
                <TableCell>{commande.dateLivraison}</TableCell>
                <TableCell>{commande.client}</TableCell>
                <TableCell>{commande.montant}</TableCell>
                <TableCell>
                  <Badge
                    variant={getBadgeVariant(commande.statut) as any}
                    className={`
                      ${commande.statut === "Validé" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : ""}
                      ${commande.statut === "Expédié" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : ""}
                      ${commande.statut === "En attente" ? "bg-pink-100 text-pink-800 hover:bg-pink-100" : ""}
                    `}
                  >
                    {commande.statut}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />

      <CreateCommandeForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}