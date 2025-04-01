"use server"
import prisma  from "@/lib/prisma"; // Assurez-vous que vous avez correctement configuré Prisma

export const getDevisByOrganisationId = async (organisationId: string) => {
  try {
    const devis = await prisma.devis.findMany({
      where: { organisationId },
      // orderBy: { createdAt: "desc" }, // Trier par date pour obtenir le dernier devis
    });
    return devis;
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error);
    return [];
  }
};
