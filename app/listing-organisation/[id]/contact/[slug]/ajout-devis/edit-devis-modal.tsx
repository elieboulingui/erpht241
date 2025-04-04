import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import DevisForm from "@/app/agents/devis/component/devis-form"

interface EditDevisModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  devisId: string | null
  organisationId: string
  contactSlug: string
  onSaveDevis: (devisData: any) => void
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

  useEffect(() => {
    if (open && devisId) {
      setIsLoading(true)

      const storedData = localStorage.getItem(`devis_${devisId}`)
      
      // First, check localStorage
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setDevisData(parsedData)
          setIsLoading(false)
          return
        } catch (error) {
          console.error("Erreur lors du parsing des données stockées:", error)
        }
      }

      // Fetch the devis data from the API if not found in localStorage
      fetch(`/api/devisdetails?id=${devisId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération du devis")
          }
          return response.json()
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error)
          }
          setDevisData(data)
        })
        .catch((error) => {
          console.error("Erreur lors de l'API devis:", error)
          toast.error("Impossible de charger les données du devis", {
            position: "bottom-right",
            duration: 3000,
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
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
            Modifier le devis {devisId}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1c]"></div>
          </div>
        ) : devisData ? (
          <DevisForm initialData={devisData} onSave={handleSave} />
        ) : (
          <div className="text-center py-8 text-red-600">
            Impossible de charger les données du devis
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
