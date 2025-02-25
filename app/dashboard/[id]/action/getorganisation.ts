"use server";

import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Action serveur pour récupérer toutes les informations de l'organisation
export async function getorganisation(id: string) {
  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id },
    });

    if (!organisation) {
      throw new Error("Organisation non trouvée");
    }

    return organisation; // Retourne l'objet complet de l'organisation
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes", error);
    throw new Error("Impossible de récupérer les demandes.");
  }
}
