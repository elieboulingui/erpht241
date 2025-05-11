"use server"

import prisma from "@/lib/prisma"

type DealUpdateData = {
  id: string
  label?: string
  description?: string
  amount?: number
  merchantId?: string | null // peut être un email ou un user id
  contactId?: string | null
  deadline?: string | Date | null
  stepId?: string | null
  memberId?: string | null // peut être un email ou un user id
}

export async function updateDeal(data: DealUpdateData) {
  try {
    if (!data.id) {
      return { success: false, error: "ID manquant" }
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: data.id },
    })

    if (!opportunity) {
      return { success: false, error: "Opportunité non trouvée" }
    }

    const updateData: any = {
      label: data.label,
      description: data.description,
      amount: data.amount || 0,
    }

    if (data.deadline) {
      updateData.deadline = new Date(data.deadline)
    }
    if (data.stepId) {
      updateData.stepId = data.stepId
    }

    // === GESTION DU MERCHANT ===
    if (data.merchantId === null) {
      updateData.merchant = { disconnect: true }
    } else if (data.merchantId) {
      const isEmail = data.merchantId.includes("@")
      let merchant;
      if (isEmail) {
        // Recherche par email
        merchant = await prisma.merchant.findFirst({
          where: { email: data.merchantId },
        })

        if (!merchant) {
          merchant = await prisma.merchant.create({
            data: {
              email: data.merchantId,
              name: data.merchantId.split("@")[0] ?? "Nouveau marchand",
            },
          })
        }
      } else {
        // On considère que c'est un user id
        merchant = await prisma.merchant.findUnique({
          where: { id: data.merchantId },
        })
        if (!merchant) {
          const user = await prisma.user.findUnique({
            where: { id: data.merchantId },
          })

          if (!user) {
            return {
              success: false,
              error: `Aucun utilisateur trouvé avec l'ID ${data.merchantId}.`,
            }
          }

          merchant = await prisma.merchant.create({
            data: {
              email: user.email,
              name: user.name ?? user.email.split("@")[0],
            },
          })
        }
      }

      updateData.merchant = { connect: { id: merchant.id } }
    }

    // === GESTION DU CONTACT ===
    if (data.contactId === null) {
      updateData.contact = { disconnect: true }
    } else if (data.contactId) {
      const contactExists = await prisma.contact.findUnique({
        where: { id: data.contactId },
      })

      if (contactExists) {
        updateData.contact = { connect: { id: data.contactId } }
      } else {
        return {
          success: false,
          error: `Le contact avec l'ID ${data.contactId} n'existe pas.`,
        }
      }
    }

    // === GESTION DU MEMBER (assigné) ===
    if (data.memberId === null) {
      updateData.member = { disconnect: true }
    } else if (data.memberId) {
      const isEmail = data.memberId.includes("@")
      let member;
      if (isEmail) {
        member = await prisma.merchant.findFirst({
          where: { email: data.memberId },
        })

        if (!member) {
          member = await prisma.merchant.create({
            data: {
              email: data.memberId,
              name: data.memberId.split("@")[0] ?? "Nouveau membre",
            },
          })
        }
      } else {
        // On considère que c'est un user id
        member = await prisma.merchant.findUnique({
          where: { id: data.memberId },
        })
        if (!member) {
          const user = await prisma.user.findUnique({
            where: { id: data.memberId },
          })

          if (!user) {
            return {
              success: false,
              error: `Aucun utilisateur trouvé avec l'ID ${data.memberId}.`,
            }
          }

          member = await prisma.merchant.create({
            data: {
              email: user.email,
              name: user.name ?? user.email.split("@")[0],
            },
          })
        }
      }

      updateData.member = { connect: { id: member.id } }
    }

    // Mise à jour de l'opportunité
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

    if (error.code === "P2025") {
      return {
        success: false,
        error: "Entité référencée non trouvée. Vérifiez les identifiants.",
      }
    }

    if (error.code === "P2002") {
      return {
        success: false,
        error: "Violation de contrainte unique. Données déjà existantes.",
      }
    }

    if (error.code === "P2003") {
      return {
        success: false,
        error: "Clé étrangère invalide. L'entité liée est introuvable.",
      }
    }

    return {
      success: false,
      error: error.message || "Erreur lors de la mise à jour",
    }
  }
}
