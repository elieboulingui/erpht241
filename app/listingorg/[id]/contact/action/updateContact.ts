"use server"

import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien configuré

// Enumération des stages possibles pour validation
type StageEnum = "LEAD" | "WON"

// Fonction pour mettre à jour un contact en fonction de son ID
export async function updateContact(
  contactId: string,
  updatedData: {
    name?: string
    email?: string
    phone?: string
    stage?: StageEnum
    tags?: string[]
    Adresse?: string
    Record?: string
    logo?: string

  },
) {
  if (!contactId) {
    throw new Error("L'ID du contact est requis.")
  }

  // Vérification de la validité des données de stage
  if (updatedData.stage && !["LEAD", "WON"].includes(updatedData.stage)) {
    throw new Error("Le stage fourni est invalide.")
  }

  // Validation de l'email si un email est fourni
  if (updatedData.email && !validateEmail(updatedData.email)) {
    throw new Error("L'email fourni n'est pas valide.")
  }

  try {
    // Mise à jour du contact avec les nouvelles données
    const updatedContact = await prisma.contact.update({
      where: {
        id: contactId, // Utiliser l'ID du contact pour la mise à jour
      },
      data: {
        name: updatedData.name, // Mettre à jour le nom
        email: updatedData.email, // Mettre à jour l'email
        phone: updatedData.phone, // Mettre à jour le téléphone
        stage: updatedData.stage, // Mettre à jour le stage
        tabs: updatedData.tags ? JSON.stringify(updatedData.tags) : undefined, // Si 'tags' est fourni, mettre à jour
      },
    })

    if (!updatedContact) {
      throw new Error("Le contact n'a pas pu être mis à jour.")
    }

    return updatedContact // Retourner le contact mis à jour
  } catch (error) {
    // Amélioration de la gestion des erreurs
    console.error("Erreur lors de la mise à jour du contact:", error)
    throw new Error("Une erreur est survenue lors de la mise à jour du contact.")
  }
}

// Fonction de validation d'email
function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,4}$/
  return re.test(email)
}

