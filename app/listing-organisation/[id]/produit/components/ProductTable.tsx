'use client';

import { useState, useEffect } from "react";
import { ArrowDownUp, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProductByOrganisationAndProductId } from "./actions/ItemUpdate";
import { Label } from "@/components/ui/label";
import PaginationGlobal from "@/components/paginationGlobal"; // Importez le composant de pagination
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  actions?: string | null;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  archivedAt: Date | null;
  archivedBy: string | null;
  categories?: { id: string; name: string; parentId?: string }[];
}

interface ProductsTableProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  category: string;
  categories: { id: string; name: string; parentId?: string }[];
}

function extractOrganisationId(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9\-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function ProductsTable({
  searchQuery,
  setSearchQuery,
  sortBy,
  category,
  categories,
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of products per page
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false); // state for edit sheet
  const [editedProduct, setEditedProduct] = useState<Product | null>(null); // state to hold edited product

  const organisationId = extractOrganisationId(window.location.href);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url =
        category && category !== "all"
          ? `/api/selectcategory?organisationId=${organisationId}&categoryName=${category}`
          : `/api/produict?organisationId=${organisationId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur lors de la récupération des produits.");

      const data = await response.json();

      setProducts(
        data.map((product: Product) => ({
          ...product,
          categories: Array.isArray(product.categories) ? product.categories : [],
        }))
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!organisationId) {
      setError("L'ID de l'organisation est introuvable dans l'URL.");
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [category, organisationId]);

  // Filtrage des produits en fonction de searchQuery
  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearchQuery;
  });

  const handleDeleteProduct = async () => {
    if (!deleteProduct || confirmName !== deleteProduct.name) return;

    try {
      await deleteProductByOrganisationAndProductId(organisationId!, deleteProduct.id!);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== deleteProduct.id));
      toast.success("Produit supprimé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit.");
    } finally {
      setDeleteProduct(null);
      setConfirmName("");
      setIsConfirmDeleteOpen(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditedProduct(product);
    setIsEditSheetOpen(true); // open the sheet
  };

 const handleUpdateProduct = async () => {
  if (!editedProduct) return;

  // Convertir les catégories en un tableau de chaînes de caractères
  const categoriesAsStrings = editedProduct.categories?.map((cat) => cat.name) || [];

  // Transformer `null` en `undefined` pour la propriété `actions`
  const actions = editedProduct.actions === null ? undefined : editedProduct.actions;

  // Créer l'objet ProductUpdateData avec les données adaptées
  const productUpdateData={
    ...editedProduct,
    categories: categoriesAsStrings, // On remplace les catégories par les noms sous forme de chaîne
    actions,  // On remplace `null` par `undefined` si nécessaire
  };

  try {
    await updateProductByOrganisationAndProductId(organisationId!, editedProduct.id!, productUpdateData);
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
    toast.success("Produit mis à jour avec succès.");
    setIsEditSheetOpen(false); // close the sheet
  } catch (error) {
    toast.error("Erreur lors de la mise à jour du produit.");
  }
};

  

  const handleDeleteConfirm = (product: Product) => {
    setDeleteProduct(product);
    setConfirmName(product.name);
    setIsConfirmDeleteOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmDeleteOpen(false);
  };

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  const truncateDescription = (description: string, maxWords: number = 3) => {
    const words = description.split(" ");
    if (words.length <= maxWords) {
      return description;
    }
    return words.slice(0, maxWords).join(" ") + "...";
  };

  if (loading) return <Chargement />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="z-10 overflow-hidden p-3">
      <Table>
      <TableHeader className="bg-gray-300">
  <TableRow>
    <TableHead className="w-[250px]">
      <div className="flex items-center">
        <span>Nom du Produit</span>
        <ArrowDownUp className="ml-1 text-gray-500" size={16} />
      </div>
    </TableHead>
    <TableHead className="w-[250px]">
      <div className="flex items-center">
        <span>Description</span>
        <ArrowDownUp className="ml-1 text-gray-500" size={16} />
      </div>
    </TableHead>
    <TableHead>
      <div className="flex items-center">
        <span>Catégorie</span>
        <ArrowDownUp className="ml-1 text-gray-500" size={16} />
      </div>
    </TableHead>
    <TableHead className="text-center">
      <div className="flex items-center justify-center">
        <span>Prix</span>
        <ArrowDownUp className="ml-1 text-gray-500" size={16} />
      </div>
    </TableHead>
    <TableHead className="text-left w-[50px]">
      <div className="flex items-center">
        <span>Images</span>
        <ArrowDownUp className="ml-1 text-gray-500" size={16} />
      </div>
    </TableHead>
    <TableHead className="w-[50px] text-center">
      <div className="flex items-center justify-center">
        <span>Actions</span>
        <ArrowDownUp className="ml-1 text-gray-500" size={16} />
      </div>
    </TableHead>
  </TableRow>
</TableHeader>

        <TableBody>
          {paginatedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map((product) => (
              <TableRow key={product.id} className="py-2">
                <TableCell className="font-medium text-left text-sm">{product.name}</TableCell>
                <TableCell
                  className="text-sm text-muted-foreground text-left cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() => setCurrentDescription(product.description)}
                >
                  {truncateDescription(product.description)}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {product.categories?.map((cat) => cat.name).join(", ")}
                </TableCell>
                <TableCell className="text-center text-sm">{product.price.toFixed(2)}xfa</TableCell>
                <TableCell className="text-left text-sm">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt="Product"
                      className="w-20 h-20 object-cover"
                    />
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" >
                        <span className="material-icons">...</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-white shadow-lg rounded-lg">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-left px-4 py-2 text-black hover:bg-gray-100 w-full"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(product)}
                        className="text-left px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                      >
                        Supprimer
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />

      {/* ShadCN Sheet to edit product */}
      {isEditSheetOpen && editedProduct && (
        <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Modifier le produit</SheetTitle>
            </SheetHeader>
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedProduct.description}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                value={editedProduct.price}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="mt-4">
              <Label>Images</Label>
              {editedProduct.images?.map((image, index) => (
                <div key={index} className="flex items-center">
                  <img src={image} alt="product" className="w-10 h-10 object-cover mr-2" />
                  <Button  className="bg-[#7f1d1c] flex items-center w-full hover:bg-[#7f1d1c]"
                    onClick={() => {
                      const newImages = [...(editedProduct.images || [])];
                      newImages.splice(index, 1);
                      setEditedProduct({ ...editedProduct, images: newImages });
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>

            <SheetFooter>
             
              <Button className="bg-[#7f1d1c] flex items-center w-full hover:bg-[#7f1d1c]" onClick={handleUpdateProduct}>Sauvegarder</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
