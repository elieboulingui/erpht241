"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProductData } from "./product-generator-modal"
import { DollarSign, FileText, Image, Tag } from "lucide-react"

interface ProductGenerationResultProps {
  product: ProductData
}

export function ProductGenerationResult({ product }: ProductGenerationResultProps) {
  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="product-name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Nom du produit
          </label>
          <Input
            id="product-name"
            value={product.name}
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="product-price" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <DollarSign className="h-4 w-4 " />
            Prix
          </label>
          <Input
            id="product-price"
            value={product.price}
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="product-description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4 " />
            Description
          </label>
          <Textarea
            id="product-description"
            value={product.description}
            className="h-[120px] bg-gray-50 resize-none border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            readOnly
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="product-categories" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4" />
            Categories
          </label>
          <Input
            id="product-categories"
            value={product.categories.join(", ")}
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            readOnly
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Image className="h-4 w-4 " />
          Image générer
        </label>
        <div className="grid grid-cols-4 gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square w-20 h-20 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden group relative cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Generated product image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
                <span className="text-white text-xs font-medium">Image {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

