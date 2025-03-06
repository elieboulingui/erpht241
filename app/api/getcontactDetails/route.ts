import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Action serveur pour récupérer les détails de contact
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ error: "Le contact n'existe pas." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Récupération du contact avec une condition pour vérifier qu'il n'est pas archivé
    const contact = await prisma.contact.findUnique({
      where: {
        id,
        isArchived: false, // Assurez-vous de ne récupérer que ceux qui ne sont pas archivés
      },
    });

    if (!contact) {
      return new Response(
        JSON.stringify({ error: "Contact non trouvé ou déjà archivé" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the contact object directly as JSON
    return new Response(JSON.stringify(contact), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du contact", error);
    return new Response(
      JSON.stringify({ error: "Impossible de récupérer les détails du contact." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
