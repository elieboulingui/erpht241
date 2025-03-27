"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Download, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface FacureDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  factureId: string
}

export default function FacureDetailsModal({ open, onOpenChange, factureId }: FacureDetailsModalProps) {
  const [factureDetails, setFactureDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données du devis à chaque ouverture de la modal
  useEffect(() => {
    if (open && factureId) {
      setIsLoading(true)

      // Vérifier d'abord si les données mises à jour sont dans le localStorage
      const storedData = localStorage.getItem(`facture_${factureId}`)

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setFactureDetails({
            id: factureId,
            client: parsedData.client,
            dateFacturation: parsedData.creationDate
              ? new Date(parsedData.creationDate).toLocaleDateString("fr-FR")
              : "05/03/2025",
            dateEcheance: parsedData.dueDate ? new Date(parsedData.dueDate).toLocaleDateString("fr-FR") : "05/04/2025",
            paymentMethod: parsedData.paymentMethod || "carte",
            taxes: parsedData.products.some((p: any) => p.tax > 0) ? "TVA" : "Hors Taxe",
            statut: "Validé",
            products: parsedData.products.map((product: any) => ({
              ...product,
              total: calculateProductTotal(product),
            })),
            totalAmount: parsedData.totalAmount || calculateTotalAmount(parsedData.products),
          })
          setIsLoading(false)
          return
        } catch (error) {
          console.error("Erreur lors du parsing des données stockées:", error)
        }
      }

      // Si pas de données dans le localStorage, utiliser les données fictives
      setTimeout(() => {
        // Données fictives pour la démonstration
        setFactureDetails({
          id: factureId,
          client: {
            name: "Aymard Steve",
            email: "aymard.steve@example.com",
            address: "Libreville, Akanda rue Sherco",
          },
          dateFacturation: "05/03/2025",
          dateEcheance: "05/04/2025",
          paymentMethod: "carte",
          taxes: "Hors Taxe",
          statut: "Validé",
          products: [
            {
              id: 1,
              name: "Ordinateur portable HP",
              quantity: 2,
              price: 450000,
              discount: 5,
              tax: 0,
              total: 855000,
            },
            {
              id: 2,
              name: "Imprimante HP LaserJet",
              quantity: 1,
              price: 250000,
              discount: 0,
              tax: 0,
              total: 250000,
            },
          ],
          totalAmount: 1105000,
        })
        setIsLoading(false)
      }, 500)
    }
  }, [open, factureId])

  // Fonction pour calculer le total d'un produit
  function calculateProductTotal(product: any): number {
    const subtotal = product.quantity * product.price
    const discountAmount = subtotal * (product.discount / 100)
    const taxAmount = (subtotal - discountAmount) * (product.tax / 100)
    return subtotal - discountAmount + taxAmount
  }

  // Fonction pour calculer le montant total
  function calculateTotalAmount(products: any[]): number {
    return products.reduce((sum, product) => sum + calculateProductTotal(product), 0)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Simuler le téléchargement d'un PDF
    alert("Téléchargement de la facture en PDF")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center mt-8">
            <span className="text-xl font-bold">Détails de la facture {factureId}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1c]"></div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Informations client</h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{factureDetails.client.name}</p>
                  <p>{factureDetails.client.email}</p>
                  <p>{factureDetails.client.address}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Informations facture</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Numéro:</span>
                    <span className="font-medium">{factureDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date de facturation:</span>
                    <span>{factureDetails.dateFacturation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date d'échéance:</span>
                    <span>{factureDetails.dateEcheance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Statut:</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {factureDetails.statut}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Méthode de paiement:</span>
                    <span className="capitalize">{factureDetails.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg mb-4">Produits</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm bg-gray-50">
                      <th className="py-2 px-2">Produit</th>
                      <th className="py-2 px-2 text-right">Quantité</th>
                      <th className="py-2 px-2 text-right">Prix unitaire</th>
                      <th className="py-2 px-2 text-right">Réduction</th>
                      <th className="py-2 px-2 text-right">Taxe</th>
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factureDetails.products.map((product: any) => (
                      <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-2">{product.name}</td>
                        <td className="py-2 px-2 text-right">{product.quantity}</td>
                        <td className="py-2 px-2 text-right">{product.price.toLocaleString("fr-FR")} FCFA</td>
                        <td className="py-2 px-2 text-right">{product.discount}%</td>
                        <td className="py-2 px-2 text-right">{product.tax}%</td>
                        <td className="py-2 px-2 text-right">{product.total.toLocaleString("fr-FR")} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border border-t-2 font-medium">
                      <td colSpan={5} className="py-2 px-2 text-right">
                        Total
                      </td>
                      <td className="py-2 px-2 text-right">{factureDetails.totalAmount.toLocaleString("fr-FR")} FCFA</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <Separator />

            {/* <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Fermer
              </Button>
            </div> */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

