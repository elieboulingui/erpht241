"use server"
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

export async function addFavorite(contactId: string, organisationId: string) {
  try {
    // Vérifie si ce contact est déjà un favori dans l'organisation
    console.log("Prisma Client:", prisma); // Check if prisma is initialized
    console.log("contactId:", contactId);
    console.log("organisationId:", organisationId);
    
    if (!contactId || !organisationId) {
      console.error("Missing contactId or organisationId");
      return; // Exit early if data is missing
    }
    
    const existing = await prisma.favorite.findUnique({
      where: {
        contactId_organisationId: {
          contactId,
          organisationId,
        },
      },
    });
    
    console.log("Existing favorite:", existing);
    
    // Si déjà favori, on ne fait rien
    if (existing) return { success: false, message: 'Déjà dans les favoris.' }

    // Sinon, on ajoute le contact aux favoris de l'organisation
    await prisma.favorite.create({
      data: {
        contactId,
        organisationId,
      },
    })

    // Revalide la page (optionnel)
    revalidatePath(`/listing-organisation/${organisationId}`)

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'ajout du favori :", error)
    return { success: false, message: 'Erreur lors de l’ajout du favori.' }
  }
}
