"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

// Type pour les produits
interface Product {
  id: number
  name: string
  price: number
  quantity?: number
}

// Liste des produits disponibles (normalement ceci viendrait d'une API)
const AVAILABLE_PRODUCTS: Product[] = [
  { id: 1, name: "Ordinateur portable HP", price: 450000 },
  { id: 2, name: "Ordinateur portable Dell", price: 500000 },
  { id: 3, name: "PC Bureau Gaming", price: 650000 },
  { id: 4, name: "Imprimante HP LaserJet", price: 250000 },
  { id: 5, name: "Imprimante Epson Multifonction", price: 300000 },
  { id: 6, name: "Chargeur USB-C 65W", price: 15000 },
  { id: 7, name: "Chargeur sans fil Qi", price: 25000 },
  { id: 8, name: "Souris sans fil Logitech", price: 20000 },
  { id: 9, name: "Souris Gaming RGB", price: 35000 },
  { id: 10, name: "Clavier mécanique", price: 40000 },
  { id: 11, name: 'Écran 24" Full HD', price: 180000 },
  { id: 12, name: "Disque dur externe 1To", price: 60000 },
  { id: 13, name: "SSD 500Go", price: 50000 },
  { id: 14, name: "Casque Bluetooth", price: 35000 },
  { id: 15, name: "Webcam HD", price: 45000 },
]

interface ProductSearchProps {
  onAddProduct: (product: Product) => void
}

export default function ProductSearch({ onAddProduct }: ProductSearchProps) {
  const [searchProduct, setSearchProduct] = useState("")
  const [searchQuantity, setSearchQuantity] = useState("1")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Gérer les clics en dehors du composant pour fermer la liste
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filtrer les produits en fonction du terme de recherche
  useEffect(() => {
    if (searchProduct.trim() === "") {
      setSearchResults([])
      setShowResults(false)
      setSelectedProduct(null)
      return
    }

    const filteredProducts = AVAILABLE_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase()),
    )
    setSearchResults(filteredProducts)
    setShowResults(true)
  }, [searchProduct])

  // Sélectionner un produit dans la liste
  const selectProduct = (product: Product) => {
    setSearchProduct(product.name)
    setSelectedProduct(product)
    setShowResults(false)
  }

  // Ajouter le produit sélectionné
  const addProduct = () => {
    // Si un produit est sélectionné ou si le premier résultat existe
    const productToAdd = selectedProduct || (searchResults.length > 0 ? searchResults[0] : null)

    if (productToAdd) {
      const quantity = Number.parseInt(searchQuantity) || 1
      onAddProduct({
        ...productToAdd,
        quantity,
      })

      // Réinitialiser les champs après l'ajout
      setSearchProduct("")
      setSearchQuantity("1")
      setSelectedProduct(null)
    }
  }

  return (
    <div className="mb-6 relative" ref={searchRef}>
      <Label className="text-sm font-medium">Rechercher un produit</Label>
      <div className="flex gap-2 mt-1">
        <div className="relative flex-1">
          <Input
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            placeholder="Rechercher"
            className="flex-1 focus:ring-2 focus:ring-red-500/50 transition-all pl-10"
            onFocus={() => searchProduct.trim() !== "" && setShowResults(true)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />

          {/* Résultats de recherche */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectProduct(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.price.toLocaleString("fr-FR")} FCFA</div>
                </div>
              ))}
            </div>
          )}

          {showResults && searchResults.length === 0 && searchProduct.trim() !== "" && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500">
              Aucun produit trouvé
            </div>
          )}
        </div>
        <Input
          type="number"
          value={searchQuantity}
          onChange={(e) => setSearchQuantity(e.target.value)}
          placeholder="Quantité"
          className="w-32 focus:ring-2 focus:ring-red-500/50 transition-all"
          min="1"
        />
        <Button
          onClick={addProduct}
          className="bg-red-800 hover:bg-red-700 text-white transition-colors"
          disabled={!selectedProduct && searchResults.length === 0}
        >
          Ajouter produit
        </Button>
      </div>
    </div>
  )
}

