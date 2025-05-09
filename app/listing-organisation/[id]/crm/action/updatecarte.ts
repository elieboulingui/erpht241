"use server"

import prisma from "@/lib/prisma"
import type { Opportunity } from "@prisma/client"

interface UpdateDealData {
  id: string
  label?: string
  description?: string
  amount?: number
  merchantId?: string
  contactId?: string
  tags?: string[]
  tagColors?: string[]
  avatar?: string
  deadline?: string
  stepId?: string
  userId?: string
}

type UpdateDealResult = { success: true; deal: Opportunity } | { success: false; error: string }

export async function updateDeal(data: UpdateDealData): Promise<UpdateDealResult> {
  try {
    if (!data.id) throw new Error("L'ID de l'opportunité est requis.")

    // Vérifie que l'opportunité existe
    const existingDeal = await prisma.opportunity.findUnique({
      where: { id: data.id },
    })
    if (!existingDeal) throw new Error("Aucune opportunité trouvée avec cet ID.")

    // Construction des données à mettre à jour
    const updateData: any = {}

    // Only include fields that are provided
    if (data.label !== undefined) updateData.label = data.label
    if (data.description !== undefined) updateData.description = data.description
    if (data.amount !== undefined) updateData.amount = data.amount
    if (data.avatar !== undefined) updateData.avatar = data.avatar
    if (data.deadline?.trim()) updateData.deadline = new Date(data.deadline)

    if (data.stepId) {
      const step = await prisma.step.findUnique({ where: { id: data.stepId } })
      if (step) {
        updateData.step = { connect: { id: data.stepId } }
      } else {
        console.log(`Step with ID ${data.stepId} not found, skipping connection`)
      }
    }

    if (data.merchantId) {
      const merchant = await prisma.merchant.findUnique({ where: { id: data.merchantId } })
      if (merchant) {
        updateData.merchant = { connect: { id: data.merchantId } }
      } else {
        console.log(`Merchant with ID ${data.merchantId} not found, skipping connection`)
      }
    }

    if (data.contactId) {
      const contact = await prisma.contact.findUnique({ where: { id: data.contactId } })
      if (contact) {
        updateData.contact = { connect: { id: data.contactId } }
      } else {
        console.log(`Contact with ID ${data.contactId} not found, skipping connection`)
      }
    }

    console.log("Updating opportunity with data:", { id: data.id, ...updateData })

    const updatedDeal = await prisma.opportunity.update({
      where: { id: data.id },
      data: updateData,
    })

    return { success: true, deal: updatedDeal }
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'opportunité:", error)
    return {
      success: false,
      error: error.message ?? "Erreur inconnue lors de la mise à jour",
    }
  }
}
