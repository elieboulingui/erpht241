"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

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
  }
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

  try {
    const session = await auth();
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

    const updateData: any = {
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      niveau: updatedData.niveau,
      status_contact: updatedData.status_contact,
      sector: updatedData.sector,
      adresse: updatedData.adresse,
      logo: updatedData.logo,
    };

    if (updatedData.tags !== undefined) {
      if (
        updatedData.tags.trim() === "" ||
        updatedData.tags.trim() === "Pas de tags"
      ) {
        updateData.tags = JSON.stringify([]);
      } else {
        const tagsArray = updatedData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
        updateData.tags = JSON.stringify(tagsArray);
      }
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: updateData,
    });

    // 🔁 Envoi de l'événement Inngest
    await inngest.send({
      name: "contact.updated",
      data: {
        userId,
        contactId,
        oldData: existingContact,
        newData: updatedContact,
      },
    });

    return updatedContact;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contact:", error);
    throw new Error(
      "Une erreur est survenue lors de la mise à jour du contact."
    );
  }
}
