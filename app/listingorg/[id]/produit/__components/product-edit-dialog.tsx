"use client"

import { X } from "lucide-react"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { Product } from "@/types/product"
import { useState } from "react"

interface ProductEditDialogProps {
  product: Product
  onSave: (updatedProduct: Product) => void
  onCancel: () => void
}

export function ProductEditDialog({ product, onSave, onCancel }: ProductEditDialogProps) {
  const [editingProduct, setEditingProduct] = useState<Product>({ ...product })

  return (
    <DialogContent className="max-w-lg">
      <DialogTitle>Modifier le produit</DialogTitle>
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
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Nom: e.target.value,
              })
            }
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
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Description: e.target.value,
              })
            }
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
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Catégorie: e.target.value,
              })
            }
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
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Prix: e.target.value,
              })
            }
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
                      setEditingProduct({
                        ...editingProduct,
                        imageUrls: newUrls,
                      })
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
                      setEditingProduct({
                        ...editingProduct,
                        imageUrls: newUrls,
                      })
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
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors" onClick={onCancel}>
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => onSave(editingProduct)}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </DialogContent>
  )
}

