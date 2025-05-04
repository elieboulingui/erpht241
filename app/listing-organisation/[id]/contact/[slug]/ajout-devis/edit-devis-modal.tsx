"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import DevisForm from "@/app/agents/devis/component/devis-form"
import DevisUpdate from "@/app/agents/devis/component/devis-update"

interface EditDevisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  devisId: string | null

}

export default function EditDevisModal({
  open,
  onOpenChange,
  devisId,
  organisationId,
  contactSlug,
  onSaveDevis,
}: EditDevisModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [devisData, setDevisData] = useState<any>(null)
  const [isDataReady, setIsDataReady] = useState(false)  // Ajout de l'état pour vérifier que les données sont prêtes

  useEffect(() => {
    if (open && devisId) {
      setIsLoading(true)
      setIsDataReady(false)  // Les données ne sont pas prêtes tant qu'on ne les a pas récupérées

      const fetchDevisData = async () => {
        try {
          const response = await fetch(`/api/listuniquedevis?devisId=${devisId}`)
          if (!response.ok) {
            const errorDetails = await response.text()  // Get response body for error details
            throw new Error(`Erreur de récupération des données du devis: ${errorDetails}`)
          }
      
          const data = await response.json()
          setDevisData(data)
          setIsDataReady(true)  // Données prêtes après récupération
          setIsLoading(false)
        } catch (error: any) {
          console.error("Erreur lors de la récupération du devis:", error)
          toast.error("Une erreur est survenue lors de la récupération des données du devis.", {
            position: "bottom-right",
            duration: 3000,
          })
          setIsLoading(false)
        }
      }

      // Check localStorage first, then fetch from API if needed
      const storedData = localStorage.getItem(`devis_${devisId}`)
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setDevisData(parsedData)
          setIsDataReady(true)  // Données prêtes si elles sont déjà dans localStorage
          setIsLoading(false)
        } catch (error) {
          console.error("Erreur lors du parsing des données stockées:", error)
        }
      } else {
        fetchDevisData()
      }
    }
  }, [open, devisId])

  const handleSave = (updatedData: any) => {
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

    const completeUpdatedData = {
      ...updatedData,
      id: devisId,
      totalAmount: totalAmount,
      creationDate: updatedData.creationDate || new Date().toISOString().split("T")[0],
      dueDate: updatedData.dueDate || "",
    }

    // Saving locally
    localStorage.setItem(`devis_${devisId}`, JSON.stringify(completeUpdatedData))
    onSaveDevis(completeUpdatedData)

    toast.success("Devis mis à jour avec succès", {
      position: "bottom-right",
      duration: 3000,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Modifier le devis 
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1c]"></div>
          </div>
        ) : isDataReady && devisData ? (  // Vérification si les données sont prêtes avant d'afficher DevisUpdate
          <DevisUpdate initialData={devisData} onSave={handleSave} />
        ) : (
          <div className="text-center py-8 text-red-600">
            Impossible de charger les données du devis
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
