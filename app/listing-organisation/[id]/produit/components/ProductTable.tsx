"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ProductGeneratorModalupade } from "./update";

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

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProductByOrganisationAndProductId(organisationId!, productId);
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        toast.success("Produit supprimé avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit.");
      }
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    // Save the product ID and name separately in localStorage
    localStorage.setItem("selectedProductId", updatedProduct.id || "");
    localStorage.setItem("selectedProductName", updatedProduct.name);
  
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setEditProduct(null);  // Close the edit modal
  };
  

  if (loading) return <Chargement />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="border rounded-lg z-10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nom du Produit</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
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
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.description}</TableCell>
                  <TableCell>
  {product.categories && product.categories.length > 0
    ? product.categories.map((category) => <div key={category.id}>{category.name}</div>)
    : <span className="text-muted-foreground">Aucune catégorie</span>}
</TableCell>

                  <TableCell>{parseFloat(product.price).toFixed(2)} XFA</TableCell>
                  <TableCell>
                    <div className="flex gap-2 overflow-x-auto w-[100px] h-[100px] scrollbar-hide">
                      {(product.images || []).map((image, index) => (
                        <img key={index} src={image || "/placeholder.svg"} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center relative">
                    <Button
                      variant="link"
                      onClick={() => setMenuOpen(menuOpen === (product.id ?? null) ? null : (product.id ?? null))}

                      className="text-gray-500"
                    >
                      <MoreHorizontal size={20} />
                    </Button>
                    {menuOpen === product.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg">
                        <button
                          onClick={() => {
                            // Afficher un toast avec l'ID et le nom du produit
                            toast.success(`Produit ${product.name} (ID: ${product.id}) sélectionné pour modification`);
                            
                            // Ouvrir le modal d'édition
                            setEditProduct(product);
                          }}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id!)}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
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
      </div>

      {/* Modal d'édition */}
      {editProduct && (
        <ProductGeneratorModalupade
          // productId={editProduct.id as any}
          // productName={editProduct.name}
          // onClose={() => setEditProduct(null)}
          
        />
      )}
    </div>
  );
}
