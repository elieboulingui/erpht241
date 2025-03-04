"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Définir l'interface Product
interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
  imageUrls?: string[];
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
        const url = `/api/produict?organisationId=${organisationId}`;  // Utilisation du bon nom d'API
        console.log("Fetching products from URL:", url);  // Log pour vérifier l'URL

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des produits. Status: ${response.status}`);
        }

        const data = await response.json();
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.description}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{parseFloat(product.price).toFixed(2)} €</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {(product.imageUrls || product.generatedImages || []).map((image, index) => (
                      <div key={index} className="h-10 w-10 rounded border overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Image de ${product.name}`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
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
