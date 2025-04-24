"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // ✔️ Auth centralisée, comme dans UpdateContact
import { inngest } from "@/inngest/client";

export async function DeleteContact(id: string) {
  if (!id) {
    throw new Error("L'ID du contact est requis.");
  }

  try {
    const session = await auth(); // 🔄 Auth simplifiée (comme UpdateContact)

    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new Error("Contact introuvable.");
    }

    const deletedContact = await prisma.contact.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    });

    // 📩 Envoi de l’événement à Inngest
    await inngest.send({
      name: "contact.archive",
      data: {
        userId,
        contactId: deletedContact.id,
        oldData: existingContact,
        newData: deletedContact,
      },
    });

    return deletedContact;
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    throw new Error("Erreur serveur lors de la suppression du contact.");
  }
}
