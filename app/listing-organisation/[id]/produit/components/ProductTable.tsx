import { useState, useEffect } from "react";
import { ArrowDownUp, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems"; // Make sure this function works
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProductByOrganisationAndProductId } from "./actions/ItemUpdate";
import { Label } from "@/components/ui/label";
import PaginationGlobal from "@/components/paginationGlobal";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from 'next/navigation'; 

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
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false); 
  const [editedProduct, setEditedProduct] = useState<Product | null>(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(10); 
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rowsPerPage

  const organisationId = extractOrganisationId(window.location.href);

  useEffect(() => {
    setLoading(true);
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
    fetchProducts();
  }, [category, organisationId]);

  // Function to display only the first 4 words of the description
  const getShortDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 4) {
      return words.slice(0, 4).join(" ") + "..."; // Shows the first 4 words followed by ellipsis
    }
    return description;
  };

  // Function to handle deleting a product
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductByOrganisationAndProductId(organisationId!, productId);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      toast.success("Produit supprimé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit.");
    }
  };

  // Handle editing product
  const handleEditProduct = (product: Product) => {
    setEditedProduct(product);
    setIsEditSheetOpen(true); // Open the edit sheet
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
      } catch (error) {
        toast.error("Erreur lors de la mise à jour du produit.");
      }
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <TableBody className="cursor-pointer">
          {currentProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{getShortDescription(product.description)}</TableCell>
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
                    <div className="bg-white">
                    <Button
                      className="w-full bg-white hover:bg-white text-black"
                      onClick={() => handleEditProduct(product)} 
                    >
                      Modifier
                    </Button>
                    <Button
                      className="w-full mt-2 w-full bg-white hover:bg-white text-black"
                      onClick={() => handleDeleteProduct(product.id!)} // Call delete function
                    >
                      Supprimer
                    </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
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

      {/* Sheet for editing */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier le produit</SheetTitle>
            <SheetDescription>
              Modifiez les informations du produit.
            </SheetDescription>
          </SheetHeader>
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

          <SheetFooter>
            <Button className=" w-full bg-red-600 text-white hover:bg-red-700" onClick={handleProductUpdate}>Mettre à jour</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
