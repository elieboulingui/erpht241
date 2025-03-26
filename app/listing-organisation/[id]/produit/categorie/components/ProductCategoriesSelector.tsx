import { useState, useCallback, JSX, useEffect } from "react";
import useSWR from "swr";
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
import { DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import PaginationGlobal from "@/components/paginationGlobal"; // Import PaginationGlobal
import { CheckSquare, Edit, Trash2, FileText, ArrowDownUp } from "lucide-react";  // Import icons
import { UploadButton } from "@/utils/uploadthing";
 // Import the UploadButton

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  parentId?: string | null;
  children?: Category[];
  logo?: string;  // Add logo field to the category
}

interface ProductCategoriesSelectorProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  searchTerm: string; // Ajout de searchTerm pour filtrer les catégories
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProductCategoriesSelector({
  selectedCategories,
  setSelectedCategories,
  searchTerm, // Récupère le searchTerm
}: ProductCategoriesSelectorProps) {
  // State hooks
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setOrganisationId(id as string);
    } else {
      setOrganisationId(null);
    }
  }, [id]);

  // Fetching data with SWR
  const { data: categories, error: categoriesError } = useSWR(
    organisationId ? `/api/categorieofia?organisationId=${organisationId}` : null,
    fetcher
  );

  const { data: products, error: productsError } = useSWR(
    organisationId ? `/api/produict?organisationId=${organisationId}` : null,
    fetcher
  );

  // Toggle selected categories
  const toggleCategory = useCallback(
    (categoryId: string) => {
      const newSelectedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];
      setSelectedCategories(newSelectedCategories);
    },
    [selectedCategories, setSelectedCategories]
  );

  // Count products in each category
  const countProductsInCategories = (categories: Category[], products: any[]) => {
    return categories.map((category) => {
      const productCount = products.filter((product: { categories: { id: string }[] }) =>
        product.categories.some((cat) => cat.id === category.id)
      ).length;
      return { ...category, productCount };
    });
  };

  // Filter categories based on the search term
  const filteredCategories = categories?.filter((category: { name: string; description: string; }) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchLower) ||
      (category.description && category.description.toLowerCase().includes(searchLower))
    );
  });

  // Render categories (with children if any)
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
                  <Edit className="mr-2" size={16} /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategoryConfirmation(category)}>
                  <Trash2 className="mr-2" size={16} /> Supprimer
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

  // Handle updating category
  const handleUpdateCategory = (category: Category) => {
    setCategoryToUpdate(category);
    setIsSheetOpen(true);
  };
  const handleCategoryUpdate = async () => {
    if (categoryToUpdate) {
      // Ensure name, description, and logo are properly handled
      const updatedData: { name: string; description: string; logo: string | null } = {
        name: categoryToUpdate.name || "", // If name is undefined, assign an empty string
        description: categoryToUpdate.description || "", // If description is undefined, assign an empty string
        logo: categoryToUpdate.logo || null, // If logo is undefined, assign null
      };
  
      await updateCategoryById(categoryToUpdate.id, updatedData);
      setIsSheetOpen(false);
      toast.success("Catégorie mise à jour avec succès");
    }
  };
  
  // When updating the category state with the logo:
  const handleLogoUpdate = (res: any[]) => {
    setCategoryToUpdate((prev) => {
      if (prev) {
        return { ...prev, logo: res[0].ufsUrl };
      }
      return prev;
    });
  };

  // Handle deleting category
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

  // Loading and error states
  const loading = !categories || !products;
  const error = categoriesError || productsError;

  // Check if categories is an array before using slice
  const isCategoriesValid = Array.isArray(categories);

  // Pagination logic
  const totalItems = isCategoriesValid ? filteredCategories?.length || 0 : 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  // Safely slice categories if valid
  const paginatedCategories = isCategoriesValid
    ? countProductsInCategories(filteredCategories?.slice(startIndex, startIndex + rowsPerPage) || [], products)
    : [];

  return (
    <>
      <Table className="w-full border-t border-b border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <TableCaption></TableCaption>
        <TableHeader className="bg-gray-300 text-white">
          <TableRow>
            <TableHead>
              <div className="flex items-center">
                Sélectionner
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Nom de la catégorie
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Description
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Nombre de produits
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
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
          ) : !isCategoriesValid || categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            paginatedCategories.map((category) => renderCategory(category, 0))
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems || 0}
      />

      {/* Sheet to Update Category */}
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
              <textarea
                id="category-description"
                value={categoryToUpdate.description || ""}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, description: e.target.value })}
                rows={3}
                style={{ resize: 'none' }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Label htmlFor="category-logo" className="mt-4">
                Logo de la catégorie:
              </Label>
              {/* Add Upload Button */}
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-[#7f1d1c]  text-white ut-button:ut-readying:bg-[#7f1d1c]"
                onClientUploadComplete={handleLogoUpdate}
                onUploadError={(error) => {
                  toast.error(`Erreur de téléchargement : ${error.message}`);
                }}
              />
              {/* Display the uploaded logo */}
              {categoryToUpdate.logo && (
                <div className="mt-4">
                  <img src={categoryToUpdate.logo} alt="Logo" className="w-32 h-32 object-cover" />
                </div>
              )}
              <Button onClick={handleCategoryUpdate} className="mt-4 w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]">
                Mettre à jour
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <button className="hidden">Open</button>
        </DialogTrigger>
        <DialogContent className="fixed inset-0 flex justify-center items-center bg-black/30">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <DialogTitle>Confirmation de suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie <strong>{categoryToDelete?.name}</strong> ? Cette action est irréversible.
            </DialogDescription>
            <div className="mt-4">
              <Button
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={handleDeleteCategory}
              >
                Supprimer
              </Button>
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
