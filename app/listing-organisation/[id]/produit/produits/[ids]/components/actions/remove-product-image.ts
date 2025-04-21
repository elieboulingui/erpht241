'use server';

import prisma from '@/lib/prisma';

export async function removeProductImage({
  productId,
  imageUrl,
}: {
  productId: string;
  imageUrl: string;
}) {
  try {
    // Récupération du produit depuis la base de données
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Produit introuvable');
    }

    // Filtrage de l'image à supprimer
    const updatedImages = product.images.filter((img) => img !== imageUrl);

    // Mise à jour du produit avec la nouvelle liste d’images
    await prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur suppression image:', error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
