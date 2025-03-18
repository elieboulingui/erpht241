"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma" // Assurez-vous d'importer votre client Prisma
import { Status_Contact } from "@prisma/client";

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
  try {
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
