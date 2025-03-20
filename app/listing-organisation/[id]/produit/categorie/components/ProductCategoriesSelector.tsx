import { useState, useEffect, useCallback, JSX } from "react";
import { useRouter, useParams } from "next/navigation"; 
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { deleteCategoryById } from "../action/deleteCategoryById";
import { updateCategoryById } from "../action/Update";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Chargement from "@/components/Chargement";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Définition de l'interface pour les catégories
interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  parentId?: string | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [organisationId, setOrganisationId] = useState<string | null>(null);  // Changer la variable pour accepter null
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);

  const router = useRouter();  
  const { id } = useParams();  // Utilisation de useParams pour obtenir l'ID dynamique

  // Vérifiez si id est défini, sinon affectez null
  useEffect(() => {
    if (id) {
      setOrganisationId(id as any);  // Si id est défini, affectez-le directement
    } else {
      setOrganisationId(null);  // Si id est undefined, affectez null
    }
  }, [id]);

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

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const newSelectedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];

      setSelectedCategories(newSelectedCategories);
    },
    [selectedCategories, setSelectedCategories]
  );

  const renderCategory = useCallback(
    (category: Category, depth = 0, parentCategory: Category | null = null): JSX.Element => (
      <>
        <TableRow key={category.id}>
          <TableCell className="p-4">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => toggleCategory(category.id)}
            />
          </TableCell>

          <TableCell className="p-4 text-sm font-medium text-gray-700">
  {depth > 0 ? (
    <span className="flex items-center">
      {category.name}
      <span className="bg-[#2F4B34] text-white font-semibold px-1 py-0.5 rounded mx-1">
        Sous-catégories de {parentCategory?.name || "Inconnu"}
      </span>
    </span>
  ) : (
    <Link
      href={`/listing-organisation/${organisationId}/produit/categorie/${category.id}`}
      className="text-gray-700 hover:text-gray-900"
    >
      {category.name}
    </Link>
  )}
</TableCell>

          <TableCell className="p-4 text-sm text-gray-500">
            {category.description || "Pas de description"}
          </TableCell>

          <TableCell className="p-4 text-sm text-gray-500">
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

        {category.children?.map((child) =>
          renderCategory(child, depth + 1, category)
        )}
      </>
    ),
    [selectedCategories, toggleCategory, router, organisationId]
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
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => renderCategory(category, 0))
          )}
        </TableBody>
      </Table>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button className="hidden">Open</button>
        </SheetTrigger>
        <SheetContent
          style={{
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
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
              <textarea
                id="category-description"
                value={categoryToUpdate.description || ""}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, description: e.target.value })}
                rows={3}
                style={{ resize: 'none' }}
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
