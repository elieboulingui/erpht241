"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import type { Product } from "./types"

interface ProductTableProps {
  products: Product[]
  updateProduct: (id: number, field: keyof Product, value: string | number) => void
  removeProductLine: (id: number) => void
}

export function ProductTable({ products, updateProduct, removeProductLine }: ProductTableProps) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-sm">
            <th className="py-2 px-2 w-10">#</th>
            <th className="py-2 px-2">
              Nom Produit <span className="text-gray-400">ⓘ</span>
            </th>
            <th className="py-2 px-2">Quantité</th>
            <th className="py-2 px-2">Prix</th>
            <th className="py-2 px-2">Réduction</th>
            <th className="py-2 px-2">Taxe</th>
            <th className="py-2 px-2">Total</th>
            <th className="py-2 px-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="py-2 px-2">{product.id}</td>
              <td className="py-2 px-2">
                <Input
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="py-2 px-2">
                <Input
                  type="number"
                  value={product.quantity || ""}
                  onChange={(e) => updateProduct(product.id, "quantity", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="py-2 px-2">
                <Input
                  type="number"
                  value={product.price || ""}
                  onChange={(e) => updateProduct(product.id, "price", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="py-2 px-2">
                <Input
                  type="number"
                  value={product.discount || ""}
                  onChange={(e) => updateProduct(product.id, "discount", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="py-2 px-2">
                <Input
                  type="number"
                  value={product.tax || ""}
                  onChange={(e) => updateProduct(product.id, "tax", e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="py-2 px-2">
                <Input type="number" value={product.total || ""} readOnly className="w-full bg-gray-50" />
              </td>
              <td className="py-2 px-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProductLine(product.id)}
                  className="h-8 w-8 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

