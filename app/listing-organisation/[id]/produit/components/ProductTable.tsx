"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, SlidersHorizontal, RefreshCw, Eye } from "lucide-react"
import Chargement from "@/components/Chargement"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateProductByOrganisationAndProductId } from "../actions/ItemUpdate"
import { Label } from "@/components/ui/label"
import PaginationGlobal from "@/components/paginationGlobal"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import Link from "next/link"
import { deleteProductByOrganisationAndProductId } from "../actions/DeleteItems"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CommonTable } from "@/components/CommonTable"

interface Product {
  id?: string
  name: string
  description: string
  price: number
  images?: string[]
  generatedImages?: string[] // Images générées par l'IA
  allGeneratedImages?: string[] // Historique complet des images générées
  actions?: string | null
  organisationId: string
  createdAt: Date
  updatedAt: Date
  isArchived: boolean
  archivedAt: Date | null
  archivedBy: string | null
  categories?: { id: string; name: string; parentId?: string }[]
}

interface ProductsTableProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  category: string
  categories: { id: string; name: string }[]
  onProductCreated?: () => void
  productAdded: boolean
}

function extractOrganisationId(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9-]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export default function ProductsTableEnhanced({
  searchQuery,
  setSearchQuery,
  sortBy,
  category,
  categories,
  onProductCreated,
  productAdded,
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmName, setConfirmName] = useState("")
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [currentDescription, setCurrentDescription] = useState<string | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editedProduct, setEditedProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Nouveaux états pour la gestion des images IA
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [regeneratingImages, setRegeneratingImages] = useState(false)

  const organisationId = extractOrganisationId(window.location.href)

  const fetchProducts = async () => {
    try {
      const url =
        category && category !== "all"
          ? `/api/selectcategory?organisationId=${organisationId}&categoryName=${category}`
          : `/api/produict?organisationId=${organisationId}`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Erreur lors de la récupération des produits.")

      const data = await response.json()
      setProducts(
        data.map((product: Product) => ({
          ...product,
          categories: Array.isArray(product.categories) ? product.categories : [],
        })),
      )
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)

    if (productAdded) {
      setLoading(true)
      fetchProducts()
    } else {
      fetchProducts()
    }
  }, [category, organisationId, productAdded])

  const getShortDescription = (description: string) => {
    const words = description.split(" ")
    if (words.length > 4) {
      return words.slice(0, 4).join(" ") + "..."
    }
    return description
  }

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteProduct = async () => {
    if (!productToDelete) return

    try {
      await deleteProductByOrganisationAndProductId(organisationId!, productToDelete.id!)
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productToDelete.id))
      toast.success("Produit supprimé avec succès.")
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit.")
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditedProduct(product)
    setSelectedImages(product.images || [])
    setAvailableImages(
      [...(product.generatedImages || []), ...(product.allGeneratedImages || [])].filter(
        (img, index, arr) => arr.indexOf(img) === index,
      ),
    ) // Supprimer les doublons
    setIsEditSheetOpen(true)
  }

  // Fonction pour régénérer des images
  const regenerateImages = async (productName: string) => {
    setRegeneratingImages(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY
      const cx = process.env.NEXT_PUBLIC_IMAGE_CX
      const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${productName}&key=${apiKey}&cx=${cx}&searchType=image&num=10`

      const response = await fetch(imageSearchUrl)
      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const newImages = data.items.map((item: any) => item.link)
        setAvailableImages((prev) => {
          const combined = [...prev, ...newImages]
          return combined.filter((img, index, arr) => arr.indexOf(img) === index)
        })
        toast.success("Nouvelles images générées !")
      } else {
        toast.warning("Aucune nouvelle image trouvée.")
      }
    } catch (error) {
      toast.error("Erreur lors de la génération d'images.")
    } finally {
      setRegeneratingImages(false)
    }
  }

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((img) => img !== imageUrl)
      }
      return [...prev, imageUrl]
    })
  }

  const handleProductUpdate = async () => {
    if (editedProduct) {
      try {
        const updatedPrice = Number.parseFloat(editedProduct.price.toString())
        if (isNaN(updatedPrice)) {
          toast.error("Le prix doit être un nombre valide.")
          return
        }

        const updatedProduct = await updateProductByOrganisationAndProductId(organisationId!, editedProduct.id!, {
          name: editedProduct.name,
          description: editedProduct.description,
          price: updatedPrice,
          categories: editedProduct.categories?.map((cat) => cat.id) || [],
          images: selectedImages, // Utiliser les images sélectionnées
        })

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id
              ? {
                  ...product,
                  ...updatedProduct,
                  price: updatedPrice,
                  images: selectedImages,
                  generatedImages: availableImages,
                }
              : product,
          ),
        )
        toast.success("Produit mis à jour avec succès.")
        setEditedProduct(null)
        setIsEditSheetOpen(false)
        setSelectedImages([])
        setAvailableImages([])
        if (onProductCreated) {
          onProductCreated()
        }
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du produit.")
      }
    }
  }

  const indexOfLastProduct = currentPage * rowsPerPage
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return <Chargement />
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  const tableHeaders = [
    { key: "name", label: "Nom du Produit", width: "250px", sortable: true },
    { key: "description", label: "Description", width: "250px", sortable: true },
    { key: "categories", label: "Catégorie", sortable: true },
    { key: "price", label: "Prix", sortable: true },
    { key: "images", label: "Images", align: "left" as const, width: "50px", sortable: true },
    { key: "actions", label: <SlidersHorizontal className="h-4 w-4" />, align: "center" as const },
  ]

  const tableRows = currentProducts.map((product) => ({
    id: product.id || "",
    name: (
      <Link href={`/listing-organisation/${organisationId}/produit/produits/${product.id}`} className="hover:underline">
        {product.name}
      </Link>
    ),
    description: getShortDescription(product.description),
    categories: product.categories?.map((category) => category.name).join(", "),
    price: `${product.price.toFixed(2)} xfa`,
    images:
      product.images && product.images.length > 0 ? (
        <div className="flex items-center gap-1">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt="Produit"
            className="h-10 w-10 object-cover rounded-md"
          />
          {product.images.length > 1 && (
            <span className="text-xs bg-gray-200 px-1 rounded">+{product.images.length - 1}</span>
          )}
        </div>
      ) : (
        <span>Pas d'images</span>
      ),
    actions: (
      <div className="gap-2">
        <Popover>
          <PopoverTrigger asChild className="border-none">
            <Button variant="outline" className="w-[35px] h-[35px] p-0">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-2">
            <div className="bg-white">
              <Button className="w-full bg-white hover:bg-white text-black" onClick={() => handleEditProduct(product)}>
                Modifier
              </Button>
              <Button
                className="w-full mt-2 bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white"
                onClick={() => openDeleteDialog(product)}
              >
                Supprimer
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  }))

  return (
    <div className="z-10 overflow-hidden p-3">
      <CommonTable
        headers={tableHeaders}
        rows={tableRows}
        emptyState="Aucun produit disponible"
        headerClassName="bg-gray-300"
        onSort={(key) => console.log(`Sort by ${key}`)}
      />

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(products?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={products?.length || 0}
      />

      {/* Sheet de modification amélioré avec gestion des images IA */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Modifier le produit</SheetTitle>
            <SheetDescription>Modifiez les informations du produit et gérez ses images.</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Informations du produit */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  value={editedProduct?.name || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct!, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedProduct?.description || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct!, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  type="number"
                  value={editedProduct?.price || ""}
                  onChange={(e) => setEditedProduct({ ...editedProduct!, price: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>

            {/* Gestion des images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Gestion des images</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateImages(editedProduct?.name || "")}
                  disabled={regeneratingImages}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${regeneratingImages ? "animate-spin" : ""}`} />
                  {regeneratingImages ? "Génération..." : "Nouvelles images"}
                </Button>
              </div>

              {/* Images actuellement sélectionnées */}
              {selectedImages.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">Images sélectionnées ({selectedImages.length})</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Sélectionnée ${index + 1}`}
                          className="w-full h-20 object-cover rounded border-2 border-green-500"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                        <button
                          onClick={() => handleImageSelect(image)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Toutes les images disponibles */}
              {availableImages.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">
                    Images disponibles (cliquez pour sélectionner/désélectionner)
                  </Label>
                  <div className="grid grid-cols-4 gap-2 mt-2 max-h-60 overflow-y-auto">
                    {availableImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Disponible ${index + 1}`}
                          className={`w-full h-20 object-cover rounded cursor-pointer transition-all hover:scale-105 ${
                            selectedImages.includes(image)
                              ? "border-2 border-green-500 opacity-75"
                              : "border border-gray-300 hover:border-blue-500"
                          }`}
                          onClick={() => handleImageSelect(image)}
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                        {selectedImages.includes(image) && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
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

              {availableImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune image générée par l'IA disponible</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateImages(editedProduct?.name || "")}
                    disabled={regeneratingImages}
                    className="mt-2"
                  >
                    Générer des images
                  </Button>
                </div>
              )}
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditSheetOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={handleProductUpdate}>
              Mettre à jour ({selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""})
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white" onClick={handleDeleteProduct}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour zoom d'image */}
      {zoomedImage && (
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-4xl">
            <img
              src={zoomedImage || "/placeholder.svg"}
              alt="Image agrandie"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
