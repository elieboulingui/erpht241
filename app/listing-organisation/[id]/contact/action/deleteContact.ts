// app/listingorg/[id]/contact/action/getContactsByOrganisationId.ts
"use server"
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function DeleteContact(id: string) {
  if (!id) {
    throw new Error("L'ID du contact est requis.");
  }

  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    // Récupérer le contact avant de le modifier pour l'historique
    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new Error("Contact introuvable.");
    }

    // Marquer le contact comme archivé
    const deletedContact = await prisma.contact.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // Créer un log d'activité
    await prisma.activityLog.create({
      data: {
        action: "ARCHIVE_CONTACT",
        entityType: "Contact",
        entityId: deletedContact.id,
        oldData: existingContact,
        newData: deletedContact,
        userId: userId,
        createdByUserId: userId,
        organisationId: deletedContact.id,
        contactId: deletedContact.id,
      },
    });

    return deletedContact;
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    throw new Error("Erreur serveur lors de la suppression du contact.");
  }
}
