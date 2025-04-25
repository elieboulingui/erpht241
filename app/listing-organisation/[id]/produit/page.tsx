"use client"
import { useState, useEffect } from "react";
import ProductHeader from "./components/ProductHeaderPage";
import ProductsTable from "./components/ProductTable";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState<string>(""); // État pour la recherche
  const [sortBy, setSortBy] = useState<string>("default"); // État pour le tri
  const [category, setCategory] = useState<string>("all"); // État pour la catégorie sélectionnée
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]); // Liste des catégories
  const [productAdded, setProductAdded] = useState<boolean>(false); // État pour suivre l'ajout du produit

  useEffect(() => {
    // Récupération des catégories depuis l'API (exemple)
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
      }
    };

    fetchCategories();
  }, []);

  // Fonction pour gérer l'ajout d'un produit
  const handleProductAdded = (added: boolean) => {
    setProductAdded(added);
  
  };

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        {/* Passer les props à ProductHeader */}
        <ProductHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          category={category}
          setCategory={setCategory}
          onProductAdded={handleProductAdded} // Passer la fonction pour gérer l'ajout d'un produit
        />
        {/* Passer les props à ProductsTable */}
        <ProductsTable
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          category={category}
          categories={categories}
          productAdded={productAdded} // Passer l'état du produit ajouté
        />
      </div>
    </div>
  );
}
