"use client"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { useState, createContext, useContext, type ReactNode, useEffect } from "react"
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
  const [products, setProducts] = useState<Product[]>(() => {
    // Récupérer les produits du localStorage si disponible
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("products")
      return savedProducts ? JSON.parse(savedProducts) : []
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
    const matchesCategory = categoryFilter === "" || product.Catégorie === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Obtenir les catégories uniques pour le filtre
  const uniqueCategories = Array.from(new Set(products.map((product) => product.Catégorie)))

  const AjouterAuTableau = () => {
    if (selectedImages.length === 0) {
      alert("Veuillez sélectionner au moins une image !")
      return
    }
    try {
      const product = JSON.parse(result)
      addProduct({ ...product, imageUrls: selectedImages, generatedImages: images })
      alert("Produit ajouté avec succès !")
      setResult("")
      setSelectedImages([])
      setImages([])
    } catch {
      alert("Erreur : Impossible d'ajouter le produit.")
    }
  }

  return (
    <div className="w-full p-4 gap-4">
      <div className="flex justify-end mb-4">
        <Dialog>
          <DialogTrigger className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg">
            Ajouter un produit
          </DialogTrigger>
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
        </Dialog>
      </div>

      <div className="w-full">
        <h2 className="font-semibold text-2xl text-center mb-6">Produits enregistrés</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full p-3 pl-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-64">
            <select
              className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b font-semibold">Nom du Produit</th>
                <th className="p-3 border-b font-semibold w-1/3">Description</th>
                <th className="p-3 border-b font-semibold">Catégorie</th>
                <th className="p-3 border-b font-semibold">Prix</th>
                <th className="p-3 border-b font-semibold">Images</th>
                <th className="p-3 border-b font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={6}>
                    Aucun produit enregistré.
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={6}>
                    Aucun produit ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 font-medium">{product.Nom}</td>
                    <td className="p-3">{product.Description}</td>
                    <td className="p-3">{product.Catégorie}</td>
                    <td className="p-3">{product.Prix} FCFA</td>
                    <td className="p-3">
                      <div className="flex gap-2 overflow-x-auto max-w-[200px] pb-2">
                        {Array.isArray(product.imageUrls) &&
                          product.imageUrls.map((img: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <img
                                src={img || "/placeholder.svg?height=64&width=64"}
                                alt={product.Nom}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover flex-shrink-0 rounded border"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                                }}
                              />
                              <button
                                className="absolute top-1 left-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setZoomedImage(img)}
                              >
                                <Maximize2 className="w-3 h-3 text-gray-700" />
                              </button>
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 transition-colors text-white px-3 py-1 rounded flex items-center justify-center"
                          onClick={() => {
                            setEditingProduct(product)
                          }}
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 transition-colors text-white px-3 py-1 rounded flex items-center justify-center"
                          onClick={() => removeProduct(product.Nom)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-3xl">
          <VisuallyHidden>
            <DialogTitle>Image zoomée</DialogTitle>
          </VisuallyHidden>
          {zoomedImage && (
            <img
              src={zoomedImage || "/placeholder.svg"}
              alt="Image zoomée"
              className="w-full h-auto object-contain max-h-[80vh]"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
              }}
            />
          )}
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white/100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Modifier le produit</DialogTitle>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nom
                </label>
                <input
                  id="edit-name"
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={editingProduct.Nom}
                  onChange={(e) => setEditingProduct({ ...editingProduct, Nom: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  className="w-full p-2 border rounded-lg min-h-[100px]"
                  value={editingProduct.Description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, Description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Catégorie
                </label>
                <input
                  id="edit-category"
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={editingProduct.Catégorie}
                  onChange={(e) => setEditingProduct({ ...editingProduct, Catégorie: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-price" className="text-sm font-medium">
                  Prix (FCFA)
                </label>
                <input
                  id="edit-price"
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={editingProduct.Prix}
                  onChange={(e) => setEditingProduct({ ...editingProduct, Prix: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Images sélectionnées</label>
                <div className="flex flex-wrap gap-2">
                  {editingProduct.imageUrls &&
                    editingProduct.imageUrls.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img || "/placeholder.svg?height=64&width=64"}
                          alt={`Image ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                        <button
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                          onClick={() => {
                            const newUrls = [...editingProduct.imageUrls!].filter((_, i) => i !== idx)
                            setEditingProduct({ ...editingProduct, imageUrls: newUrls })
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Images générées</label>
                <div className="flex flex-wrap gap-2">
                  {editingProduct.generatedImages &&
                    editingProduct.generatedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img || "/placeholder.svg?height=64&width=64"}
                          alt={`Image générée ${idx + 1}`}
                          className={`w-16 h-16 object-cover cursor-pointer rounded border ${
                            editingProduct.imageUrls?.includes(img) ? "ring-2 ring-blue-500" : ""
                          }`}
                          onClick={() => {
                            const newUrls = editingProduct.imageUrls?.includes(img)
                              ? editingProduct.imageUrls.filter((url) => url !== img)
                              : [...(editingProduct.imageUrls || []), img]
                            setEditingProduct({ ...editingProduct, imageUrls: newUrls })
                          }}
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                        {editingProduct.imageUrls?.includes(img) && (
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
              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setEditingProduct(null)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    if (editingProduct) {
                      updateProduct(editingProduct)
                      setEditingProduct(null)
                    }
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}







