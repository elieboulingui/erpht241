// app/listingorg/[id]/contact/action/getContactsByOrganisationId.ts
"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getContactsByOrganisationId(id: string) {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.");
  }

  try {
    // Recherche des contacts liés à l'organisation par son ID
    const organisationWithContacts = await prisma.organisation.findUnique({
      where: {
        id, // Utiliser l'ID de l'organisation pour la rechercher
      },
      include: {
        Contact: true, // Inclure les contacts associés à l'organisation
      },
    });

    if (!organisationWithContacts) {
      throw new Error("Aucune organisation trouvée avec cet ID.");
    }

    // Retourner les contacts associés à l'organisation
    return organisationWithContacts.Contact;
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error);
    throw new Error("Erreur serveur");
  }
}