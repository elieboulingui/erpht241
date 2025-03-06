"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface ProductCategoriesSelectorProps {
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
}

// Sample categories data
const categoriesData: Category[] = [
  {
    id: "uncategorized",
    name: "Uncategorized",
  },
  {
    id: "auto-accessories",
    name: "Accessoires automobiles",
    children: [
      { id: "tonneau-covers", name: "Couvre-tonneaux" },
      { id: "air-deflectors", name: "Déflecteurs d'air" },
      { id: "embedded-electronics", name: "Électronique embarquée" },
    ],
  },
  {
    id: "air-conditioning",
    name: "Air conditioning",
    children: [
      { id: "ac-compressor", name: "Ac compressor" },
      { id: "condenser", name: "Condenser" },
    ],
  },
]

export function ProductCategoriesSelector({
  selectedCategories,
  setSelectedCategories,
}: ProductCategoriesSelectorProps) {
  const [filter, setFilter] = useState("Toutes les catégories")
  const [isOpen, setIsOpen] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId],
    )
  }

  const renderCategory = (category: Category, depth = 0) => (
    <div
      key={category.id}
      className={cn("transition-all duration-200 hover:bg-gray-50 rounded-lg", depth > 0 && "ml-4")}
    >
      <div className="flex items-center space-x-2 py-2 px-2">
        <Checkbox
          id={category.id}
          checked={selectedCategories.includes(category.id)}
          onCheckedChange={() => toggleCategory(category.id)}
          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
        <label
          htmlFor={category.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {category.name}
        </label>
      </div>
      {category.children?.map((child) => renderCategory(child, depth + 1))}
    </div>
  )

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
        <h3 className="font-medium flex items-center gap-2 text-gray-700">
          <Filter className="h-4 w-4" />
          Catégories de produits
        </h3>
      </div>
      <div className="p-3">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full border border-gray-200 rounded-lg flex items-center p-3 text-sm bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-gray-700">{filter}</span>
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 text-gray-500 transition-transform duration-200",
                isOpen && "transform rotate-180",
              )}
            />
          </button>
        </div>
        <ScrollArea className="h-[280px] mt-3 pr-4">
          <div className="space-y-1 p-1">{categoriesData.map((category) => renderCategory(category))}</div>
        </ScrollArea>
      </div>
    </div>
  )
}

