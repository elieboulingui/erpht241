"use client";
import { useState, useEffect, useCallback, JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { deleteCategoryById } from "../action/deleteCategoryById";
import { updateCategoryById } from "../action/Update";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Chargement from "@/components/Chargement";

// Définition de l'interface pour les catégories
interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  parentId?: string | null;  // Référence à l'ID de la catégorie parente
  children?: Category[];
}

interface ProductCategoriesSelectorProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

export function ProductCategoriesSelector({
  selectedCategories,
  setSelectedCategories,
}: ProductCategoriesSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = window.location.href;
    const id = url.match(/\/listing-organisation\/([a-zA-Z0-9_-]+)\/produit/);
    if (id) {
      setOrganisationId(id[1]);
    } else {
      console.error("ID de l'organisation non trouvé dans l'URL");
    }
  }, []);

  useEffect(() => {
    if (!organisationId) return;

    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categorieofia?organisationId=${organisationId}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [organisationId]);

  // Fonction pour rafraîchir les catégories de manière périodique
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (organisationId) {
        try {
          const response = await fetch(`/api/categorieofia?organisationId=${organisationId}`);
          const data = await response.json();
          setCategories(data);  // Mise à jour des catégories
        } catch (error) {
          console.error("Erreur lors de la récupération périodique des catégories:", error);
        }
      }
    }, 30000); // Vérifie toutes les 30 secondes

    return () => clearInterval(intervalId); // Nettoyage de l'intervalle lorsque le composant est démonté
  }, [organisationId]);

  const toggleCategory = useCallback(
    (categoryName: string) => {
      const newSelectedCategories = selectedCategories.includes(categoryName)
        ? selectedCategories.filter((name) => name !== categoryName)
        : [...selectedCategories, categoryName];

      setSelectedCategories(newSelectedCategories);
    },
    [selectedCategories, setSelectedCategories]
  );

  const renderCategory = useCallback(
    (category: Category, depth = 0, parentCategory: Category | null = null): JSX.Element => (
      <>
        <TableRow key={category.id}>
          {/* Checkbox column */}
          <TableCell className={cn("p-4", depth > 0 ? "pl-8" : "")}>
            {/* Checkbox for the parent category stays in the same position */}
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={() => toggleCategory(category.name)}
              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
          </TableCell>

          {/* Category Name column */}
          <TableCell
            className={cn(
              "p-4 text-sm font-medium text-gray-700",
              depth > 0 && "pl-8", // Add padding left to subcategories
              depth === 0 ? "text-[16px]" : "text-[12px]" // Larger text for parent, smaller for child
            )}
          >
            {depth > 0 ? (
              <span className="flex items-center  text-nowrap">
                {/* Display subcategory name first */}
                {category.name}
                {/* Display "Sous-catégories de" in green */}
                <span className="bg-[#2F4B34] text-white font-semibold px-1 py-0.5 rounded mx-1">
                  Sous-catégories de  {parentCategory?.name || "Inconnu"}
                </span>
              </span>
            ) : (
              <div>{category.name}</div>
            )}
          </TableCell>

          {/* Category description column */}
          <TableCell className={cn("p-4 text-sm text-gray-500", depth > 0 ? "pl-8" : "")}>
            {category.description || "Pas de description"}
          </TableCell>

          {/* Product count column */}
          <TableCell className={cn("p-4 text-sm  text-gray-500", depth > 0 ? "pl-8" : "")}>
            {category.productCount}
          </TableCell>

          {/* Dropdown for actions */}
          <TableCell className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-600 hover:text-gray-800">
                  <span className="material-icons">...</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleUpdateCategory(category)}>
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>

        {/* Render child categories recursively */}
        {category.children?.map((child) =>
          renderCategory(child, depth + 1, category) // Pass the parent category to the child
        )}
      </>
    ),
    [selectedCategories, toggleCategory]
  );

  const handleUpdateCategory = (category: Category) => {
    setCategoryToUpdate(category);
    setIsSheetOpen(true);
  };

  const handleCategoryUpdate = async () => {
    if (categoryToUpdate) {
      const updatedData = {
        name: categoryToUpdate.name,
        description: categoryToUpdate.description || "",
        logo: null,
      };

      await updateCategoryById(categoryToUpdate.id, updatedData);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === categoryToUpdate.id ? { ...cat, ...updatedData } : cat
        )
      );

      setIsSheetOpen(false);
      toast.success("Catégorie mise à jour avec succès");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategoryById(categoryId);
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
    toast.success("Catégorie supprimée avec succès");
  };

  return (
    <>
      <Table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sélectionner</TableHead>
            <TableHead>Nom de la catégorie</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Nombre de produits</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                <Chargement />
              </TableCell>
            </TableRow>
          ) : Array.isArray(categories) && categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            (Array.isArray(categories) ? categories : []).map((category) =>
              renderCategory(category, 0)
            )
          )}
        </TableBody>
      </Table>

      {/* Sheet pour mettre à jour la catégorie */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button className="hidden">Open</button>
        </SheetTrigger>
        <SheetContent
          style={{
            overflowY: 'scroll',  // Allow vertical scrolling
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // Internet Explorer
            WebkitOverflowScrolling: 'touch', // Smooth scrolling for mobile
          }}
        >
          <SheetHeader>
            <SheetTitle>Modifier la catégorie</SheetTitle>
            <SheetDescription>Modifiez les informations de cette catégorie.</SheetDescription>
          </SheetHeader>

          {categoryToUpdate && (
            <div className="p-4">
              <Label htmlFor="category-name">Nom:</Label>
              <Input
                id="category-name"
                type="text"
                value={categoryToUpdate.name}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Label htmlFor="category-description" className="mt-4">
                Description:
              </Label>
              {/* Textarea with 3 lines limit and no resize */}
              <textarea
                id="category-description"
                value={categoryToUpdate.description || ""}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, description: e.target.value })}
                rows={3} // Limit to 3 lines
                style={{ resize: 'none' }} // Disable resizing
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Button onClick={handleCategoryUpdate} className="mt-4 w-full bg-black hover:bg-black">
                Mettre à jour
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
