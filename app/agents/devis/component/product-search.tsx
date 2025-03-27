"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProductSearchProps {
  searchProduct: string
  setSearchProduct: (value: string) => void
  searchQuantity: string
  setSearchQuantity: (value: string) => void
  addProduct: () => void
}

export function ProductSearch({
  searchProduct,
  setSearchProduct,
  searchQuantity,
  setSearchQuantity,
  addProduct,
}: ProductSearchProps) {
  return (
    <div className="mb-6">
      <Label className="text-sm font-medium">Rechercher un produit</Label>
      <div className="flex gap-2 mt-1">
        <Input
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="Rechercher"
          className="flex-1"
        />
        <Input
          type="number"
          value={searchQuantity}
          onChange={(e) => setSearchQuantity(e.target.value)}
          placeholder="Quantité"
          className="w-32"
        />
        <Button onClick={addProduct} className="bg-red-800 hover:bg-red-700 text-white">
          Ajouter produit
        </Button>
      </div>
    </div>
  )
}

