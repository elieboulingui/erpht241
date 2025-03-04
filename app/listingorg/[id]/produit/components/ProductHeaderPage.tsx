"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import ProductHeader from "./ProductHeader"

// Define your interfaces
interface Product {
  id?: string
  Nom: string
  Description: string
  Catégorie: string
  Prix: string
  imageUrls?: string[]
  generatedImages?: string[]
}

export default function ProductPage() {
  const [prompts, setPrompts] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [images, setImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [status, setStatus] = useState<string>("")
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    categorie: "",
    prix: "",
  })

  // Mock function for demonstration
  const Envoyer = async () => {
    setLoading(true)
    setStatus("Génération en cours...")

    // Simulate API call
    setTimeout(() => {
      setFormData({
        nom: "Produit exemple",
        description: "Description du produit exemple",
        categorie: "Catégorie exemple",
        prix: "10000",
      })

      // Mock images
      setImages([
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
      ])

      setLoading(false)
      setStatus("Produit généré avec succès!")
    }, 1500)
  }

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(imageUrl)) {
        return prevSelected.filter((img) => img !== imageUrl)
      }
      return [...prevSelected, imageUrl]
    })
  }

  const AjouterAuTableau = async () => {
    if (selectedImages.length === 0) {
      alert("Veuillez sélectionner au moins une image !")
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(), // Simple ID generation for demo
      Nom: formData.nom,
      Description: formData.description,
      Catégorie: formData.categorie,
      Prix: formData.prix,
      imageUrls: selectedImages,
    }

    setProducts([...products, newProduct])

    // Reset form
    setFormData({
      nom: "",
      description: "",
      categorie: "",
      prix: "",
    })
    setSelectedImages([])
    setImages([])
    setStatus("Produit ajouté avec succès!")
  }

  return (
    <div className="w-full p-4 gap-4">
      {/* Using the ProductHeader component */}
      <ProductHeader
        prompts={prompts}
        setPrompts={setPrompts}
        formData={formData}
        setFormData={setFormData}
        status={status}
        images={images}
        selectedImages={selectedImages}
        handleImageSelect={handleImageSelect}
        setZoomedImage={setZoomedImage}
        Envoyer={Envoyer}
        AjouterAuTableau={AjouterAuTableau}
      />

      <Separator className="mt-2" />

      {/* Rest of your component */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Liste des produits</h2>

        {products.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border">
            <p className="text-gray-500">Aucun produit n'a été ajouté.</p>
            <p className="text-gray-500 text-sm mt-2">Utilisez le bouton "Ajouter un produit" pour commencer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-3 border-b text-sm text-gray-500 font-light">Nom</th>
                  <th className="p-3 border-b text-sm text-gray-500 font-light">Description</th>
                  <th className="p-3 border-b text-sm text-gray-500 font-light">Catégorie</th>
                  <th className="p-3 border-b text-sm text-gray-500 font-light">Prix</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{product.Nom}</td>
                    <td className="p-3">{product.Description}</td>
                    <td className="p-3">{product.Catégorie}</td>
                    <td className="p-3">{product.Prix} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image zoom dialog */}
      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">Image zoomée</DialogTitle>
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
    </div>
  )
}

