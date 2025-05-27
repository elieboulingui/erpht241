"use server"

import prisma from "@/lib/prisma"
import { inngest } from "@/inngest/client"
import type { Opportunity, Merchant } from "@prisma/client"

interface CreateDealData {
  label: string
  description?: string
  amount?: number
  merchantId?: string
  contactId?: string
  tags?: string[]
  tagColors?: string[]
  avatar?: string
  deadline?: string
  stepId: string
  userId?: string
}

type CreateDealResult = { success: true; deal: Opportunity } | { success: false; error: string }

export async function createDeal(data: CreateDealData): Promise<CreateDealResult> {
  try {
    if (!data.label) throw new Error("Le champ 'label' est obligatoire.")

    const step = await prisma.step.findUnique({ where: { id: data.stepId } })
    if (!step) throw new Error("L'étape spécifiée n'existe pas.")

    let merchantId = data.merchantId
    let createdMerchant: Merchant | null = null

    // Si userId est fourni, récupérer ou créer un merchant
    if (data.userId) {
      const user = await prisma.user.findUnique({ where: { id: data.userId } })
      if (!user) throw new Error("L'utilisateur spécifié n'existe pas.")

      let merchant = await prisma.merchant.findUnique({ where: { id: data.userId } })

      if (!merchant) {
        merchant = await prisma.merchant.create({
          data: {
            id: data.userId,
            name: user.name ?? "Nom par défaut",
            role: user.role ?? "Rôle inconnu",
            email: user.email ?? "email@example.com",
            photo: user.image ?? "",
          },
        })

        createdMerchant = merchant

        // ✅ Log merchant creation via Inngest
        await inngest.send({
          name: "merchant/created",
          data: {
            merchant,
            userId: data.userId,
          },
        })
      }

      merchantId = merchant.id
    }

    let contactConnection = undefined
    if (data.contactId) {
      contactConnection = { connect: { id: data.contactId } }
    }

    let merchantConnection = undefined
    if (merchantId) {
      const merchantExists = await prisma.merchant.findUnique({ where: { id: merchantId } })
      if (merchantExists) {
        merchantConnection = { connect: { id: merchantId } }
      } else {
        console.log(`Merchant with ID ${merchantId} not found, skipping connection`)
      }
    }

    const opportunityData: any = {
      label: data.label,
      description: data.description ?? "",
      amount: data.amount ?? 0,
      merchant: merchantConnection,
      contact: contactConnection,
      avatar: data.avatar,
      step: { connect: { id: data.stepId } },
      deadline: data.deadline?.trim() ? new Date(data.deadline) : new Date(),
    }

    const newDeal = await prisma.opportunity.create({ data: opportunityData })

    // ✅ Log deal creation via Inngest
    await inngest.send({
      name: "deal/created",
      data: {
        deal: newDeal,
        userId: data.userId ?? null,
      },
    })

    return { success: true, deal: newDeal }
  } catch (error: any) {
    console.error("Erreur lors de la création de l'opportunité :", error)

    if (error.code === 'P2025') {
      return {
        success: false,
        error: "Une relation n'a pas pu être établie car l'enregistrement n'existe pas.",
      }
    }

    return {
      success: false,
      error: error.message ?? "Erreur lors de la création",
    }
  }
}
