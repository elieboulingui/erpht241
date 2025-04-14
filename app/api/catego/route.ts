import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est configuré correctement
import { revalidatePath } from "next/cache"; // Importer revalidatePath

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");
  const path = searchParams.get("path"); // Récupérer le paramètre path pour la revalidation
  const userId = "example-user-id"; // Récupère l'ID de l'utilisateur connecté (par exemple, depuis le token JWT)

  // Vérification que l'ID de l'organisation est présent
  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    // Mise à jour de toutes les catégories pour les archiver (marquer comme archivées) pour l'organisation donnée
    const updatedCategories = await prisma.category.updateMany({
      where: {
        organisationId: organisationId, // Assure-toi que toutes les catégories de l'organisation sont concernées
        isArchived: false,  // Assure-toi que seules les catégories non archivées sont modifiées
      },
      data: {
        isArchived: true, // Archiver les catégories
      },
    });

    // Créer un log d'activité après l'archivage des catégories
    await prisma.activityLog.create({
      data: {
        action: "Archivage des catégories",
        entityType: "Category",
        entityId: organisationId,
        oldData: undefined, // Tu peux ajouter des données avant modification si nécessaire
        newData: { isArchived: true }, // Données après modification
        userId: userId, // ID de l'utilisateur ayant effectué l'action
        organisationId: organisationId,
        actionDetails: `Toutes les catégories de l'organisation ${organisationId} ont été archivées.`,
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
