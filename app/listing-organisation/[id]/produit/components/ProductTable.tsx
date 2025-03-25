import { useState, useEffect } from "react";
import { ArrowDownUp } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProductByOrganisationAndProductId } from "./actions/ItemUpdate";
import { Label } from "@/components/ui/label";
import PaginationGlobal from "@/components/paginationGlobal"; // Importez le composant de pagination

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
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
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
    setIsDescriptionDialogOpen(true);
  };

  const closeDescriptionDialog = () => {
    setIsDescriptionDialogOpen(false);
  };

  const handleImageClick = (image: string) => {
    setZoomedImage(image);
  };

  const closeZoom = () => {
    setZoomedImage(null);
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
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + rowsPerPage);

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
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-left">{product.name}</TableCell>
                <TableCell
                  className="text-sm text-muted-foreground text-left cursor-pointer whitespace-nowrap overflow-hidden"
                  onClick={() => handleDescriptionClick(product.description)}
                >
                  {truncateDescription(product.description)}
                </TableCell>
                <TableCell className="text-left">
                  {product.categories?.map((cat) => cat.name).join(", ")}
                </TableCell>
                <TableCell className="text-center">{product.price} xfa</TableCell>
                <TableCell className="text-left pl-8">
                  <div className="flex justify-center items-center w-[100px] h-[100px]">
                    {(product.images?.length ?? 0) > 0 ? (
                      <img
                        key={0}
                        src={product.images![0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover cursor-pointer"
                        onClick={() => handleImageClick(product.images![0]!)}
                      />
                    ) : (
                      <span className="text-muted-foreground">Pas d'image</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center relative">
                  <Button variant="link" onClick={() => openMenu(product.id!)} className="text-gray-500">
                    <MoreHorizontal size={20} />
                  </Button>
                  {menuOpen === product.id && (
                    <div className="bg-white shadow-md p-2 rounded-md mt-2 w-[150px]">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(product)}
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />

      {/* Dialog pour la description du produit */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={closeDescriptionDialog}>
        <DialogContent>
          <DialogTitle>Description complète</DialogTitle>
          {currentDescription && (
            <div className="whitespace-pre-line">{currentDescription}</div>
          )}
          <Button onClick={closeDescriptionDialog} className="mt-4 w-full bg-black hover:bg-black">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

      {/* Zoom sur l'image */}
      <Dialog open={zoomedImage !== null} onOpenChange={() => setZoomedImage(null)}>
        <DialogContent>
          <DialogTitle>Zoom de l'image</DialogTitle>
          {zoomedImage && (
            <div className="flex justify-center">
              <img
                src={zoomedImage}
                alt="Image zoomée"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          )}
          <Button onClick={closeZoom} className="mt-4 w-full bg-black hover:bg-black">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
