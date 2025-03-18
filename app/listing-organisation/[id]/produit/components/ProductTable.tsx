"use client"
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ProductGeneratorModalupade } from "./update";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@/components/ui/visuallyHidden";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
  images?: string[];
  categories?: { id: string; name: string; parentId?: string }[];
}

function extractOrganisationId(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9\-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

interface ProductsTableProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  category: string;
  categories: { id: string; name: string; parentId?: string }[];
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
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false); // état pour la popup

  const [selectedProductDescription, setSelectedProductDescription] = useState<string | null>(null); // pour stocker la description à afficher

  const [zoomedImage, setZoomedImage] = useState<string | null>(null); // état pour l'image zoomée

  const organisationId = extractOrganisationId(window.location.href);

  useEffect(() => {
    if (!organisationId) {
      setError("L'ID de l'organisation est introuvable dans l'URL.");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = category && category !== "all"
          ? `/api/selectcategory?organisationId=${organisationId}&categoryName=${category}`
          : `/api/produict?organisationId=${organisationId}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur lors de la récupération des produits.`);

        const data = await response.json();
        setProducts(data.map((product: Product) => ({
          ...product,
          categories: Array.isArray(product.categories) ? product.categories : [],
        })));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

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
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    localStorage.setItem("selectedProductId", updatedProduct.id || "");
    localStorage.setItem("selectedProductName", updatedProduct.name);

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditProduct(null);
  };

  const handleDescriptionClick = (description: string) => {
    setSelectedProductDescription(description); // Sauvegarde la description du produit dans l'état
    setOpenDescriptionDialog(true); // Ouvre la popup
  };

  const handleImageClick = (image: string) => {
    setZoomedImage(image); // Sauvegarde l'image sélectionnée pour le zoom
  };

  const closeZoom = () => {
    setZoomedImage(null); // Ferme le zoom
  };

  if (loading) return <Chargement />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="z-10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nom du Produit</TableHead>
              <TableHead className="w-[250px]">Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="top-0">
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-left align-top">{product.name}</TableCell>
                  <TableCell
                    className="text-sm text-muted-foreground text-left cursor-pointer align-top"
                    onClick={() => handleDescriptionClick(product.description)}
                    style={{
                      display: 'block',
                      overflow: 'hidden',
                      WebkitLineClamp: 2,
                      textOverflow: 'ellipsis',
                      lineHeight: '1.5rem',
                      maxHeight: '3rem',
                    }}
                  >
                    {product.description}
                  </TableCell>
                  <TableCell className="text-left align-top">
                    {product.categories && product.categories.length > 0
                      ? product.categories.map((category) => <div key={category.id}>{category.name}</div>)
                      : <span className="text-muted-foreground">Aucune catégorie</span>}
                  </TableCell>
                  <TableCell className="text-right align-top">
                    {parseFloat(product.price).toFixed(2)} XFA
                  </TableCell>
                  <TableCell className="text-left align-top">
                    <div className="flex gap-2 overflow-x-auto w-[100px] h-[100px] scrollbar-hide">
                      {(product.images || []).map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover cursor-pointer"
                          onClick={() => handleImageClick(image)} // Ajoute le gestionnaire de clic pour l'image
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center relative align-top">
                    <Button
                      variant="link"
                      onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id || null)}
                      className="text-gray-500"
                    >
                      <MoreHorizontal size={20} />
                    </Button>
                    {menuOpen === product.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg">
                        <button onClick={() => setEditProduct(product)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                          Éditer
                        </button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button onClick={() => setDeleteProduct(product)} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200">
                              Supprimer
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <VisuallyHidden>
                              <DialogTitle>Confirmer la suppression</DialogTitle>
                            </VisuallyHidden>
                            <p className="text-sm text-muted-foreground">Tapez le nom du produit pour confirmer :</p>
                            <Input
                              value={confirmName}
                              onChange={(e) => setConfirmName(e.target.value)}
                              className="mt-2"
                            />
                            <Button
                              onClick={handleDeleteProduct}
                              disabled={confirmName !== deleteProduct?.name}
                              className="mt-4 w-full"
                            >
                              Supprimer
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Zoom de l'image */}
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
    </div>
  );
}
