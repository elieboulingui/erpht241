"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductGeneratorForm } from "./product-generator-form"
import { ProductGenerationResult } from "./product-generation-result"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ProductCategoriesSelector } from "./product-categories-selector"
import { GoogleGenerativeAI } from "@google/generative-ai"

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

  // Fetch images based on the generated product name
  const fetchImages = async (productName: string): Promise<string[]> => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY
    const cx = process.env.NEXT_PUBLIC_IMAGE_CX
    const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(productName)}&key=${apiKey}&cx=${cx}&searchType=image&num=9`

    try {
      const response = await fetch(imageSearchUrl)
      const data = await response.json()

      // Log the search results for debugging
      console.log("Image search results:", data)

      if (data.items && data.items.length > 0) {
        return data.items.map((item: any) => item.link)
      }
      return [] // Return empty if no images found
    } catch (error) {
      console.error("Error fetching images:", error)
      return [] // Return empty if an error occurs
    }
  }

  const handleGenerate = async (description: string) => {
    alert("L'IA a bien reçu les informations, traitement en cours...")
  
    setIsGenerating(true)
  
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      if (!apiKey) throw new Error("API key is missing!")
  
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  
      const structuredPrompt = `
        Vous êtes un assistant IA expert en structuration de données produits.
        Je vous décris un produit. Vous devez générer un objet JSON qui inclut les informations suivantes :
        1. Le nom complet du produit (exemple : "iPhone 13")
        2. La description complète du produit (exemple : "Le dernier modèle de téléphone d'Apple.")
        3. La catégorie du produit (exemple : "Smartphone")
        4. Le prix en FCFA (exemple : "500000 FCFA")
  
        Voici la description du produit : "${description}"
  
        Format attendu :
        {
          "Nom": "Nom du produit",
          "Description": "Brève présentation du produit",
          "Catégorie": "Type de produit",
          "Prix": "Prix en FCFA"
        }
      `
  
      const response = await model.generateContent(structuredPrompt)
  
      if (response?.response?.text) {
        const text = await response.response.text()
  
        console.log("Raw AI response:", text)
  
        // Use regex to extract the values from the AI response
        const regex = /"Nom": "(.*?)",\s*"Description": "(.*?)",\s*"Catégorie": "(.*?)",\s*"Prix": "(.*?)"/;
        const match = text.match(regex)
  
        if (match) {
          const [, name, description, category, price] = match
  
          const productData: ProductData = {
            name: name || "Nom du produit",
            description: description || "Brève présentation du produit",
            categories: category ? [category] : ["Non catégorisé"],
            price: price || "Prix en FCFA",
            images: []  // Images will be fetched separately
          }
  
          console.log("Generated Product Data:", productData)
  
          // Fetch images based on the generated product name
          const images = await fetchImages(productData.name)
          setGeneratedProduct({
            ...productData,
            images: images.length ? images : Array(9).fill("/placeholder.svg?height=80&width=80")
          })
  
          alert("Produit généré avec succès !")
        } else {
          console.error("No valid JSON found in AI response.")
        }
      }
    } catch (error) {
      console.error("Error generating product:", error)
      alert("Erreur lors de la génération du produit.")
    }
  
    setIsGenerating(false)
  }
  

  const handleAddProduct = () => {
    // Logic for adding the generated product to the database (e.g., API call)
    console.log("Adding product:", generatedProduct)
    setOpen(false)
    // Reset state
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
                  onGenerate={handleGenerate} // Pass the handleGenerate function
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
