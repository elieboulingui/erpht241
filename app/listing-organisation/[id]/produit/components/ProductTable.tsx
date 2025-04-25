import { useState, useEffect } from "react";
import { ArrowDownUp, MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import Chargement from "@/components/Chargement";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProductByOrganisationAndProductId } from "../actions/ItemUpdate";
import { Label } from "@/components/ui/label";
import PaginationGlobal from "@/components/paginationGlobal";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import Link from "next/link";
import { deleteProductByOrganisationAndProductId } from "../actions/DeleteItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CommonTable } from "@/components/CommonTable";

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
  setSearchQuery: (query: string) => void;
  sortBy: string;
  category: string;
  categories: { id: string; name: string }[];
  onProductCreated?: () => void;
  productAdded: boolean;
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
  onProductCreated,
  productAdded,
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const organisationId = extractOrganisationId(window.location.href);

  const fetchProducts = async () => {
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
    setLoading(true);

    if (productAdded) {
      setLoading(true);
      fetchProducts();
    } else {
      fetchProducts();
    }
  }, [category, organisationId, productAdded]);

  const getShortDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 4) {
      return words.slice(0, 4).join(" ") + "...";
    }
    return description;
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductByOrganisationAndProductId(organisationId!, productToDelete.id!);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productToDelete.id));
      toast.success("Produit supprimé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit.");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditedProduct(product);
    setIsEditSheetOpen(true);
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
        setIsEditSheetOpen(false);
        if (onProductCreated) {
          onProductCreated();
        }
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du produit.");
      }
    }
  };

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <Chargement />;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const tableHeaders = [
    { key: "name", label: "Nom du Produit", width: "250px", sortable: true },
    { key: "description", label: "Description", width: "250px", sortable: true },
    { key: "categories", label: "Catégorie", sortable: true },
    { key: "price", label: "Prix", sortable: true },
    { key: "images", label: "Images", align: "left" as const, width: "50px", sortable: true },
    { key: "actions", label: <SlidersHorizontal className="h-4 w-4  "/>, align: "center" as const },
  ];

  const tableRows = currentProducts.map((product) => ({
    id: product.id || '',
    name: (
      <Link
        href={`/listing-organisation/${organisationId}/produit/produits/${product.id}`}
        className="hover:underline"
      >
        {product.name}
      </Link>
    ),
    description: getShortDescription(product.description),
    categories: product.categories?.map((category) => category.name).join(", "),
    price: `${product.price.toFixed(2)} xfa`,
    images: product.images && product.images.length > 0 ? (
      <img
        src={product.images[0]}
        alt="Produit"
        className="h-10 w-10 object-cover rounded-md"
      />
    ) : (
      <span>Pas d'images</span>
    ),
    actions: (
      <div className="gap-2">
        <Popover>
          <PopoverTrigger asChild className="border-none">
            <Button variant="outline" className="w-[35px] h-[35px] p-0">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-2">
            <div className="bg-white">
              <Button
                className="w-full bg-white hover:bg-white text-black"
                onClick={() => handleEditProduct(product)}
              >
                Modifier
              </Button>
              <Button
                className="w-full mt-2 bg-white hover:bg-white text-black"
                onClick={() => openDeleteDialog(product)}
              >
                Supprimer
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  }));

  return (
    <div className="z-10 overflow-hidden p-3">
      <CommonTable
        headers={tableHeaders}
        rows={tableRows}
        emptyState="Aucun produit disponible"
        headerClassName="bg-gray-300"
        onSort={(key) => console.log(`Sort by ${key}`)} // Implement your sort logic here
      />

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(products?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={products?.length || 0}
      />

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier le produit</SheetTitle>
            <SheetDescription>
              Modifiez les informations du produit.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input
                id="name"
                value={editedProduct?.name || ""}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct!, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedProduct?.description || ""}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct!, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                type="number"
                value={editedProduct?.price || ""}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct!, price: parseFloat(e.target.value) })
                }
              />
            </div>
          </div>

          <SheetFooter className="mt-4">
            <Button className="w-full bg-red-600 text-white hover:bg-red-700" onClick={handleProductUpdate}>
              Mettre à jour
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white" onClick={handleDeleteProduct}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
