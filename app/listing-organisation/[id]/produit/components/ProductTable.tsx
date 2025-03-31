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
import { useRouter } from 'next/navigation'; // Utiliser le useRouter de next/navigation

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

  const [mounted, setMounted] = useState(false); // état pour vérifier si le composant est monté côté client

  useEffect(() => {
    setMounted(true); // Lorsque le composant est monté, mettez à jour l'état `mounted`
  }, []);

  const router = useRouter(); // Initialiser useRouter après le montage

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

  const handleProductClick = (productId: string) => {
    if (mounted) { // Ne pas utiliser `router.push` tant que le composant n'est pas monté
      router.push(`/listing-organisation/${organisationId}/produit/${productId}`); // Rediriger vers la page de détails du produit http://localhost:3000/listing-organisation/cm8hfcl4x004kx6lc6ahdwloc/produit
    }
  };

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage);

  const truncateDescription = (description: string, maxWords: number = 3) => {
    const words = description.split(" ");
    return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}...` : description;
  };

  if (loading) {
    return <Chargement />;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
            <TableRow key={product.id} onClick={() => handleProductClick(product.id!)}>
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
    </div>
  );
}
