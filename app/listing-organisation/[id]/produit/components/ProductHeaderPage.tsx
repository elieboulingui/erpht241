'use client';

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenIcon, Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProductGeneratorModal } from "./product-generator-modal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

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
  const [categories, setCategories] = useState<any[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAI, setIsAI] = useState(false); // Utilisé pour afficher le modal de génération de produit "via IA"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Utilisé pour contrôler l'affichage du menu déroulant
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Contrôler l'ouverture du Sheet pour créer un produit

  useEffect(() => {
    const url = window.location.href;
    const id = getOrganisationIdFromUrl(url);
    setOrganisationId(id);

    if (id) {
      fetch(`/api/category?organisationId=${id}`)
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));
    }
  }, []);

  // Gérer l'activation de "via IA" et ouvrir le modal
  const handleAIOptionChange = (isAI: boolean) => {
    setIsAI(isAI); // Activer ou désactiver l'option "via IA"
    if (isAI) {
      // Réinitialiser les états lorsqu'on passe en mode IA
      setSearchQuery(''); // Réinitialiser la recherche
      setCategory('all'); // Réinitialiser la catégorie
      setSortBy('default'); // Réinitialiser le tri
    }
    setIsDropdownOpen(false); // Fermer le menu déroulant après sélection
  };

  // Gérer l'ouverture et la fermeture du menu déroulant
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fonction pour ouvrir le Sheet pour créer un produit
  const handleManualCreation = () => {
    setIsSheetOpen(true); // Ouvrir le Sheet
    setIsDropdownOpen(false); // Fermer le menu déroulant
  };

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" />
          <div className="text-black font-bold">Produit</div>
        </div>

        {/* Bouton pour ajouter un produit */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg"
              onClick={toggleDropdown}
            >
              <Plus className="h-2 w-2" /> Ajouter un produit
            </Button>
          </DropdownMenuTrigger>

          {/* Menu déroulant avec les options "Manuellement" et "via IA" */}
          <DropdownMenuContent 
            align="end" 
            className="w-[180px] bg-white cursor-pointer  z-50"
          >
            <DropdownMenuItem
              onClick={handleManualCreation} // Ouvrir le Sheet pour créer un produit
              className="flex items-center gap-2 p-2"
            >
              <PenIcon className="h-4 w-4" />
              <span>Manuellement</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAIOptionChange(true)}
              className="flex items-center gap-2 p-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>via IA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* ProductGeneratorModal: Il s'affiche uniquement si 'isAI' est vrai */}
        {isAI && (
          <ProductGeneratorModal isAI={isAI} isOpen={isAI} setIsOpen={setIsAI} />
        )}
      </div>

      {/* Sheet pour créer un produit manuellement */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger />
        <SheetContent >
          <SheetHeader>
            <SheetTitle>Créer un produit</SheetTitle>
            <SheetDescription>Entrez les informations du produit.</SheetDescription>
          </SheetHeader>

          {/* Formulaire de création de produit */}
          <div className="space-y-4 p-4">
            <Input
              placeholder="Nom du produit"
              className="w-full"
            />
            <Input
              placeholder="Description du produit"
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Prix"
              className="w-full"
            />
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
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
            <div>
              <Input type="file" multiple placeholder="Ajouter des photos" className="w-full" />
            </div>
          </div>

          <div className="flex justify-between p-4">
          
            <Button className="w-full  bg-[#7f1d1c] hover:bg-[#7f1d1c] ">Créer un produit</Button>
          </div>
        </SheetContent>
      </Sheet>

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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
