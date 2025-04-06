"use client"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import html2pdf from "html2pdf.js"

interface DevisDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  devisId: string | null
}

interface Product {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
  taxAmount: number
  totalPrice: number
  totalWithTax: number
}

interface Client {
  name: string
  email: string
  address: string
}

interface DevisDetails {
  id: string
  devisNumber: string
  client: Client
  dateFacturation: string
  dateEcheance: string
  paymentMethod: string
  taxes: string
  statut: string
  items: Product[]
  totalAmount: number
}

export default function DevisDetailsModal({
  open,
  onOpenChange,
  devisId,
}: DevisDetailsModalProps) {
  const [devisDetails, setDevisDetails] = useState<DevisDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const modalContentRef = useRef<HTMLDivElement | null>(null)

  const calculateProductTotal = (product: Product): number => {
    const subtotal = product.quantity * product.unitPrice
    const discountAmount = subtotal * (product.taxRate / 100)
    const taxAmount = (subtotal - discountAmount) * (product.taxRate / 100)
    return subtotal - discountAmount + taxAmount
  }

  const calculateTotalAmount = (items: Product[]): number =>
    items.reduce((sum, product) => sum + calculateProductTotal(product), 0)

  useEffect(() => {
    if (!open || !devisId) {
      setDevisDetails(null)
      return
    }

    setIsLoading(true)
    fetch(`/api/devisdetails?id=${devisId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.items) {
          setIsError(true)
          return
        }

        const items = data.items.map((item: any) => ({
          ...item,
          totalPrice: item.quantity * item.unitPrice,
          totalWithTax: item.totalWithTax,
        }))

        const totalAmount = data.totalWithTax || calculateTotalAmount(items)

        setDevisDetails({
          id: devisId,
          devisNumber: data.devisNumber,
          client: data.client,
          dateFacturation: new Date(data.creationDate).toLocaleDateString("fr-FR"),
          dateEcheance: new Date(data.archivedDate || data.creationDate).toLocaleDateString("fr-FR"),
          paymentMethod: data.paymentMethod || "carte",
          taxes: items.some((item: any) => item.taxAmount > 0) ? "TVA" : "Hors Taxe",
          statut: data.status,
          items,
          totalAmount,
        })

        setIsError(false)
      })
      .catch((err) => {
        console.error("Erreur de chargement:", err)
        setIsError(true)
      })
      .finally(() => setIsLoading(false))
  }, [open, devisId])

  const handlePrint = () => window.print()

  const handleDownload = () => {
    if (modalContentRef.current) {
      html2pdf()
        .from(modalContentRef.current)
        .save(`Devis_${devisId}.pdf`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={modalContentRef} className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center mt-8">
            <span className="text-xl font-bold">Détails du devis {devisDetails?.devisNumber}</span>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7f1d1c]" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-600">
            Impossible de charger le devis. Veuillez réessayer.
          </div>
        ) : devisDetails ? (
          <div className="space-y-6 py-4">
            {/* Client & Devis Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Informations client</h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{devisDetails.client.name}</p>
                  <p>{devisDetails.client.email}</p>
                  <p>{devisDetails.client.address}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Informations devis</h3>
                <div className="space-y-1 text-sm">
                  <InfoRow label="Numéro" value={devisDetails.devisNumber} />
                  <InfoRow label="Date de facturation" value={devisDetails.dateFacturation} />
                  <InfoRow label="Date d'échéance" value={devisDetails.dateEcheance} />
                  <InfoRow
                    label="Statut"
                    value={
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {devisDetails.statut}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Méthode de paiement"
                    value={<span className="capitalize">{devisDetails.paymentMethod}</span>}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Table */}
            <div>
              <h3 className="font-medium text-lg mb-4">Produits</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left text-sm bg-gray-50">
                      <th className="py-2 px-2">Produit</th>
                      <th className="py-2 px-2 text-right">Quantité</th>
                      <th className="py-2 px-2 text-right">Prix unitaire</th>
                      <th className="py-2 px-2 text-right">Taxe</th>
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devisDetails.items.map((product) => (
                      <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-2">{product.description}</td>
                        <td className="py-2 px-2 text-right">{product.quantity}</td>
                        <td className="py-2 px-2 text-right">{product.unitPrice.toLocaleString("fr-FR")} FCFA</td>
                        <td className="py-2 px-2 text-right">{product.taxRate}%</td>
                        <td className="py-2 px-2 text-right">{product.totalWithTax.toLocaleString("fr-FR")} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border border-t-2 font-medium">
                      <td colSpan={4} className="py-2 px-2 text-right">
                        Total
                      </td>
                      <td className="py-2 px-2 text-right">
                        {devisDetails.totalAmount.toLocaleString("fr-FR")} FCFA
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <Separator />
          </div>
        ) : (
          <div className="text-center py-8 text-red-600">Aucune donnée de devis disponible</div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span>{value}</span>
    </div>
  )
}
