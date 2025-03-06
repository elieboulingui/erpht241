// app/listingorg/[id]/contact/action/getContactsByOrganisationId.ts
"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function DeleteContact(id: string) {
  if (!id) {
    throw new Error("L'ID du contact est requis.");
  }

  try {
    // Supprimer le contact par son ID
    const deletedContact = await prisma.contact.update({
      where: {
        id: id,  // Utiliser l'ID du produit pour effectuer la mise à jour
      },
      data: {
        isArchived: true, // Marquer comme archivé
        archivedAt: new Date(), // Enregistrer la date d'archivage
      },
    });

    return deletedContact; // Retourner le contact supprimé pour confirmation
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    throw new Error("Erreur serveur lors de la suppression du contact.");
  }
}
