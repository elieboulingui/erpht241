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
import { FileText, Download, Trash2, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Loader } from "@/components/ChargementCart"

interface Facture {
  id: string
  number: string
  date: string
  dueDate: string
  amount: number
  status: "paid" | "pending" | "overdue"
}

interface FacturesSheetProps {
  cardId: string
}

export function FacturesSheet({ cardId }: FacturesSheetProps) {
  const [factures, setFactures] = useState<Facture[]>([])
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
        const res = await fetch(`/api/factures?id=${cardId}`)
        console.log("Status:", res.status, "URL:", res.url)

        if (!res.ok) {
          const errorText = await res.text()
          console.error("Erreur API:", errorText)
          throw new Error("Erreur réseau")
        }

        const data = await res.json()
        console.log("Données reçues:", data)

        // Transformation des données reçues depuis le backend
        const transformed = data.map((facture: any) => ({
          id: facture.id,
          number: facture.devisNumber,
          date: new Date(facture.creationDate).toLocaleDateString("fr-FR"),
          dueDate: facture.dueDate
            ? new Date(facture.dueDate).toLocaleDateString("fr-FR")
            : "—",
          amount: Number(facture.totalWithTax ?? 0),
          status: "pending" as const, // Peut être modifié selon la logique métier
        }))

        setFactures(transformed)
      } catch (err) {
        console.error("Erreur fetch:", err)
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

    const factureToAdd: Facture = {
      id: Date.now().toString(),
      number: newFacture.number,
      date: newFacture.date,
      dueDate: newFacture.dueDate,
      amount: parseFloat(newFacture.amount),
      status: "pending",
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
    setFactures(factures.map((f) => (f.id === id ? { ...f, status: "paid" } : f)))
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

      <div className="pb-16">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : factures.length > 0 ? (
          <div className="space-y-3">
            {factures.map((facture) => (
              <div key={facture.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{facture.number}</p>
                      <p className="text-xs text-gray-400">Échéance: {facture.dueDate}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      facture.status === "paid"
                        ? "bg-green-900/30 text-green-400"
                        : facture.status === "overdue"
                        ? "bg-red-900/30 text-red-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {facture.status === "paid" ? "Payée" : facture.status === "pending" ? "En attente" : "En retard"}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-medium text-green-400">
                    {facture.amount.toLocaleString()} FCFA
                  </p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Download size={16} />
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

      <div className="fixed bottom-0 right-0 w-full p-4 flex justify-end space-x-2">
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
          Ajouter
        </Button>
        <SheetClose asChild>
          <Button variant="ghost" className="border border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </div>
    </>
  )
}
