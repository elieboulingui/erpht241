"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductGeneratorForm } from "./product-generator-form"
import { ProductGenerationResult } from "./product-generation-result"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ProductCategoriesSelector } from "./product-categories-selector"

export interface ProductData {
  name: string
  price: string
  description: string
  categories: string[]
  images: string[]
}

export function ProductGeneratorModal() {
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [productDescription, setProductDescription] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [generatedProduct, setGeneratedProduct] = useState<ProductData | null>(null)

  const handleGenerate = async (description: string) => {
    setIsGenerating(true)

    // Simulez un appel API pour générer un produit
    setTimeout(() => {
      setGeneratedProduct({
        name: "Produit généré",
        price: "99.99",
        description: "Description du produit généré basée sur: " + description, // Utilisation de la description ici
        categories: selectedCategories.length ? selectedCategories : ["Non catégorisé"],
        images: Array(9).fill("/placeholder.svg?height=80&width=80"),
      })
      setIsGenerating(false)
    }, 1500)
  }

  const handleAddProduct = () => {
    // Logique pour ajouter le produit à la base de données
    console.log("Adding product:", generatedProduct)
    setOpen(false)
    // Réinitialisez l'état
    setProductDescription("")
    setSelectedCategories([])
    setGeneratedProduct(null)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-black hover:bg-black text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Générer un produit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden ">
          <DialogHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-black text-center ">
              Génération de produit
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                  <Loader2 className="h-10 w-10 text-black animate-spin" />
                  <p className="text-lg font-medium text-gray-700">Génération en cours...</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <ProductGeneratorForm
                  productDescription={productDescription}
                  setProductDescription={setProductDescription}
                  onGenerate={handleGenerate} // Passez handleGenerate
                  isGenerating={isGenerating}
                />

                <ProductCategoriesSelector
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3 ">
                  Résultat
                </h2>
                {generatedProduct ? (
                  <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <ProductGenerationResult product={generatedProduct} />

                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddProduct}
                        className="bg-black hover:bg-black text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                      >
                        Ajouter le produit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-10 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <p className="text-gray-400 text-center">
                      Décrivez votre produit et cliquez sur "Générer" pour voir le résultat ici
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
