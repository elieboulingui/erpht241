"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function deleteCategoryById(id: string) {
  if (!id) {
    throw new Error("L'ID de la catégorie est requis.");
  }

  try {
    const categoryToArchive = await prisma.category.findUnique({
      where: { id },
    });

    if (!categoryToArchive) {
      throw new Error("Aucune catégorie trouvée avec cet ID.");
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    const archivedCategory = await prisma.category.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // 👉 Déclenchement de l'événement Inngest pour le log uniquement
    await inngest.send({
      name: "category/archived.log-only",
      data: {
        oldData: categoryToArchive,
        newData: archivedCategory,
        organisationId: archivedCategory.organisationId,
        userId,
      },
    });

    console.log(`Catégorie ${id} archivée avec succès.`);
    return archivedCategory;
  } catch (error) {
    console.error("Erreur lors de l'archivage de la catégorie:", error);
    throw new Error("Erreur serveur lors de l'archivage de la catégorie.");
  }
}
