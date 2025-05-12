"use client"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { useState, createContext, useContext, type ReactNode, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


interface Product {
  Nom: string
  Description: string
  Catégorie: string
  Prix: string
  imageUrls?: string[]
  generatedImages?: string[] 
}

// Création d'un store local avec React Context
interface ProductStoreContextType {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  removeProduct: (productName: string) => void
}

const ProductStoreContext = createContext<ProductStoreContextType | undefined>(undefined)

function ProductStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Récupérer les produits du localStorage si disponible
    if (typeof window !== "undefined") {

    }
    return []
  })

  // Sauvegarder les produits dans localStorage quand ils changent
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product])
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.Nom === updatedProduct.Nom ? updatedProduct : product)),
    )
  }

  const removeProduct = (productName: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.Nom !== productName))
  }

  return (
    <ProductStoreContext.Provider value={{ products, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductStoreContext.Provider>
  )
}

// Hook pour utiliser le store
function useProductStore() {
  const context = useContext(ProductStoreContext)
  if (context === undefined) {
    throw new Error("useProductStore must be used within a ProductStoreProvider")
  }
  return context
}

export default function GenerateByia() {
  const [prompts, setPrompts] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [status, setStatus] = useState<string>("")
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const Envoyer = async () => {
    setLoading(true)
    setResult("")

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const cx = process.env.NEXT_PUBLIC_GOOGLE_CX;

    if (!apiKey || !cx) {
      console.error("Clé API Google manquante !");
      setStatus("Erreur : Clé API Google manquante.");
      return;
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

  const fetchImages = async (query: string): Promise<void> => {
    setStatus("Recherche d'image en cours...")
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;
    const cx = process.env.NEXT_PUBLIC_IMAGE_CX;
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

  // Utilisation du store dans le composant principal
  return (
    <ProductStoreProvider>
      <ProductContent
        prompts={prompts}
        setPrompts={setPrompts}
        result={result}
        loading={loading}
        images={images}
        selectedImages={selectedImages}
        status={status}
        zoomedImage={zoomedImage}
        editingProduct={editingProduct}
        setResult={setResult}
        setSelectedImages={setSelectedImages}
        setImages={setImages}
        setZoomedImage={setZoomedImage}
        setEditingProduct={setEditingProduct}
        handleImageSelect={handleImageSelect}
        Envoyer={Envoyer}
      />
    </ProductStoreProvider>
  )
}

// Composant pour le contenu principal

function ProductContent({
  prompts,
  setPrompts,
  result,
  loading,
  images,
  selectedImages,
  status,
  zoomedImage,
  editingProduct,
  setResult,
  setSelectedImages,
  setImages,
  setZoomedImage,
  setEditingProduct,
  handleImageSelect,
  Envoyer,
}: {
  prompts: string
  setPrompts: (value: string) => void
  result: string
  loading: boolean
  images: string[]
  selectedImages: string[]
  status: string
  zoomedImage: string | null
  editingProduct: Product | null
  setResult: (value: string) => void
  setSelectedImages: (value: string[]) => void
  setImages: (value: string[]) => void
  setZoomedImage: (value: string | null) => void
  setEditingProduct: (value: Product | null) => void
  handleImageSelect: (imageUrl: string) => void
  Envoyer: () => Promise<void>
}) {
  const { products, addProduct, updateProduct, removeProduct } = useProductStore()
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")

  // Obtenir les catégories uniques pour le filtre
  const uniqueCategories = Array.from(new Set(products.map((product) => product.Catégorie)))

  useEffect(() => {
    if (result) {
      try {
        const parsedProduct = JSON.parse(result)
        setCurrentProduct(parsedProduct)
      } catch (error) {
        console.error("Erreur de parsing du résultat :", error)
        setCurrentProduct(null)
      }
    } else {
      setCurrentProduct(null)
    }
  }, [result])

  const AjouterAuTableau = () => {
    if (selectedImages.length === 0) {
      toast.error("Veuillez sélectionner au moins une image !")
      return
    }
    if (!currentProduct) return

    try {
      addProduct({ ...currentProduct, imageUrls: selectedImages })
      toast.success("Produit ajouté avec succès !")
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit")
    }
  }

  return (
    <div className="w-full p-4 gap-4">
      <div className="flex justify-end mb-4">
        <Dialog>

          <DialogTrigger className="bg-[#7f1d1c] hover:bg-[#7f1d1c] transition-colors text-white px-4 py-2 rounded-lg">
            Ajouter un produit

          

          </DialogTrigger>
          <DialogContent className="max-w-lg w-full p-6">
            <DialogTitle className="text-xl font-bold mb-4">Génération de produit</DialogTitle>

            <form className="space-y-4">
              {/* Conteneur des inputs en flex */}
              <div className="flex space-x-4">
                {/* Champ de saisie pour le prompt */}
                <div className="flex-1">
                  <Input
                    type="text"
                    className="block w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    onChange={(e) => setPrompts(e.target.value)}
                    value={prompts}
                    placeholder="Décrivez  le produit à générer..."
                    required
                  />
                </div>
                {/* Bouton pour générer */}
                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    className="text-white bg-[#7f1d1c] hover:bg-[#7f1d1c] transition-colors px-4 py-2 rounded"
                    onClick={Envoyer}
                  >
                    Générer
                  </Button>
                </div>
              </div>
            </form>

            <h2 className="font-semibold text-lg">Résultat</h2>
            <div className="min-h-[200px] p-4 rounded-lg border bg-gray-50 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : currentProduct ? (
                <div className="space-y-4">
                  {/* Les autres sections des champs du produit */}
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Nom du produit</label>
                      <input
                        type="text"
                        readOnly
                        value={currentProduct.Nom}
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Prix</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          readOnly
                          value={currentProduct.Prix}
                          className="w-full p-2 border rounded-lg bg-gray-100"
                        />
                        <span className="text-sm text-gray-600">XFA</span>
                      </div>

                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        readOnly
                        value={currentProduct.Description}
                        style={{ resize: 'none' }}
                        className="w-full p-2 border rounded-lg bg-gray-100 min-h-[100px]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Catégorie</label>
                      <input
                        type="text"
                        readOnly
                        value={currentProduct.Catégorie}
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Affichage des images générées */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Images générées</h3>
                    <div className="flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img || "/placeholder.svg?height=64&width=64"}
                            alt={`Image générée ${idx + 1}`}
                            className={`w-16 h-16 object-cover cursor-pointer rounded border ${selectedImages.includes(img) ? "ring-2 ring-blue-500" : ""
                              }`}
                            onClick={() => handleImageSelect(img)}
                            onError={(e) => {
                              ; (e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                            }}
                          />
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
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Aucun résultat à afficher
                </div>
              )}
            </div>

            {/* Affichage conditionnel du bouton "Ajouter le produit" */}
            {currentProduct && selectedImages.length > 0 && (
              <div className="mt-4 flex items-center justify-center">
                <button
                  className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white py-2 px-4 rounded-md"
                  onClick={AjouterAuTableau}
                >
                  Ajouter le produit
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
