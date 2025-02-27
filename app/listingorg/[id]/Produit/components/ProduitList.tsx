"use client"

import { useState } from "react"
import { AlignJustify } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebarproduit"

export default function CategoryManagement() {
  const [categories, setCategories] = useState([{ nom: "Smarphne", categoriePure: "Samsung A52", nombreProduit: 12 }])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-medium">Catégories</h1>
          <button className="bg-gray-200 px-4 py-2 hover:bg-gray-300 transition-colors">Ajouter une Catégorie</button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center mb-6 bg-gray-200 p-2">
          <div className="flex items-center mr-4">
            <AlignJustify className="h-5 w-5 mr-2" />
            <span>Nom</span>
          </div>
          <div className="flex items-center mr-auto">
            <span>Nombre</span>
          </div>
          <Button variant="outline" className="bg-gray-300 hover:bg-gray-400">
            Rechercher
          </Button>
        </div>

        {/* Table */}
        <div className="bg-gray-200 rounded">
          <div className="grid grid-cols-3 text-white font-medium">
            <div className="bg-red-700 p-2 text-center">Nom</div>
            <div className="bg-blue-800 p-2 text-center">Catégorie Pure</div>
            <div className="bg-green-500 p-2 text-center">Nombre de Produit</div>
          </div>

          {categories.map((category, index) => (
            <div key={index} className="grid grid-cols-3 border-t border-gray-300">
              <div className="p-2 text-center">{category.nom}</div>
              <div className="p-2 text-center">{category.categoriePure}</div>
              <div className="p-2 text-center">{category.nombreProduit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
