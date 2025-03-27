"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles, Plus, Minus, ShoppingCart, ArrowRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import DevisForm from "./devis-form"

interface Product {
  id: number
  name: string
  price: number
  quantity: number
}

interface DevisData {
  client: {
    name: string
    email: string
    address: string
  }
  paymentMethod: string
  sendLater: boolean
  terms: string
  products: Array<{
    id: number
    name: string
    quantity: number
    price: number
    discount: number
    tax: number
  }>
}

const AVAILABLE_PRODUCTS: Omit<Product, "quantity">[] = [
  { id: 1, name: "Page web", price: 50000 },
  { id: 2, name: "Logo", price: 75000 },
  { id: 3, name: "Application mobile", price: 250000 },
  { id: 4, name: "Maintenance mensuelle", price: 35000 },
  { id: 5, name: "Hébergement annuel", price: 60000 },
  { id: 6, name: "Référencement SEO", price: 45000 },
  { id: 7, name: "Formation", price: 25000 },
  { id: 8, name: "Campagne publicitaire", price: 80000 },
]

interface DevisAIGeneratorProps {
  organisationId: string
  contactSlug: string
  onSaveSuccess?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DevisAIGenerator({
  organisationId,
  contactSlug,
  onSaveSuccess,
  open,
  onOpenChange,
}: DevisAIGeneratorProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [devisData, setDevisData] = useState<DevisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const handleAddProduct = (product: Omit<Product, "quantity">) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id)

    if (existingProduct) {
      setSelectedProducts(selectedProducts.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)))
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }])
    }
  }

  const handleRemoveProduct = (productId: number) => {
    const existingProduct = selectedProducts.find((p) => p.id === productId)

    if (existingProduct && existingProduct.quantity > 1) {
      setSelectedProducts(selectedProducts.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p)))
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
    }
  }

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))
    } else {
      setSelectedProducts(selectedProducts.map((p) => (p.id === productId ? { ...p, quantity } : p)))
    }
  }

  const generateDevis = async () => {
    if (selectedProducts.length === 0) {
      setError("Veuillez sélectionner au moins un produit")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const clientNameMatch = prompt.match(/client\s+([A-Za-z\s]+)/i)
      const clientName = clientNameMatch ? clientNameMatch[1].trim() : "Aymard Steve"

      const addressMatch = prompt.match(/à\s+([A-Za-z\s,]+)/i)
      const address = addressMatch ? addressMatch[1].trim() : "Libreville, Akanda rue Sherco"

      const devisProducts = selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        discount: 0,
        tax: 0,
      }))

      const mockData: DevisData = {
        client: {
          name: clientName,
          email: "",
          address: address,
        },
        paymentMethod: "carte",
        sendLater: false,
        terms: "",
        products: devisProducts,
      }

      setDevisData(mockData)
    } catch (error) {
      console.error("Erreur:", error)
      setError("Une erreur s'est produite lors de la génération du devis. Veuillez réessayer.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDevis = async () => {
    if (!devisData) return

    setIsSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Devis créé avec succès")

      if (onSaveSuccess) {
        onSaveSuccess()
      } else {
        router.push(`/listing-organisation/${organisationId}/contact/${contactSlug}`)
      }
      
      // Fermer le modal après sauvegarde
      onOpenChange(false)
      handleReset()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast.error("Erreur lors de la sauvegarde du devis")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setDevisData(null)
    setPrompt("")
    setError(null)
    setSelectedProducts([])
  }

  const getTotalItems = () => {
    return selectedProducts.reduce((total, product) => total + product.quantity, 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Créer un nouveau devis</span>
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les produits et services à inclure dans le devis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!devisData ? (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border-r pr-4">
                  <h3 className="font-medium mb-4">Produits disponibles</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {AVAILABLE_PRODUCTS.map((product) => (
                      <div key={product.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.price.toLocaleString("fr-FR")} FCFA</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddProduct(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Produits sélectionnés</h3>
                      <div className="flex items-center text-sm bg-red-50 text-red-800 px-2 py-1 rounded">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {getTotalItems()} article(s)
                      </div>
                    </div>

                    {selectedProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border border-dashed rounded-md">
                        Aucun produit sélectionné
                      </div>
                    ) : (
                      <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2">
                        {selectedProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.price.toLocaleString("fr-FR")} FCFA</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="h-7 w-7 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => updateProductQuantity(product.id, Number.parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddProduct(product)}
                                className="h-7 w-7 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt" className="text-base font-medium">
                        Informations client (optionnel)
                      </Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ex: Devis pour le client Aymard Steve à Libreville"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 h-24"
                      />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                      onClick={generateDevis}
                      disabled={isGenerating || selectedProducts.length === 0}
                      className="w-full bg-red-800 hover:bg-red-700 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Générer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Devis généré</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    Remettre à zéro
                  </Button>
                </div>
              </div>
              <DevisForm initialData={devisData} />
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}