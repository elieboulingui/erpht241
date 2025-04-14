"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Fonction pour archiver une marque par son ID
export async function deleteMarqueById(id: string) {
  if (!id) {
    throw new Error("L'ID de la catégorie est requis.");
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }
    const userId = session.user.id;

    // Recherche de la marque par son ID
    const brandToArchive = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brandToArchive) {
      throw new Error("Aucune marque trouvée avec cet ID.");
    }

    // Archivage de la marque
    const archivedBrand = await prisma.brand.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // 🔍 Log dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_BRAND",
        entityType: "Brand",
        entityId: id,
        oldData: JSON.stringify(brandToArchive),
        organisationId: brandToArchive.organisationId,
        brandId: id,
        userId,
        createdByUserId: userId,
      },
    });

    console.log(`Marque ${id} archivée avec succès.`);
    return archivedBrand;
  } catch (error) {
    console.error("Erreur lors de l'archivage de la marque:", error);
    throw new Error("Erreur serveur lors de l'archivage de la marque.");
  }
}
