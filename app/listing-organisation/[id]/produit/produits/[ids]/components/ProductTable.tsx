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
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";

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

function extractCategoryId(url: string): string | null {
  const regex = /\/produit\/produits\/([a-zA-Z0-9\-]+)/;
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

  const [organisationId, setOrganisationId] = useState<string | null>(null);

  useEffect(() => {
    const categoryId = extractCategoryId(window.location.href);
    
    if (!categoryId) {
      setError("L'ID de la catégorie est introuvable dans l'URL.");
      setLoading(false);
      return;
    }

    setOrganisationId(categoryId);
    fetchProducts(categoryId);
  }, [category]);

  const fetchProducts = async (categoryId: string) => {
    setLoading(true);
    try {
      const url = `/api/filter?id=${categoryId}`;  // Correct usage of categoryId
      const response = await fetch(url);
      
      // Log the response status and URL for debugging
      console.log('Response Status:', response.status);
      console.log('Response URL:', url);
  
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des produits. Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Log the raw data to see what is returned
      console.log('Fetched data:', data);
  
      if (Array.isArray(data)) {
        setProducts(
          data.map((product: Product) => ({
            ...product,
            categories: Array.isArray(product.categories) ? product.categories : [],
          }))
        );
      } else {
        throw new Error('Les données récupérées ne sont pas un tableau.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

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

  const handleProductUpdate = async () => {
    if (editedProduct) {
      try {
        const updatedPrice = parseFloat(editedProduct.price.toString());
        if (isNaN(updatedPrice)) {
          toast.error("Le prix doit être un nombre valide.");
          return;
        }

        const updatedProduct = await updateProductByOrganisationAndProductId(
          organisationId!,
          editedProduct.id!,
          {
            name: editedProduct.name,
            description: editedProduct.description,
            price: updatedPrice,
            categories: editedProduct.categories?.map((cat) => cat.id) || [],
            images: editedProduct.images || [],
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
        setEditedProduct(null);
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du produit.");
      }
    }
  };

  const handleImageClick = (image: string) => {
    setZoomedImage(image);
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
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{truncateDescription(product.description)}</TableCell>
              <TableCell>
                {product.categories?.map((category) => category.name).join(", ")}
              </TableCell>
              <TableCell className="text-center">{product.price.toFixed(2)} xfa</TableCell>
              <TableCell className="text-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt="Produit"
                    className="h-10 w-10 object-cover rounded-md"
                  />
                ) : (
                  <span>Pas d'images</span>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[35px] h-[35px] p-0">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150px] p-2">
                    <Button
                      className="w-full bg-white hover:bg-white text-black "
                      onClick={() => handleEditProduct(product)}
                    >
                      Modifier
                    </Button>
                    <Button
                      className="w-full bg-white hover:bg-white text-black "
                      onClick={() => handleDeleteConfirm(product)}
                    >
                      Supprimer
                    </Button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(products?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={products?.length || 0}
      />

      {/* Dialog for editing a product */}
      {isEditSheetOpen && editedProduct && (
        <Sheet open={isEditSheetOpen} onOpenChange={(open) => { if (!open) setEditedProduct(null); }}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Modifier le produit</SheetTitle>
            </SheetHeader>
            <div className="mb-4">
              <Label htmlFor="productName">Nom</Label>
              <Input
                id="productName"
                value={editedProduct?.name || ""}
                onChange={(e) => setEditedProduct({ ...editedProduct!, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="productDescription">Description</Label>
              <Textarea
                id="productDescription"
                value={editedProduct?.description || ""}
                onChange={(e) => setEditedProduct({ ...editedProduct!, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="productPrice">Prix</Label>
              <Input
                id="productPrice"
                type="number"
                value={editedProduct?.price || ""}
                onChange={(e) => setEditedProduct({ ...editedProduct!, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mb-4">
              <div className="mt-2 flex gap-2">
                {(editedProduct?.images || []).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Produit ${index}`}
                      className="w-12 h-12 rounded-md object-cover"
                      onClick={() => handleImageClick(image)}
                    />
                    <button
                      onClick={() => {
                        setEditedProduct({
                          ...editedProduct!,
                          images: editedProduct?.images?.filter((img) => img !== image) || [],
                        });
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <SheetFooter>
              <Button className="w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]" onClick={handleProductUpdate}>Mettre à jour</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
