"use server";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function createCategory({
  name,
  description,
  organisationId,
  logo,
}: {
  name: string;
  description?: string;
  organisationId: string;
  logo?: string;
}) {
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    // Envoi de l'événement à Inngest
    await inngest.send({
      name: "category/created",
      data: {
        name,
        description,
        organisationId,
        logo,
        userId,
      },
    });

    return { success: true, message: "Catégorie en cours de création." };
  } catch (error) {
    console.error("Erreur lors du déclenchement de l'événement Inngest:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
