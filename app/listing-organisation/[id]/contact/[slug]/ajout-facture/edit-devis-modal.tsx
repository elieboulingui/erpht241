"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import FactureForm from "@/app/agents/facture/component/facture-form"

interface EditFactureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  factureId: string
  organisationId: string
  contactSlug: string
  onSaveFacture: (factureData: any) => void
}

export default function EditFactureModal({
  open,
  onOpenChange,
  factureId,
  organisationId,
  contactSlug,
  onSaveFacture,
}: EditFactureModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [factureData, setFactureData] = useState<any>(null)

  // Charger les données de la facture
  useEffect(() => {
    if (open && factureId) {
      setIsLoading(true)

      // Vérifier d'abord si les données sont dans le localStorage
      const storedData = localStorage.getItem(`facture_${factureId}`)

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setFactureData(parsedData)
          setIsLoading(false)
          return
        } catch (error) {
          console.error("Erreur lors du parsing des données stockées:", error)
        }
      }

      // Simuler une requête API pour récupérer les données de la facture
      setTimeout(() => {
        // Données fictives pour la démonstration
        const mockFactureData = {
          client: {
            name: "Aymard Steve",
            email: "aymard.steve@example.com",
            address: "Libreville, Akanda rue Sherco",
          },
          paymentMethod: "carte",
          sendLater: false,
          terms: "net30",
          creationDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
          products: [
            {
              id: 1,
              name: "Ordinateur portable HP",
              quantity: 2,
              price: 450000,
              discount: 5,
              tax: 0,
            },
            {
              id: 2,
              name: "Imprimante HP LaserJet",
              quantity: 1,
              price: 250000,
              discount: 0,
              tax: 0,
            },
          ],
          totalAmount: 1105000,
        }

        setFactureData(mockFactureData)
        setIsLoading(false)
      }, 1000)
    }
  }, [open, factureId])

  // Modifier la fonction handleSave pour s'assurer que toutes les données sont correctement transmises
  const handleSave = (updatedData: any) => {
    // Calculer le montant total
    const calculateProductTotal = (product: any): number => {
      const subtotal = product.quantity * product.price
      const discountAmount = subtotal * (product.discount / 100)
      const taxAmount = (subtotal - discountAmount) * (product.tax / 100)
      return subtotal - discountAmount + taxAmount
    }

    const totalAmount = updatedData.products.reduce(
      (sum: number, product: any) => sum + calculateProductTotal(product),
      0,
    )

    // Traiter les données mises à jour en incluant toutes les propriétés nécessaires
    const completeUpdatedData = {
      ...updatedData,
      id: factureId,
      totalAmount: totalAmount,
      // S'assurer que toutes les dates sont au bon format
      creationDate: updatedData.creationDate || new Date().toISOString().split("T")[0],
      dueDate: updatedData.dueDate || "",
    }

    // Stocker les données mises à jour dans le localStorage pour les rendre disponibles partout
    localStorage.setItem(`facture_${factureId}`, JSON.stringify(completeUpdatedData))

    // Appeler la fonction de mise à jour avec les données complètes
    onSaveFacture(completeUpdatedData)

    toast.success("FActure mise à jour avec succès", {
      position: "bottom-right",
      duration: 3000,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Modifier la facture {factureId}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1c]"></div>
          </div>
        ) : factureData ? (
          <FactureForm initialData={factureData} onSave={handleSave} />
        ) : (
          <div className="text-center py-8 text-red-600">Impossible de charger les données de la facture</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

