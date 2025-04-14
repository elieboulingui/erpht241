"use server"

import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react"; // Pour récupérer l'utilisateur connecté

type NiveauEnum = "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT";
type StatutContactEnum = "PERSONNE" | "COMPAGNIE" | "GROSSISTE";

export async function UpdateContact(
  contactId: string,
  updatedData: {
    name?: string;
    email?: string;
    phone?: string;
    niveau?: NiveauEnum;
    tags?: string;
    adresse?: string;
    logo?: string;
    status_contact?: StatutContactEnum;
    sector?: string;
  },
) {
  if (!contactId) {
    throw new Error("L'ID du contact est requis.");
  }

  if (
    updatedData.niveau &&
    !["PROSPECT_POTENTIAL", "PROSPECT", "CLIENT"].includes(updatedData.niveau)
  ) {
    throw new Error("Le niveau fourni est invalide.");
  }

  if (updatedData.email && !validateEmail(updatedData.email)) {
    throw new Error("L'email fourni n'est pas valide.");
  }

  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("Utilisateur non authentifié.");
    }

    const userId = session.user.id;

    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!existingContact) {
      throw new Error("Contact introuvable.");
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        niveau: updatedData.niveau,
        tags: updatedData.tags ? JSON.stringify(updatedData.tags) : undefined,
        status_contact: updatedData.status_contact ?? undefined,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "UPDATE_CONTACT",
        entityType: "Contact",
        entityId: updatedContact.id,
        oldData: JSON.stringify(existingContact), // Stocke les anciennes données sous 'oldData'
        newData: JSON.stringify(updatedContact), // Stocke les nouvelles données sous 'newData'
        userId,
        createdByUserId: userId,
        organisationId: updatedContact.id,
        contactId: updatedContact.id,
      },
    });

    return updatedContact;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contact:", error);
    throw new Error("Une erreur est survenue lors de la mise à jour du contact.");
  }
}

function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,4}$/;
  return re.test(email);
}
