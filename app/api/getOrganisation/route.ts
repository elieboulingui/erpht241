import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Fonction pour récupérer une organisation par son ID
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // On récupère l'ID dans les paramètres de la requête

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "ID de l'organisation manquant." }),
        { status: 400 }
      );
    }

    // On recherche l'organisation par ID dans la base de données
    const organisation = await prisma.organisation.findUnique({
      where: { id },
      select: {
        name: true,  // Retourne le nom de l'organisation
        logo: true,  // Retourne l'URL du logo
      }
    });

    if (!organisation) {
      return new Response(
        JSON.stringify({ success: false, error: "Organisation non trouvée." }),
        { status: 404 }
      );
    }

    // On retourne l'organisation (nom et logo) si elle est trouvée
    return new Response(JSON.stringify({ success: true, data: organisation }), {
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'organisation:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Impossible de récupérer l'organisation." }),
      { status: 500 }
    );
  }
}
