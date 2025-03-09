"use client";
import { useState } from "react";
import ProductHeader from "./components/ProductHeaderPage";
import ProductsTable from "./components/ProductTable";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // État pour la recherche

  return (
    <div className="px-5 py-4">
      <ProductHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Header avec champ de recherche */}
      <div className="mt-6">
        {/* Passer searchQuery et setSearchQuery en tant que props à ProductsTable */}
        <ProductsTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
}
