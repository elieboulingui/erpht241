"use client"
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
  const [selectedProductDescription, setSelectedProductDescription] = useState<string | null>(null); // état pour la description sélectionnée
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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

  const handleDescriptionClick = (description: string) => {
    setSelectedProductDescription(description); // Sauvegarde la description du produit sélectionné
  };

  const handleImageClick = (image: string) => {
    setZoomedImage(image);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  if (loading) return <Chargement />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="z-10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] text-left">Nom du Produit</TableHead>
            <TableHead className="w-[250px] text-left">Description</TableHead>
            <TableHead className="text-left">Catégorie</TableHead>
            <TableHead className="text-center">Prix</TableHead>
            <TableHead className="text-left w-[50px]">Images</TableHead>
            <TableHead className="w-[50px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-left">{product.name}</TableCell>
                <TableCell
                  className="text-sm text-muted-foreground text-left cursor-pointer"
                  onClick={() => handleDescriptionClick(product.description)} // Action pour afficher la description complète
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
                <TableCell className="text-left">
                  {product.categories && product.categories.length > 0
                    ? product.categories.map((category) => <div key={category.id}>{category.name}</div>)
                    : <span className="text-muted-foreground">Aucune catégorie</span>}
                </TableCell>
                <TableCell className="text-right pr-8">
                  {parseFloat(product.price).toFixed(2)} XFA
                </TableCell>
                <TableCell className="text-left pl-8">
                  <div className="flex gap-2 overflow-x-auto w-[100px] h-[100px] scrollbar-hide">
                    {(product.images || []).map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id || null)}
                    className="text-gray-500"
                  >
                    <MoreHorizontal size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialogue pour afficher la description complète */}
      <Dialog open={selectedProductDescription !== null} onOpenChange={() => setSelectedProductDescription(null)}>
        <DialogContent>
          <DialogTitle>Description complète</DialogTitle>
          {selectedProductDescription && (
            <div className="whitespace-pre-line">{selectedProductDescription}</div>
          )}
          <Button onClick={() => setSelectedProductDescription(null)} className="mt-4 w-full bg-black hover:bg-black">
            Fermer
          </Button>
        </DialogContent>
      </Dialog>

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
  );
}
