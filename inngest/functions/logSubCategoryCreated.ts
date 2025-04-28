import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Fonction pour récupérer l'adresse IP de l'appareil
async function getIpAddress() {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;
}

export const logSubCategoryCreated = inngest.createFunction(
  { id: "log-sub-category-created" },
  { event: "subcategory/created" },
  async ({ event, step }) => {
    const { name, organisationId, parentId, logo, description, userId } = event.data;

    // Récupère l'adresse IP de l'appareil
    const ipAddress = await getIpAddress();

    const parentCategory = await prisma.category.findUnique({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new Error("Catégorie parente introuvable");
    }

    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation invalide");
    }

    const subCategory = await step.run("create-sub-category", async () => {
      return await prisma.category.create({
        data: {
          name,
          description: description || null,
          logo: logo ?? null,
          organisationId,
          parentId,
        },
        include: {
          parent: true,
          organisation: true,
        },
      });
    });

    // Enregistre le log d'activité avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action: "CREATE_SUBCATEGORY",
        entityType: "Category",
        entityId: subCategory.id,
        newData: JSON.stringify(subCategory),
        organisationId: subCategory.organisationId,
        categoryId: subCategory.id,
        userId,
        createdByUserId: userId,
        actionDetails: `Création de la sous-catégorie "${name}"`,
        entityName: "Sous-catégorie",
        ipAddress, // Ajout de l'adresse IP dans le log
      },
    });

    // Revalidation du chemin
    await step.run("revalidate-path", async () => {
      const path = `/listing-organisation/${organisationId}/produit/categorie`;
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidatePath?path=${path}`);
      } catch (err) {
        console.error("Erreur revalidation dans Inngest:", err);
      }
    });

    return { success: true, id: subCategory.id };
  }
);
