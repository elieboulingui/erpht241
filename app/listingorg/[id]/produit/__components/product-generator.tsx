"use client"

import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Maximize2 } from "lucide-react"
import { DialogTitle, DialogContent } from "@/components/ui/dialog"
import type { Product } from "@/types/product"

interface ProductGeneratorProps {
  onProductGenerated: (product: Product, selectedImages: string[], allImages: string[]) => void
}

export function ProductGenerator({ onProductGenerated }: ProductGeneratorProps) {
  const [prompts, setPrompts] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [status, setStatus] = useState<string>("")
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  // Envoyer le générateur
  const Envoyer = async () => {
    setLoading(true)
    setResult("")

    const apiKey = "AIzaSyBYKRNNDZo0SwQck0LSkAeo9j8xtd-7j24"
    const cx = "AIzaSyB3-BI7bj16JM4Zfz2we1UE8dY7rVymiWw"

    if (!apiKey || !cx) {
      console.error("Clé API Google manquante !")
      setStatus("Erreur : Clé API Google manquante.")
      return
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const structuredPrompt = `
        Vous êtes un assistant IA expert en structuration de données produits.
        Génère un objet JSON représentant un produit basé sur la description suivante :
        "${prompts}"

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

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error("Aucun JSON valide trouvé dans la réponse.")
        }

        const jsonString = jsonMatch[0]

        const cleanedJsonString = jsonString.replace(/\n/g, "").replace(/\r/g, "").trim()

        try {
          const jsonResult: Product = JSON.parse(cleanedJsonString)
          setResult(JSON.stringify(jsonResult, null, 2))
          fetchImages(jsonResult.Nom)
        } catch (parseError) {
          console.error("Erreur lors du parsing du JSON :", parseError)
          setResult("Erreur lors du parsing du JSON.")
        }
      } else {
        setResult("Réponse vide ou invalide.")
      }
    } catch (error) {
      console.error("Erreur lors de la génération :", error)
      setResult("Erreur lors de la génération.")
    }
    setLoading(false)
  }

  // Récupérer les images
  const fetchImages = async (query: string): Promise<void> => {
    setStatus("Recherche d'image en cours...")
    const apiKey = "AIzaSyBgdVr9TKT-dN_gQjlsFTLqrA-Y-J7DPgg"
    const cx = "c53473fd31a64440b"
    const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}&searchType=image&num=10`

    try {
      const response = await fetch(imageSearchUrl)
      const data = await response.json()
      if (data.items && data.items.length > 0) {
        const imageUrls = data.items.map((item: any) => item.link)
        setImages(imageUrls)
        setStatus("Images récupérées avec succès!")
      } else {
        setStatus("Aucune image trouvée.")
      }
    } catch {
      setStatus("Erreur lors de la recherche d'image")
    }
  }

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImages((prevSelected) => {
      // If image is already selected, remove it (deselect)
      if (prevSelected.includes(imageUrl)) {
        return prevSelected.filter((img) => img !== imageUrl)
      }
      // If image is not selected, add it
      return [...prevSelected, imageUrl]
    })
  }

  const AjouterAuTableau = () => {
    if (selectedImages.length === 0) {
      alert("Veuillez sélectionner au moins une image !")
      return
    }
    try {
      const product = JSON.parse(result)
      onProductGenerated(product, selectedImages, images)
      setResult("")
      setSelectedImages([])
      setImages([])
    } catch {
      alert("Erreur : Impossible d'ajouter le produit.")
    }
  }

  return (
    <DialogContent className="max-w-lg w-full p-6">
      <DialogTitle className="text-xl font-bold mb-4">Génération de produit</DialogTitle>

      <form className="space-y-4">
        <div className="relative">
          <input
            type="text"
            className="block w-full p-4 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onChange={(e) => setPrompts(e.target.value)}
            value={prompts}
            placeholder="Décrivez le produit à générer..."
            required
          />
          <button
            type="button"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 transition-colors px-4 py-2 rounded"
            onClick={Envoyer}
          >
            Générer
          </button>
        </div>
      </form>
      <div className="space-y-4 p-3">
        <h2 className="font-semibold text-lg">Résultat</h2>
        <div className="result min-h-[200px] p-4 rounded-lg border bg-gray-50 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap">{result}</pre>
          )}
        </div>
        {status && <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">{status}</div>}
        {images.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Sélectionnez des images:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img || "/placeholder.svg?height=64&width=64"}
                    alt={`Produit ${index + 1}`}
                    width={64}
                    height={64}
                    className={`w-16 h-16 object-cover cursor-pointer rounded border ${
                      selectedImages.includes(img) ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleImageSelect(img)}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                    }}
                  />
                  <button
                    className="absolute top-1 left-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoomedImage(img)
                    }}
                  >
                    <Maximize2 className="w-3 h-3 text-gray-700" />
                  </button>
                  {selectedImages.includes(img) && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {result && (
          <button
            className={`w-full bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg p-3 ${
              selectedImages.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={AjouterAuTableau}
            disabled={selectedImages.length === 0}
          >
            Ajouter au tableau
          </button>
        )}
      </div>
    </DialogContent>
  )
}

