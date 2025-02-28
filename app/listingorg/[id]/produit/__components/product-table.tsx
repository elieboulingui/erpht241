"use client"

import { useState } from "react"
import { Maximize2, MoreHorizontal, SlidersHorizontal } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Product } from "@/types/product"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productName: string) => void
  onZoomImage: (imageUrl: string) => void
}

export function ProductTable({ products, onEdit, onDelete, onZoomImage }: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)

  const filteredProducts = products.filter(
    (product) =>
      product.Nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Catégorie.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Obtenir les catégories uniques pour le filtre
  const uniqueCategories = Array.from(new Set(products.map((product) => product.Catégorie)))

  const titreColonnes = [
    { key: "select", label: "" },
    { key: "nom", label: "Nom du Produit" },
    { key: "description", label: "Description", className: "w-1/3" },
    { key: "categorie", label: "Catégorie" },
    { key: "prix", label: "Prix" },
    { key: "images", label: "Images" },
    { key: "stock", label: "Stock" },
    { key: "dateCreation", label: "Date de création" },
    { key: "actions", label: <SlidersHorizontal className="h-4 w-4" /> },
  ]

  const filter = [
    { value: "all", label: "Tous" },
    { value: "category", label: "Catégorie" },
    { value: "numberStock", label: "Stock" },
  ]

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((product) => product.Nom))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (productName: string) => {
    if (selectedProducts.includes(productName)) {
      setSelectedProducts(selectedProducts.filter((name) => name !== productName))
    } else {
      setSelectedProducts([...selectedProducts, productName])
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-semibold text-2xl text-center mb-6">Produits enregistrés</h2>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        {/* Filtrer par catégorie */}
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all">
            <TabsList className="bg-white">
              {filter.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="flex items-center gap-2">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Rechercher */}
        <div className="relative flex-grow md:w-64 md:flex-grow-0">
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
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full table-auto border-collapse bg-white">
          {/* titre des colonnes */}
          <thead>
            <tr className="bg-gray-50 text-left">
              {titreColonnes.map((col) => (
                <th key={col.key} className={`p-3 border-b text-sm text-gray-500 font-light ${col.className || ""}`}>
                  {col.key === "select" ? (
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="w-4 h-4" />
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Tableau des produits */}
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={9}>
                  Aucun produit enregistré.
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={9}>
                  Aucun produit ne correspond à votre recherche.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${selectedProducts.includes(product.Nom) ? "bg-blue-50" : ""}`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.Nom)}
                      onChange={() => handleSelectProduct(product.Nom)}
                      className="w-4 h-4"
                    />
                  </td>
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
                              onClick={() => onZoomImage(img)}
                            >
                              <Maximize2 className="w-3 h-3 text-gray-700" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.dateCreation}</td>

                  {/* boutons de suppression et de modification */}
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-200">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ouvrir le menu</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)} className="cursor-pointer">
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(product.Nom)} className="cursor-pointer text-red-500">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* boutons de suppression une ou plusieurs produits */}
      {selectedProducts.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
          <span>{selectedProducts.length} produit(s) sélectionné(s)</span>
          <div className="flex gap-2">
            <button
              className="bg-red-500 hover:bg-red-600 transition-colors text-white px-3 py-1 rounded"
              onClick={() => {
                if (confirm(`Voulez-vous supprimer ${selectedProducts.length} produit(s) ?`)) {
                  selectedProducts.forEach((name) => onDelete(name))
                  setSelectedProducts([])
                  setSelectAll(false)
                }
              }}
            >
              Supprimer la sélection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

