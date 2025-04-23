"use server";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function createSubCategory({
  name,
  organisationId,
  parentId,
  logo,
  description,
}: {
  name: string;
  organisationId: string;
  parentId: string;
  logo?: string;
  description?: string;
}) {
  try {
    if (!name || !organisationId || !parentId) {
      throw new Error("Nom, organisation et catégorie parente requis");
    }

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    await inngest.send({
      name: "subcategory/created",
      data: {
        name,
        organisationId,
        parentId,
        logo,
        description,
        userId,
      },
    });

    return {
      success: true,
      message: "Sous-catégorie en cours de création.",
    };
  } catch (error) {
    console.error("Erreur lors du déclenchement de l'événement Inngest:", error);
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Erreur interne du serveur",
    };
  }
}
