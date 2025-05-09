"use server"

import prisma from "@/lib/prisma"
import type { Opportunity } from "@prisma/client"

interface UpdateDealData {
  id: string
  label?: string
  description?: string
  amount?: number
  merchantId?: string | null
  contactId?: string | null
  tags?: string[]
  tagColors?: string[]
  avatar?: string
  deadline?: string
  stepId?: string
}

type UpdateDealResult = { success: true; deal: Opportunity } | { success: false; error: string }

export async function updateDeal(data: UpdateDealData): Promise<UpdateDealResult> {
  try {
    if (!data.id) throw new Error("L'ID de l'opportunité est obligatoire.")

    // Vérifier que l'opportunité existe
    const existingDeal = await prisma.opportunity.findUnique({
      where: { id: data.id },
    })

    if (!existingDeal) {
      throw new Error("L'opportunité spécifiée n'existe pas.")
    }

    // Préparer les connexions pour merchant et contact
    let merchantConnection = undefined
    if (data.merchantId === null) {
      merchantConnection = { disconnect: true }
    } else if (data.merchantId) {
      // Vérifier que le merchant existe avant de tenter la connexion
      const merchantExists = await prisma.merchant.findUnique({
        where: { id: data.merchantId },
      })

      if (merchantExists) {
        merchantConnection = { connect: { id: data.merchantId } }
      } else {
        console.log("Merchant with ID ${data.merchantId} not found, skipping connection")
      }
    }

    let contactConnection = undefined
    if (data.contactId === null) {
      contactConnection = { disconnect: true }
    } else if (data.contactId) {
      // Vérifier que le contact existe avant de tenter la connexion
      const contactExists = await prisma.contact.findUnique({
        where: { id: data.contactId },
      })

      if (contactExists) {
        contactConnection = { connect: { id: data.contactId } }
      } else {
        console.log("Contact with ID ${data.contactId} not found, skipping connection")
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {}

    if (data.label !== undefined) updateData.label = data.label
    if (data.description !== undefined) updateData.description = data.description
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.avatar !== undefined) updateData.avatar = data.avatar
    if (merchantConnection) updateData.merchant = merchantConnection
    if (contactConnection) updateData.contact = contactConnection
    if (data.deadline?.trim()) updateData.deadline = new Date(data.deadline)
    if (data.stepId) updateData.step = { connect: { id: data.stepId } }

    // Mettre à jour l'opportunité
    const updatedDeal = await prisma.opportunity.update({
      where: { id: data.id },
      data: updateData,
    })

    return { success: true, deal: updatedDeal }
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'opportunité :", error)

    // Ajouter des informations d'erreur plus détaillées
    if (error.code === "P2025") {
      return {
        success: false,
        error: "Une relation n'a pas pu être établie car l'enregistrement n'existe pas.",
      }
    }

    return {
      success: false,
      error: error.message ?? "Erreur lors de la mise à jour",
    }
  }
}