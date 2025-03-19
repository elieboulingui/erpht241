import { useState, useEffect, useCallback, JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"; // Import du composant Sheet de ShadCN
import { deleteCategoryById } from "../action/deleteCategoryById";
import { updateCategoryById } from "../action/Update";
import { Input } from "@/components/ui/input"; // Corriger l'importation du composant Input
import { Button } from "@/components/ui/button"; // Corriger l'importation du composant Button
import { Label } from "@/components/ui/label"; // Corriger l'importation du composant Label
import Chargement from "@/components/Chargement";
 // Importer un composant spinner si nécessaire

// Définition de l'interface pour les catégories
interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
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
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State pour le Sheet
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null); // Catégorie sélectionnée pour mise à jour
  const [isLoading, setIsLoading] = useState(true); // State pour gérer l'état de chargement

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
      setIsLoading(true); // Début du chargement
      try {
        const response = await fetch(`/api/categorieofia?organisationId=${organisationId}`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
      } finally {
        setIsLoading(false); // Fin du chargement
      }
    };

    fetchCategories();
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
    (category: Category, depth = 0): JSX.Element => (
      <>
        <TableRow key={category.id}>
          <TableCell className={cn("p-4", depth > 0 && "pl-8")}>
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={() => toggleCategory(category.name)}
              className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
          </TableCell>
          <TableCell className={cn("p-4 text-sm font-medium text-gray-700", depth > 0 && "pl-8")}>
            {category.name}
          </TableCell>
          <TableCell className={cn("p-4 text-sm text-gray-500", depth > 0 && "pl-8")}>
            {category.description || "Pas de description"}
          </TableCell>
          <TableCell className={cn("p-4 text-sm text-gray-500", depth > 0 && "pl-8")}>
            {category.productCount}
          </TableCell>
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
        {category.children?.map((child) => renderCategory(child, depth + 1))}
      </>
    ),
    [selectedCategories, toggleCategory]
  );

  const handleUpdateCategory = (category: Category) => {
    setCategoryToUpdate(category); // Ouvrir le Sheet et passer la catégorie à modifier
    setIsSheetOpen(true);
  };

  const handleCategoryUpdate = async () => {
    if (categoryToUpdate) {
      const updatedData = {
        name: categoryToUpdate.name,
        description: categoryToUpdate.description || "", // Si description est undefined, utilisez une chaîne vide
        logo: null, // Vous pouvez mettre à jour le logo si nécessaire
      };
      
      await updateCategoryById(categoryToUpdate.id, updatedData);
      // Mise à jour de la catégorie

      // Mise à jour des catégories localement après modification
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === categoryToUpdate.id ? { ...cat, ...updatedData } : cat
        )
      );

      setIsSheetOpen(false); // Fermer le Sheet
      toast.success("Catégorie mise à jour avec succès");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategoryById(categoryId); // Appel de la fonction de suppression
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId)); // Mise à jour de l'état local
    toast.success("Catégorie supprimée avec succès");
  };

  return (
    <>
      <Table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sélectionner</TableHead>
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
                <Chargement /> {/* Affiche un indicateur de chargement */}
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => renderCategory(category))
          )}
        </TableBody>
      </Table>

      {/* Sheet pour mettre à jour la catégorie */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button className="hidden">Open</button>
        </SheetTrigger>
        <SheetContent>
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
              <Input
                id="category-description"
                type="text"
                value={categoryToUpdate.description || ""}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          <SheetFooter>
            <Button onClick={handleCategoryUpdate} className="px-4 py-2 bg-black hover:bg-black text-white ">
              Sauvegarder les modifications
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
