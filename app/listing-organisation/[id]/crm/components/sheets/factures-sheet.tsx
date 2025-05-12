"use client"

import { useState } from "react"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, Download, Trash2, X, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface FacturesSheetProps {
  cardId: string
}

export function FacturesSheet({ cardId }: FacturesSheetProps) {
  const [factures, setFactures] = useState<
    Array<{
      id: string
      number: string
      date: string
      dueDate: string
      amount: number
      status: "paid" | "pending" | "overdue"
    }>
  >([
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
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newFacture, setNewFacture] = useState({
    number: "",
    date: "",
    dueDate: "",
    amount: "",
    description: "",
  })

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

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Factures</SheetTitle>
        <SheetDescription className="text-gray-400">Gérez les factures associées à cette opportunité</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={16} />
            Créer une nouvelle facture
          </Button>
        ) : (
          <div className="bg-gray-700 p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Nouvelle facture</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="h-6 w-6">
                <X size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facture-number">Numéro de facture</Label>
              <Input
                id="facture-number"
                value={newFacture.number}
                onChange={(e) => setNewFacture({ ...newFacture, number: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facture-date">Date d'émission</Label>
                <Input
                  id="facture-date"
                  type="date"
                  value={newFacture.date}
                  onChange={(e) => setNewFacture({ ...newFacture, date: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facture-due-date">Date d'échéance</Label>
                <Input
                  id="facture-due-date"
                  type="date"
                  value={newFacture.dueDate}
                  onChange={(e) => setNewFacture({ ...newFacture, dueDate: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facture-amount">Montant (FCFA)</Label>
              <Input
                id="facture-amount"
                type="number"
                value={newFacture.amount}
                onChange={(e) => setNewFacture({ ...newFacture, amount: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facture-description">Description</Label>
              <Textarea
                id="facture-description"
                value={newFacture.description}
                onChange={(e) => setNewFacture({ ...newFacture, description: e.target.value })}
                className="bg-gray-800 border-gray-600 min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsCreating(false)}
                className="text-gray-300 hover:text-white hover:bg-gray-600"
              >
                Annuler
              </Button>
              <Button onClick={handleCreateFacture} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
                Créer
              </Button>
            </div>
          </div>
        )}

        {factures.length > 0 ? (
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
                  <p className="text-sm font-medium text-green-400">{facture.amount.toLocaleString()} FCFA</p>
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
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
