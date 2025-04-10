import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Action serveur pour récupérer les détails du produit
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Le produit n'existe pas." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Récupération du produit avec une condition pour vérifier qu'il n'est pas archivé
    const product = await prisma.product.findUnique({
      where: {
        id,
        isArchived: false, // Assurez-vous de ne récupérer que ceux qui ne sont pas archivés
      },
      include: {
        organisation: true,  // Inclure les informations de l'organisation associée
        categories: true,    // Inclure les catégories associées
        Stock: true,         // Inclure les informations de stock
      },
    });

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Produit non trouvé ou déjà archivé" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Assurez-vous que les images sont incluses dans la réponse
    const productDetails = {
      ...product,
      images: product.images, // Inclure les images
    };

    // Retourner l'objet produit avec les images directement sous forme de JSON
    return new Response(JSON.stringify(productDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du produit", error);
    return new Response(
      JSON.stringify({ error: "Impossible de récupérer les détails du produit." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
