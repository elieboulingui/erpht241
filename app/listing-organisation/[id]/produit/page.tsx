'use client';

import { useState } from "react";
import ProductHeader from "./components/ProductHeaderPage";
import ProductsTable from "./components/ProductTable";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // État pour la recherche
  const [sortBy, setSortBy] = useState<string>('default'); // État pour le tri
  const [category, setCategory] = useState<string>('all'); // État pour la catégorie sélectionnée

  return (
    <div className="space-y-8">
      <ProductHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        category={category}
        setCategory={setCategory}
      />
      {/* Ajouter une clé unique basée sur la catégorie pour forcer le rechargement du composant */}
      <ProductsTable
        key={category} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        category={category}
        categories={[]} 
      />
    </div>
  );
}
