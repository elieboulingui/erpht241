"use client"

import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ProductGeneratorModal } from "./product-generator-modal"
import { useState } from "react"

interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void; // Fonction pour mettre à jour la recherche
  sortBy: string; // Ajouter cette propriété pour le tri par prix
  setSortBy: React.Dispatch<React.SetStateAction<string>>; // Ajouter cette fonction pour mettre à jour le tri
}

export default function ProductHeader({
  searchQuery,
  setSearchQuery,
  sortBy, // Désormais `sortBy` est utilisé ici
  setSortBy, // Désormais `setSortBy` est utilisé ici
}: ProductHeaderProps) {
  const [category, setCategory] = useState<string>("all");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Produits</h1>
          <div className="text-muted-foreground rounded-full bg-muted w-6 h-6 flex items-center justify-center">
            <span className="text-xs">i</span>
          </div>
        </div>
        <ProductGeneratorModal />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Catégorie:</span>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="electronics">Électronique</SelectItem>
                  <SelectItem value="clothing">Téléphone</SelectItem>
                  <SelectItem value="furniture">Ordinateurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Trier par prix:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Par défaut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Par défaut</SelectItem>
                <SelectItem value="asc">Prix croissant</SelectItem>
                <SelectItem value="desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Mettre à jour la recherche ici
          />
        </div>
      </div>
    </div>
  )
}
