"use client"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { useState, createContext, useContext, type ReactNode } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Maximize2, X } from "lucide-react"
import { VisuallyHidden } from "@/components/ui/visuallyHidden"

// Définition de l'interface Product
interface Product {
  Nom: string
  Description: string
  Catégorie: string
  Prix: string
  imageUrls?: string[]
  generatedImages?: string[] // Ajout des images générées
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
  const [products, setProducts] = useState<Product[]>([])

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

export default function Page() {
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

    const apiKey = process.env.GOOGLE_API_KEY // Utilisation de la variable d'environnement
    const cx = process.env.GOOGLE_CX // Utilisation de la variable d'environnement

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

  const fetchImages = async (query: string): Promise<void> => {
    setStatus("Recherche d'image en cours...")
    const apiKey = process.env.GOOGLE_API_KEY // Utilisation de la variable d'environnement
    const cx = process.env.GOOGLE_CX // Utilisation de la variable d'environnement
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

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? product.Catégorie === categoryFilter : true
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className="product-generator">
        <textarea
          value={prompts}
          onChange={(e) => setPrompts(e.target.value)}
          placeholder="Décrivez votre produit..."
        />
        <button onClick={Envoyer} disabled={loading}>
          {loading ? "Chargement..." : "Générer"}
        </button>
        <div>
          <h2>Résultat</h2>
          <pre>{result}</pre>
        </div>

        {images.length > 0 && (
          <div className="images">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Generated image ${index + 1}`}
                className={selectedImages.includes(image) ? "selected" : ""}
                onClick={() => handleImageSelect(image)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
