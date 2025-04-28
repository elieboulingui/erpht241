"use server";

import { auth } from "@/auth";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

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
    // Authentification de l'utilisateur
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    // Création dans la base de données
    const category = await prisma.category.create({
      data: {
        name,
        description,
        logo,
        organisationId,
        createdByUserId: userId, // correspond à ton schema.prisma
      },
    });

    // Envoi de l'événement à Inngest (si correctement configuré)
    await inngest.send({
      name: "category/created",
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        organisationId: category.organisationId,
        logo: category.logo,
        userId: userId,
      },
    });

    return {
      success: true,
      message: "Catégorie créée avec succès.",
      category,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie :", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
}
