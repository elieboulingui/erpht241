"use server";

import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

// Action serveur pour récupérer les détails de contact
export async function GetcontactDetails(id: string) {
  try {
    // Récupération du contact avec une condition pour vérifier qu'il n'est pas archivé
    const organisation = await prisma.contact.findUnique({
      // Filtrage pour ne récupérer que les contacts non archivés
      where: {
        id,
        isArchived: false // Assurez-vous de ne récupérer que ceux qui ne sont pas archivés
      },
    });

    if (!organisation) {
      throw new Error("Organisation non trouvée ou déjà archivée");
    }

    return organisation; 
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes", error);
    throw new Error("Impossible de récupérer les demandes.");
  }
}
