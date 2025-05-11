"use server"

import prisma from "@/lib/prisma"

type DealUpdateData = {
  id: string
  label?: string
  description?: string
  amount?: number
  merchantId?: string | null
  contactId?: string | null
  deadline?: string | Date | null
  stepId?: string | null
  memberId?: string | null
}

export async function updateDeal(data: DealUpdateData) {
  try {
    if (!data.id) {
      return { success: false, error: "ID manquant" }
    }

    // Vérifier si l'opportunité existe
    const opportunityExists = await prisma.opportunity.findUnique({
      where: { id: data.id },
    })

    if (!opportunityExists) {
      return { success: false, error: "Opportunité non trouvée" }
    }

    // Préparer les données de base pour la mise à jour
    const updateData: any = {
      label: data.label,
      description: data.description,
      amount: data.amount || 0,
    }

    // Ajouter la date d'échéance si fournie
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline)
    }

    // Ajouter le stepId si fourni
    if (data.stepId) {
      updateData.stepId = data.stepId
    }

    // Gestion du merchant (vérification préalable)
    if (data.merchantId === null) {
      // Déconnecter le merchant
      updateData.merchant = { disconnect: true }
    } else if (data.merchantId) {
      // Vérifier si le merchant existe avant de le connecter
      const merchantExists = await prisma.merchant.findUnique({
        where: { id: data.merchantId },
      })

      if (merchantExists) {
        updateData.merchant = { connect: { id: data.merchantId } }
      } else {
        console.log(`Merchant avec ID ${data.merchantId} non trouvé, connexion ignorée`)
        return {
          success: false,
          error: `Le merchant avec l'ID ${data.merchantId} n'existe pas. Veuillez sélectionner un merchant valide.`,
        }
      }
    }

    // Gestion du contact (vérification préalable)
    if (data.contactId === null) {
      // Déconnecter le contact
      updateData.contact = { disconnect: true }
    } else if (data.contactId) {
      // Vérifier si le contact existe avant de le connecter
      const contactExists = await prisma.contact.findUnique({
        where: { id: data.contactId },
      })

      if (contactExists) {
        updateData.contact = { connect: { id: data.contactId } }
      } else {
        console.log(`Contact avec ID ${data.contactId} non trouvé, connexion ignorée`)
        return {
          success: false,
          error: `Le contact avec l'ID ${data.contactId} n'existe pas. Veuillez sélectionner un contact valide. `,
        }
      }
    }

    // Gestion du membre (vérification préalable)
    if (data.memberId === null) {
      // Déconnecter le membre
      updateData.member = { disconnect: true }
    } else if (data.memberId) {
      // Vérifier si le membre (merchant) existe avant de le connecter
      const memberExists = await prisma.merchant.findUnique({
        where: { id: data.memberId },
      })

      if (memberExists) {
        updateData.member = { connect: { id: data.memberId } }
      } else {
        console.log(`Membre avec ID ${data.memberId} non trouvé, connexion ignorée`)
        return {
          success: false,
          error: `Le membre avec l'ID ${data.memberId} n'existe pas. Veuillez sélectionner un membre valide`,
        }
      }
    }

    // Effectuer la mise à jour avec toutes les vérifications préalables
    const updatedDeal = await prisma.opportunity.update({
      where: { id: data.id },
      data: updateData,
      include: {
        merchant: true,
        contact: true,
        member: true,
        step: true,
      },
    })

    return { success: true, deal: updatedDeal }
  } catch (error: any) {
    console.error("Erreur:", error)

    // Fournir des messages d'erreur plus spécifiques pour les erreurs Prisma courantes
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Une entité référencée n'a pas été trouvée. Veuillez vérifier les identifiants fournis.",
      }
    }

    if (error.code === "P2002") {
      return {
        success: false,
        error: "Une contrainte unique a été violée. Un enregistrement avec ces données existe déjà.",
      }
    }

    if (error.code === "P2003") {
      return {
        success: false,
        error: "Contrainte de clé étrangère non respectée. Une entité référencée n'existe pas.",
      }
    }

    return {
      success: false,
      error: error.message || "Erreur lors de la mise à jour",
    }
  }
}