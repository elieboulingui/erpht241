"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";

// Définir l'interface Product
interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
  images?: string[];
  categories?: { id: string; name: string }[]; // Associer plusieurs catégories à chaque produit
}

// Fonction pour extraire l'ID de l'organisation depuis l'URL
function extractOrganisationId(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9\-]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : null;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Extraire l'ID de l'organisation depuis l'URL
  const organisationId = extractOrganisationId(window.location.href);

  useEffect(() => {
    // Si l'ID de l'organisation est introuvable, afficher une erreur
    if (!organisationId) {
      setError("L'ID de l'organisation est introuvable dans l'URL.");
      setLoading(false);
      return;
    }

    // Fonction pour récupérer les produits depuis l'API
    const fetchProducts = async () => {
      try {
        const url = `/api/produict?organisationId=${organisationId}`;  // Corrigez l'URL de l'API si nécessaire
        console.log("Fetching products from URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des produits. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        setProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [organisationId]);

  // Affichage pendant le chargement
  if (loading) {
    return <Chargement />;
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Fonction pour supprimer le produit localement après la suppression du produit via l'API
  const handleDeleteProduct = async (productId: string, organisationId: string) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (confirmDelete) {
      try {
        // Appel de la fonction pour supprimer le produit via l'API
        await deleteProductByOrganisationAndProductId(organisationId, productId);
        
        // Mettre à jour l'état local pour supprimer le produit de la liste
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        toast.success("Produit supprimé avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit.");
      }
    }
  };

  // Fonction pour gérer le menu (Éditer et Supprimer)
  const handleMenuAction = (action: "edit" | "delete", productId: string) => {
    if (action === "edit") {
      console.log("Éditer le produit avec ID:", productId);
      // Vous pouvez ouvrir un modal ou une page d'édition
    } else if (action === "delete") {
      handleDeleteProduct(productId, organisationId!);  // Appeler la fonction de suppression
    }
    // Fermer le menu après l'action
    setMenuOpen(false);
  };

  // Affichage des produits et de leurs images
  return (
    <div className="border rounded-lg z-10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nom du Produit</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Images</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, productIndex) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.description}</TableCell>
                <TableCell>
                  {/* Afficher toutes les catégories associées au produit */}
                  {product.categories?.map((category, index) => (
                    <span key={index} className="block">
                      {category.name}
                    </span>
                  ))}
                </TableCell>
                <TableCell>{parseFloat(product.price).toFixed(2)} XFA</TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <div
                      id={`image-container-${productIndex}`}
                      className="flex gap-2 overflow-x-auto w-[100px] h-[100px] scrollbar-hide"
                    >
                      {(product.images || []).map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-50 h-50 rounded overflow-hidden">
                          <img
                            src={image}
                            alt={`Image de ${product.name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <button
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSelectedProduct(product);
                      setMenuOpen(!menuOpen);
                    }}
                  >
                    •••
                  </button>
                  {menuOpen && selectedProduct?.id === product.id && (
                    <div className="absolute right-0 mb-6 bg-white shadow-md rounded-md p-2 z-50">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => handleMenuAction("edit", product.id!)}
                      >
                        Éditer
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-200"
                        onClick={() => handleMenuAction("delete", product.id!)}
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
  );
}
