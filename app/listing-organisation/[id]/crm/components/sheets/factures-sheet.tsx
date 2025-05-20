"use client"

import { useState, useEffect } from "react"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Download, Trash2, X, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Loader } from "@/components/ChargementCart"

interface FacturesSheetProps {
  cardId: string
}

export function FacturesSheet({ cardId }: FacturesSheetProps) {
  const [factures, setFactures] = useState<Array<{
    id: string
    number: string
    date: string
    dueDate: string
    amount: number
    status: "paid" | "pending" | "overdue"
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newFacture, setNewFacture] = useState({
    number: "",
    date: "",
    dueDate: "",
    amount: "",
    description: "",
  })

  useEffect(() => {
    if (!cardId) {
      console.warn("cardId est undefined, fetch ignoré.")
      return
    }

    const fetchFactures = async () => {
      setIsLoading(true)
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Données mockées (à remplacer par un vrai appel API)
        const mockData = [
          {
            id: "1",
            number: "FACT-2023-001",
            date: "15/05/2023",
            dueDate: "15/06/2023",
            amount: 15000,
            status: "paid",
          },
          {
            id: "2",
            number: "FACT-2023-002",
            date: "20/05/2023",
            dueDate: "20/06/2023",
            amount: 3500,
            status: "pending",
          },
          {
            id: "3",
            number: "FACT-2023-003",
            date: "01/04/2023",
            dueDate: "01/05/2023",
            amount: 8750,
            status: "overdue",
          },
        ]

        setFactures(mockData as any)
      } catch (err) {
        console.error("Erreur lors du chargement des factures:", err)
        toast.error("Erreur réseau")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFactures()
  }, [cardId])

  const handleCreateFacture = () => {
    if (!newFacture.number || !newFacture.date || !newFacture.dueDate || !newFacture.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    const factureToAdd = {
      id: Date.now().toString(),
      number: newFacture.number,
      date: newFacture.date,
      dueDate: newFacture.dueDate,
      amount: Number.parseFloat(newFacture.amount),
      status: "pending" as const,
    }

    setFactures([...factures, factureToAdd])
    setNewFacture({
      number: "",
      date: "",
      dueDate: "",
      amount: "",
      description: "",
    })
    setIsCreating(false)
    toast.success("Facture créée avec succès")
  }

  const handleDeleteFacture = (id: string) => {
    setFactures(factures.filter((f) => f.id !== id))
    toast.success("Facture supprimée")
  }

  const handleMarkAsPaid = (id: string) => {
    setFactures(factures.map((f) => (f.id === id ? { ...f, status: "paid" as const } : f)))
    toast.success("Facture marquée comme payée")
  }

  const getStatusBadge = (status: "paid" | "pending" | "overdue") => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center rounded-full bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
            <Check size={12} className="mr-1" />
            Payée
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-400">
            En attente
          </span>
        )
      case "overdue":
        return (
          <span className="inline-flex items-center rounded-full bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-400">
            <AlertCircle size={12} className="mr-1" />
            En retard
          </span>
        )
    }
  }

  if (!cardId) {
    return <div className="p-4 text-center text-red-500">Erreur : Aucun identifiant de carte fourni.</div>
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Factures</SheetTitle>
        <SheetDescription className="text-gray-400">
          Gérez les factures associées à cette opportunité
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <Loader />
        ) : factures.length > 0 ? (
          <div className="space-y-3">
            {factures.map((facture) => (
              <div key={facture.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{facture.number}</p>
                      <p className="text-xs text-gray-400">
                        Émise le {facture.date} • Échéance le {facture.dueDate}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(facture.status)}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-medium text-green-400">
                    {facture.amount.toLocaleString()} FCFA
                  </p>
                  <div className="flex gap-1">
                    {facture.status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-gray-300 hover:text-green-400"
                        onClick={() => handleMarkAsPaid(facture.id)}
                      >
                        <Check size={14} className="mr-1" />
                        Marquer comme payée
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteFacture(facture.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune facture disponible</p>
          </div>
        )}
      </div>

      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button variant="ghost" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}