"use client"

import { useEffect, useState } from "react"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, FileText, Download, Trash2, X } from "lucide-react"
import { toast } from "sonner"

interface DevisSheetProps {
  cardId: string
}

export function DevisSheet({ cardId }: DevisSheetProps) {
  const [devis, setDevis] = useState<Array<{ id: string; name: string; date: string; amount: number; status: string }>>(
    [],
  )
  const [isCreating, setIsCreating] = useState(false)
  const [newDevis, setNewDevis] = useState({
    name: "",
    amount: "",
    description: "",
  })

  useEffect(() => {
    if (!cardId) {
      console.warn("cardId est undefined, fetch ignoré.")
      return
    }

    const fetchDevis = async () => {
      try {
        const res = await fetch(`/api/cards/${cardId}/devis`)
        const data = await res.json()
        if (res.ok) {
          // The API now returns the devis array directly, not wrapped in a 'devis' property
          setDevis(
            Array.isArray(data)
              ? data.map((item) => ({
                  id: item.id,
                  name: item.devisNumber || "Devis sans numéro",
                  date: new Date(item.creationDate).toLocaleDateString("fr-FR"),
                  amount: item.totalWithTax,
                  status: item.status,
                  // Include all other properties from the API
                  ...item,
                }))
              : [],
          )
        } else {
          toast.error(data.error || "Erreur lors du chargement des devis")
        }
      } catch (err) {
        console.error("Erreur lors du chargement des devis:", err)
        toast.error("Erreur réseau")
      }
    }

    fetchDevis()
  }, [cardId])

  const handleCreateDevis = () => {
    if (!newDevis.name || !newDevis.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    const devisToAdd = {
      id: Date.now().toString(),
      name: newDevis.name,
      date: new Date().toLocaleDateString("fr-FR"),
      amount: Number.parseFloat(newDevis.amount),
      status: "Brouillon",
    }

    setDevis([...devis, devisToAdd])
    setNewDevis({ name: "", amount: "", description: "" })
    setIsCreating(false)
    toast.success("Devis créé avec succès")
  }

  const handleDeleteDevis = (id: string) => {
    setDevis(devis.filter((d) => d.id !== id))
    toast.success("Devis supprimé")
  }

  if (!cardId) {
    return <div className="p-4 text-center text-red-500">Erreur : Aucun identifiant de carte fourni.</div>
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Devis</SheetTitle>
        <SheetDescription className="text-gray-400">Gérez les devis associés à cette opportunité</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {!isCreating ? (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={16} />
            Créer un nouveau devis
          </Button>
        ) : (
          <div className="bg-gray-700 p-4 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Nouveau devis</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)} className="h-6 w-6">
                <X size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="devis-name">Nom du devis</Label>
              <Input
                id="devis-name"
                value={newDevis.name}
                onChange={(e) => setNewDevis({ ...newDevis, name: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devis-amount">Montant (FCFA)</Label>
              <Input
                id="devis-amount"
                type="number"
                value={newDevis.amount}
                onChange={(e) => setNewDevis({ ...newDevis, amount: e.target.value })}
                className="bg-gray-800 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="devis-description">Description</Label>
              <Textarea
                id="devis-description"
                value={newDevis.description}
                onChange={(e) => setNewDevis({ ...newDevis, description: e.target.value })}
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
              <Button onClick={handleCreateDevis} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80">
                Créer
              </Button>
            </div>
          </div>
        )}

        {devis.length > 0 ? (
          <div className="space-y-3">
            {devis.map((item) => (
              <div key={item.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-gray-400" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">Créé le {item.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "Accepté"
                        ? "bg-green-900/30 text-green-400"
                        : item.status === "Refusé"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-blue-900/30 text-blue-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-medium text-green-400">{item.amount.toLocaleString()} FCFA</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteDevis(item.id)}
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
            <p>Aucun devis disponible</p>
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
