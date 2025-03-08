"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";

// Définir l'interface Product
interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
  images?: string[];  // Utilisez 'images' au lieu de 'imageUrls'
  generatedImages?: string[];
  category?: { id: string; name: string };
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
        console.log("Fetching products from URL:", url);  // Log pour vérifier l'URL

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des produits. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);  // Vérification des données renvoyées

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

  // Fonction pour gérer le défilement des images
  const handleScroll = (direction: "left" | "right", index: number) => {
    const imageContainer = document.getElementById(`image-container-${index}`);
    if (!imageContainer) return;

    const scrollAmount = direction === "left" ? -100 : 100;  // Valeur de défilement pour chaque image
    imageContainer.scrollLeft += scrollAmount;
  };

  // Affichage des produits et de leurs images
  return (
    <div className="border rounded-lg overflow-hidden">
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
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{parseFloat(product.price).toFixed(2)} XFA</TableCell>
                <TableCell>
                  {/* Conteneur avec défilement horizontal de l'image */}
                  <div className="relative flex items-center gap-2">
                    
                    <div
                      id={`image-container-${productIndex}`}
                      className="flex gap-2 overflow-x-auto w-[100px] h-[100px] scrollbar-hide"
                    >
                      {/* Afficher toutes les images du produit, si disponibles */}
                      {(product.images || []).map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-50 h-50 rounded overflow-hidden">
                          <img
                            src={image}
                            alt={`Image de ${product.name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = "/placeholder.svg")} // Remplacer par placeholder en cas d'erreur
                          />
                        </div>
                      ))}
                    </div>
                   
                  </div>
                </TableCell>

                <TableCell>
                  <button className="text-muted-foreground hover:text-foreground">•••</button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
