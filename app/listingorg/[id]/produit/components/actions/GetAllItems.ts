"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { toast } from "sonner";

export async function getitemsByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const product = await prisma.product.findMany({
      where: {
        organisationId: id, // Utiliser 'organisationId' comme clé de relation
      },
    });

    return product; // Retourner les invitations
  } catch (error) {
    toast.error("Erreur lors de la récupération des invitations:");
    throw new Error("Erreur serveur");
  }
}
