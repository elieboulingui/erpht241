'use client';

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductGeneratorModal } from "./product-generator-modal";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";

// Fonction pour extraire l'ID de l'URL
function getOrganisationIdFromUrl(url: string): string | null {
  const regex = /\/listing-organisation\/([a-z0-9]{20,})\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}

interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductHeader({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  category,
  setCategory
}: ProductHeaderProps) {
  const [categories, setCategories] = useState<any[]>([]);  // Pour stocker les catégories récupérées
  const [organisationId, setOrganisationId] = useState<string | null>(null);

  // Utilisation de useEffect pour obtenir l'ID depuis l'URL et récupérer les catégories
  useEffect(() => {
    const url = window.location.href; // Obtenir l'URL actuelle de la page
    const id = getOrganisationIdFromUrl(url);
    setOrganisationId(id); // Enregistrer l'ID dans l'état

    if (id) {
      // Appel API pour récupérer les catégories
      fetch(`/api/category?organisationId=${id}`)
        .then((response) => response.json())
        .then((data) => {
          setCategories(data); // Mettre à jour l'état des catégories avec les données reçues
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des catégories:", error);
        });
    }
  }, []);

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" />
          <div className="text-black font-bold">Produit</div>
        </div>
        <ProductGeneratorModal />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {/* Affichage des catégories récupérées dynamiquement */}
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories">Aucune catégorie disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            onChange={(e) => setSearchQuery(e.target.value)} // Met à jour la recherche ici
          />
        </div>
      </div>
    </div>
  );
}
