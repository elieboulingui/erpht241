'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { inngest } from "@/inngest/client"  // Importing inngest for event sending

/**
 * Supprime l'URL de l'image/logo d'un contact dans la base de données
 * et enregistre l'action dans le journal d'activité.
 * @param contactId L'ID du contact dont l'image doit être supprimée
 */
export async function DeleteImage(contactId: string) {
  const session = await auth()

  try {
    // Récupérer les données actuelles du contact, incluant l'ID de l'organisation
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: {
        id: true,
        name: true,
        logo: true,
        organisations: true,  // Nous accédons à l'organisation associée au contact
      },
    })

    // Vérifie si le contact existe
    if (!existingContact) {
      throw new Error('Contact introuvable.')
    }

    // Vérifie si le tableau 'organisations' n'est pas vide
    if (existingContact.organisations.length === 0) {
      throw new Error('Aucune organisation trouvée pour ce contact.')
    }

    // On suppose que le contact appartient à au moins une organisation, on récupère la première organisation
    const organisation = existingContact.organisations[0]

    // Vérifier si l'organisation existe
    const organisationData = await prisma.organisation.findUnique({
      where: { id: organisation.id },  // Accéder à l'ID de l'organisation depuis la relation
      select: {
        id: true,
        name: true,
      },
    })

    if (!organisationData) {
      throw new Error('Organisation introuvable pour ce contact.')
    }

    // Mettre à jour le contact en supprimant l'image/logo
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        logo: null,  // Suppression de l'URL de l'image
      },
    })

    // Envoi de l'événement à Inngest pour enregistrer l'activité de suppression de l'image/logo
    await inngest.send({
      name: 'activity/contact.image.deleted', // Nom de l'événement
      data: {
        userId: session?.user.id,  // ID de l'utilisateur qui a effectué l'action
        contactId: contactId,  // ID du contact dont l'image a été supprimée
        organisationId: organisationData.id,  // ID de l'organisation récupéré à partir de l'organisation
        activity: `Contact image/logo deleted for ${existingContact.name}`,  // Détails de l'événement
      },
    })

    // Revalider le cache pour ce contact spécifique
    revalidatePath(`/contact/${contactId}`)

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image :', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    }
  }
}
