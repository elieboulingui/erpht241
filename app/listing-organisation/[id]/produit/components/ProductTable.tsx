'use client';

import { useState, useEffect } from "react";
import { ArrowDownUp, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProductByOrganisationAndProductId } from "./actions/ItemUpdate";
import { Label } from "@/components/ui/label";
import PaginationGlobal from "@/components/paginationGlobal"; // Importez le composant de pagination
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import the Sheet components
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";

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
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [confirmName, setConfirmName] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of products per page

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
    setEditProduct(product);
    setMenuOpen(null);
  };

  const handleDeleteConfirm = (product: Product) => {
    setDeleteProduct(product);
    setConfirmName(product.name);
    setIsConfirmDeleteOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmDeleteOpen(false);
  };

  const handleDescriptionClick = (description: string) => {
    setCurrentDescription(description);
  };

  const closeDescriptionDialog = () => {
   
  };

  const openMenu = (productId: string) => {
    setMenuOpen(menuOpen === productId ? null : productId);
  };

  const handleProductUpdate = async () => {
    if (editProduct) {
      try {
        const updatedPrice = parseFloat(editProduct.price.toString());
        if (isNaN(updatedPrice)) {
          toast.error("Le prix doit être un nombre valide.");
          return;
        }

        const updatedProduct = await updateProductByOrganisationAndProductId(
          organisationId!,
          editProduct.id!,
          {
            name: editProduct.name,
            description: editProduct.description,
            price: updatedPrice,
            categories: editProduct.categories?.map((cat) => cat.id) || [],
            images: editProduct.images || [],
          }
        );

        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id
              ? { ...product, ...updatedProduct, price: updatedPrice }
              : product
          )
        );
        toast.success("Produit mis à jour avec succès.");
        setEditProduct(null);
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du produit.");
      }
    }
  };

  if (loading) return <Chargement />;
  if (error) return <div className="text-red-500">{error}</div>;

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

  return (
    <div className="z-10 overflow-hidden">
      <Table>
        <TableHeader className="bg-[#e6e7eb]">
          <TableRow>
            <TableHead className="w-[250px] text-left">Nom du Produit </TableHead>
            <TableHead className="w-[250px] text-left">Description</TableHead>
            <TableHead className="text-left">Catégorie</TableHead>
            <TableHead className="text-center">Prix</TableHead>
            <TableHead className="text-left w-[50px]">Images</TableHead>
            <TableHead className="w-[50px] text-center">Actions</TableHead>
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
                  onClick={() => handleDescriptionClick(product.description)}
                >
                  {truncateDescription(product.description)}
                </TableCell>
                <TableCell className="text-left text-sm">
                  {product.categories?.map((cat) => cat.name).join(", ")}
                </TableCell>
                <TableCell className="text-center text-sm">{product.price.toFixed(2)}€</TableCell>
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
                  <Button variant="outline" onClick={() => openMenu(product.id!)}>
                  <span className="material-icons">...</span>
                  </Button>

{menuOpen === product.id && (
  <Popover>
    <PopoverContent className="w-full">
      <button
        onClick={() => handleEditProduct(product)}
        className="text-left flex items-center px-4 py-2 text-black hover:bg-gray-100"
      >
        <span>Modifier</span>
      </button>
      <button
        onClick={() => handleDeleteConfirm(product)}
        className="text-left flex items-center px-4 py-2 text-black hover:bg-gray-100"
      >
        <span>Supprimer</span>
      </button>
    </PopoverContent>
  </Popover>
)}

                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(products?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={products?.length || 0}
      />
    </div>
  );
}
