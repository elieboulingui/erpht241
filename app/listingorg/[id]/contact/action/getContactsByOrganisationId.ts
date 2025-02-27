// app/listingorg/[id]/contact/action/getContactsByOrganisationId.ts
"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getContactsByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        organisationId: id, // Utiliser 'organisationId' comme clé de relation
      },
    });

    return contacts; // Retourner les contacts
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    throw new Error("Erreur serveur");
  }
}
