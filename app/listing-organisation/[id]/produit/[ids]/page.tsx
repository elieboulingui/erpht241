'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import des composants ShadCN
import Chargement from '@/components/Chargement';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour extraire l'ID de l'URL
  const extractProductIdFromUrl = (url: string): string | null => {
    const regex = /\/produit\/([a-zA-Z0-9\-]+)/; // Regex pour récupérer l'ID du produit
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const productId = extractProductIdFromUrl(window.location.href); // Extraire l'ID du produit de l'URL

    if (productId) {
      fetchProductDetails(productId); // Appeler l'API avec l'ID du produit
    } else {
      setError('Produit non trouvé.');
      setLoading(false);
    }
  }, []);

  const fetchProductDetails = async (productId: string) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/product-details?id=${productId}`); // Passer l'ID en tant que paramètre dans l'URL

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails du produit.');
      }

      const data = await response.json();
      setProductDetails(data); // Sauvegarder les détails du produit dans l'état
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Chargement />;
  }

  if (error) {
    return (
      <Card className="max-w-lg w-full">
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg w-full mx-auto mt-10">
      <CardHeader>
        <CardTitle>Détails du produit</CardTitle>
        <CardDescription>Voici les informations détaillées sur le produit.</CardDescription>
      </CardHeader>
      <CardContent>
        {productDetails ? (
          <>
            <h2 className="text-xl font-semibold">{productDetails.name}</h2>
            <p className="text-gray-600 mt-2">{productDetails.description}</p>
            <p className="text-lg font-bold mt-4">Prix: {productDetails.price} Fcfa</p>
            {/* Ajoutez d'autres informations du produit ici si nécessaire */}
          </>
        ) : (
          <p>Aucun détail trouvé pour ce produit.</p>
        )}
      </CardContent>
    </Card>
  );
}
