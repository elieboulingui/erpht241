"use client";
import { useState, useCallback, JSX, useEffect } from "react";
import useSWR from "swr";  // Import SWR
import { useRouter, useParams } from "next/navigation";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
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
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import PaginationGlobal from "@/components/paginationGlobal"; // Import Pagination Component

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProductCategoriesSelector({
  selectedCategories,
  setSelectedCategories,
}: ProductCategoriesSelectorProps) {
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [currentPage, setCurrentPage] = useState(1);  // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Default rows per page

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setOrganisationId(id as string);
    } else {
      setOrganisationId(null);
    }
  }, [id]);

  // SWR hook to fetch categories
  const { data: categories, error: categoriesError } = useSWR(
    organisationId ? `/api/categorieofia?organisationId=${organisationId}` : null,
    fetcher
  );

  // SWR hook to fetch products
  const { data: products, error: productsError } = useSWR(
    organisationId ? `/api/produict?organisationId=${organisationId}` : null,
    fetcher
  );

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const newSelectedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];

      setSelectedCategories(newSelectedCategories);
    },
    [selectedCategories, setSelectedCategories]
  );

  const countProductsInCategories = (categories: Category[], products: any[]) => {
    return categories.map((category) => {
      const productCount = products.filter((product: { categories: { id: string }[] }) =>
        product.categories.some((cat) => cat.id === category.id)
      ).length;
      return { ...category, productCount };
    });
  };

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
                <span className="bg-[#7f1d1c] text-white font-semibold px-1 py-0.5 rounded mx-1">
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
            {category.productCount} {/* Display product count here */}
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
                <DropdownMenuItem onClick={() => handleDeleteCategoryConfirmation(category)}>
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

      setIsSheetOpen(false);
      toast.success("Catégorie mise à jour avec succès");
    }
  };

  const handleDeleteCategoryConfirmation = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategoryById(categoryToDelete.id);
      toast.success("Catégorie supprimée avec succès");
      setIsDeleteDialogOpen(false);
    }
  };

  const loading = !categories || !products;
  const error = categoriesError || productsError;

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCategories = categories?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <Table className="w-full border-t border-b border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <TableCaption></TableCaption>
        <TableHeader className="bg-gray-300 text-white">
          <TableRow>
            <TableHead>Sélectionner</TableHead>
            <TableHead>Nom de la catégorie</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Nombre de produits</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                <Chargement />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Une erreur s'est produite lors du chargement des données.
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            countProductsInCategories(paginatedCategories, products).map((category) => renderCategory(category, 0))
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <PaginationGlobal
  currentPage={currentPage}
  totalPages={Math.ceil(categories?.length / rowsPerPage) || 1} // Calculate total pages
  rowsPerPage={rowsPerPage}
  setCurrentPage={setCurrentPage}
  setRowsPerPage={setRowsPerPage}
  totalItems={categories?.length || 0}
/>


      {/* Sheet and Dialog for category updates and deletions */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger>
          <Button>Ouvrir la feuille</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier la catégorie</SheetTitle>
            <SheetDescription>
              Modifiez les informations de la catégorie sélectionnée.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Nom</Label>
            <Input
              id="category-name"
              value={categoryToUpdate?.name || ""}
              onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate!, name: e.target.value })}
            />
            <Label htmlFor="category-description">Description</Label>
            <Input
              id="category-description"
              value={categoryToUpdate?.description || ""}
              onChange={(e) =>
                setCategoryToUpdate({ ...categoryToUpdate!, description: e.target.value })
              }
            />
            <Button onClick={handleCategoryUpdate}>Mettre à jour</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTitle>Confirmation de la suppression</DialogTitle>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer cette catégorie ?
        </DialogDescription>
        <DialogContent>
          <Button onClick={handleDeleteCategory}>Supprimer</Button>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

