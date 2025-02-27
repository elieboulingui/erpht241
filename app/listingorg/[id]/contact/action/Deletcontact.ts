// app/listingorg/[id]/contact/action/getContactsByOrganisationId.ts
"use server"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function Deletecontact(id: string) {
  if (!id) {
    throw new Error("L'ID du contact est requis.");
  }

  try {
    // Supprimer le contact par son ID
    const deletedContact = await prisma.contact.delete({
      where: { id: id }, // Assurez-vous que l'ID du contact est passé dans la requête
    });

    return deletedContact; // Retourner le contact supprimé pour confirmation
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    throw new Error("Erreur serveur lors de la suppression du contact.");
  }
}
