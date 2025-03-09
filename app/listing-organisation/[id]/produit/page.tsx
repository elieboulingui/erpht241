"use client";
import { useState } from "react";
import ProductHeader from "./components/ProductHeaderPage";
import ProductsTable from "./components/ProductTable";


export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // État pour la recherche
  const [sortBy, setSortBy] = useState<string>("default"); // Nouvel état pour le tri par prix

  return (
    <div className="px-5 py-4">
      <ProductHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      /> {/* Header avec champ de recherche et tri */}
      <div className="mt-6">
        {/* Passer searchQuery, setSearchQuery, sortBy et setSortBy en tant que props à ProductsTable */}
        <ProductsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} />
      </div>
    </div>
  );
}
