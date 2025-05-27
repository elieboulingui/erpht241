"use client"
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  PenIcon,
  Sparkles,
  SlidersHorizontal
} from "lucide-react"
import { startTransition, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import PaginationGlobal from "@/components/paginationGlobal"
import Chargement from "@/components/Chargement"
import { deleteOrder } from "../../action/deleteOrder"
import { toast } from "sonner"

export default function TableauCommandes() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [commandes, setCommandes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)



  const handleDelete = (id: string) => {

  
    startTransition(async () => {
      const res = await deleteOrder(id)
      if (res.success) {
        setCommandes(prev => prev.filter(c => c.id !== id))
      } else {
        toast.message(res.message || "Une erreur est survenue.")
      }
    })
  }
  useEffect(() => {
    const fetchCommandes = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/order")
        if (!response.ok) throw new Error("Erreur lors de la récupération des commandes")
        const data = await response.json()
        setCommandes(data)
      } catch (error) {
        console.error("Erreur :", error)
        setCommandes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommandes()
  }, [])

  const totalItems = commandes.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const paginatedData = commandes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  if (isLoading) {
    return <Chargement />
  }

  if (commandes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-600">Aucune commande enregistrée</p>
      </div>
    )
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
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[213px]">
            <DropdownMenuItem className="cursor-pointer">
              <PenIcon className="h-4 w-4 mr-2" />
              Manuellement
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Sparkles className="h-4 w-4 mr-2" />
              Via IA
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
              <TableHead>Référence</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Montant (FCFA)</TableHead>
              <TableHead>ID Transaction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12">
                <SlidersHorizontal className="ml-2 inline h-4 w-4 text-muted-foreground" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((commande) => (
              <TableRow key={commande.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium">{commande.reference}</TableCell>
                <TableCell>{commande.payerEmail}</TableCell>
                <TableCell>{commande.payerMsisdn}</TableCell>
                <TableCell>{commande.shortDescription}</TableCell>
                <TableCell>{commande.amount.toLocaleString()} FCFA</TableCell>
                <TableCell>{commande.server_transaction_id}</TableCell>
                <TableCell>
                  {new Date(commande.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
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
                      <DropdownMenuItem
  onClick={() => handleDelete(commande.id)}
  className="text-red-600 cursor-pointer"
>
  Supprimer
</DropdownMenuItem>

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
    </div>
  )
}
