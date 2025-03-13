import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est configuré correctement
import { revalidatePath } from "next/cache"; // Importer revalidatePath

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");
  const path = searchParams.get("path"); // Récupérer le paramètre path pour la revalidation

  // Vérification que l'ID de l'organisation est présent
  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Mise à jour de toutes les catégories pour les archiver (marquer comme archivées) pour l'organisation donnée
    await prisma.category.updateMany({
      where: {
        organisationId: organisationId, // Assure-toi que toutes les catégories de l'organisation sont concernées
        isArchived: false,  // Assure-toi que seules les catégories non archivées sont modifiées
      },
      data: {
        isArchived: true, // Archiver les catégories
      },
    });

    // Si un path est fourni, revalider ce path après l'archivage
    if (path) {
      revalidatePath(path); // Revalidation du chemin pour mettre à jour la cache
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    // Retourner une réponse de succès après l'archivage
    return NextResponse.json({ message: "Toutes les catégories ont été archivées avec succès." }, { status: 200 });

  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'archivage des catégories." },
      { status: 500 }
    );
  }
}
