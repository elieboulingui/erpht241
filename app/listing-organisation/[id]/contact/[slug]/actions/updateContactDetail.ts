"use server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma" // Assurez-vous d'importer votre client Prisma
import { Status_Contact } from "@prisma/client"
import { auth } from '@/auth'
import { inngest } from "@/inngest/client"

// Interface pour les données de mise à jour du contact
interface ContactUpdateData {
  name?: string; // Nom du contact
  email?: string; // Email du contact
  phone?: string; // Numéro de téléphone
  address?: string; // Adresse
  status_contact?: Status_Contact; // Statut du contact (une seule valeur d'énumération)
}

/**
 * Met à jour les détails d'un contact dans la base de données
 * @param contactId L'ID du contact à mettre à jour
 * @param data Les données à mettre à jour pour ce contact
 * @returns Un objet avec le statut de la mise à jour (succès ou échec)
 */
export async function UpdateContactDetail(contactId: string, data: ContactUpdateData) {
  const session = await auth()

  try {
    // Récupérer les données actuelles du contact avant la mise à jour
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: {
        id: true,
        name: true,
        organisations: true, // Récupérer les organisations liées au contact
      },
    });

    if (!existingContact) {
      throw new Error("Contact introuvable.");
    }

    // Vérification si la liste des organisations existe et a au moins une organisation
    const organisationId = existingContact.organisations && existingContact.organisations.length > 0 
      ? existingContact.organisations[0].id // Sélectionner la première organisation
      : null;

    if (!organisationId) {
      throw new Error("Aucune organisation liée à ce contact.");
    }

    // Mise à jour du contact dans la base de données avec Prisma
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        // Applique les changements seulement si les valeurs sont définies
        name: data.name,
        email: data.email,
        phone: data.phone,
        adresse: data.address, // Notez l'usage de `adresse` qui est le nom de la colonne
        status_contact: data.status_contact, // On passe directement une valeur d'énumération
      },
    });

    // Envoi d'un événement à Inngest pour enregistrer l'action de mise à jour du contact
    await inngest.send({
      name: "activity/contact.updated", // Nom de l'événement
      data: {
        userId: session?.user.id,  // ID de l'utilisateur qui a effectué l'action
        contactId: contactId,  // ID du contact mis à jour
        organisationId: organisationId,  // ID de l'organisation récupéré
        activity: `Contact ${existingContact.name} updated`,  // Détails de l'événement
        changes: data,  // Détails des changements effectués
      },
    });

    // Log de débogage pour vérifier que la mise à jour a réussi
    console.log(`Contact ID: ${contactId} updated successfully`, updatedContact);

    // Revalidation du cache de la page du contact pour refléter les changements
    revalidatePath(`/contact/${contactId}`);

    // Retour d'un résultat de succès
    return { success: true, data: updatedContact };
  } catch (error) {
    // Gestion des erreurs lors de la mise à jour
    console.error("Error updating contact:", error);

    // Retour d'un résultat d'échec avec un message d'erreur
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    };
  }
}
