'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import os from 'os' // Pour récupérer l'IP locale si nécessaire

/**
 * Supprime l'URL de l'image/logo d'un contact dans la base de données
 * et enregistre l'action dans le journal d'activité.
 * @param contactId L'ID du contact dont l'image doit être supprimée
 */
export async function DeleteImage(contactId: string) {
  const session = await auth()

  try {
    // Récupérer les données actuelles du contact
    const existingContact = await prisma.contact.findUnique({
      where: { id: contactId },
    })

    if (!existingContact) {
      throw new Error('Contact introuvable.')
    }

    // Mettre à jour le contact en supprimant le logo
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        logo: null,
      },
    })
    // Récupérer l'adresse IP et le User-Agent depuis les entêtes de la requête

    // Enregistrement dans le journal d'activité
    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Contact',
        entityId: contactId,
        entityName: existingContact.name || 'Contact',
        oldData: { logo: existingContact.logo },
        newData: { logo: null },
        organisationId: existingContact.id,  // Je suppose que l'organisation est associée au contact
        userId: session?.user.id,
        createdByUserId: session?.user.id,
        contactId: contactId,
        ipAddress:undefined,
        userAgent:undefined,
        actionDetails: `Suppression de l'image/logo du contact "${existingContact.name}".`,
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
