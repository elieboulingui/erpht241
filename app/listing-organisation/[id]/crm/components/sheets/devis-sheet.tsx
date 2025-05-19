"use client"

import { useEffect, useState } from "react"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FileText, Download, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Chargement from "@/components/Chargement"
import { Loader } from "@/components/ChargementCart"

interface DevisSheetProps {
  cardId: string
}

export function DevisSheet({ cardId }: DevisSheetProps) {
  const [devis, setDevis] = useState<Array<{
    id: string
    name: string
    date: string
    amount: number
    status: string
  }>>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // 👈 Ajout de l'état de chargement
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
      setIsLoading(true) // 👈 Début du chargement
      try {
        const res = await fetch(`/api/cards/${cardId}/devis`)
        const data = await res.json()

        if (res.ok) {
          setDevis(
            Array.isArray(data)
              ? data.map((item) => ({
                  id: item.id,
                  name: item.devisNumber || "Devis sans numéro",
                  date: new Date(item.creationDate).toLocaleDateString("fr-FR"),
                  amount: item.totalWithTax,
                  status: item.status,
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
      } finally {
        setIsLoading(false) // 👈 Fin du chargement
      }
    }

    fetchDevis()
  }, [cardId])

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
        <SheetDescription className="text-gray-400">
          Gérez les devis associés à cette opportunité
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {isLoading ? ( // 👈 Affichage conditionnel pendant le chargement
         <Loader/>
        ) : devis.length > 0 ? (
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
                  <p className="text-sm font-medium text-green-400">
                    {item.amount.toLocaleString()} FCFA
                  </p>
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
          <Button variant="ghost" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
