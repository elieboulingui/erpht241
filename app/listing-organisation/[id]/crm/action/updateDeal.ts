"use server"

import prisma from "@/lib/prisma"

type DealUpdateData = {
  id: string
  label?: string
  description?: string
  amount?: number
  merchantId?: string | null // email ou user ID
  contactId?: string | null
  deadline?: string | Date | null
  stepId?: string | null
  memberId?: string | null // email ou user ID
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

    // === DEADLINE ===
    if (data.deadline === null) {
      updateData.deadline = null
    } else if (data.deadline) {
      const parsedDate = new Date(data.deadline)
      if (isNaN(parsedDate.getTime())) {
        return {
          success: false,
          error: "Format de date invalide pour la deadline.",
        }
      }
      updateData.deadline = parsedDate
    }

    // === ÉTAPE ===
    if (data.stepId) {
      updateData.stepId = data.stepId
    }

    // === MERCHANT ===
    if (data.merchantId === null) {
      updateData.merchant = { disconnect: true }
    } else if (data.merchantId) {
      const isEmail = data.merchantId.includes("@")
      let merchant

      if (isEmail) {
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

    // === CONTACT ===
    if (data.contactId === null) {
      updateData.contact = { disconnect: true }
    } else if (data.contactId) {
      const contactExists = await prisma.contact.findUnique({
        where: { id: data.contactId },
      })

      if (!contactExists) {
        return {
          success: false,
          error: `Le contact avec l'ID ${data.contactId} n'existe pas.`,
        }
      }

      updateData.contact = { connect: { id: data.contactId } }
    }

    // === MEMBER (assigné) ===
    if (data.memberId === null) {
      updateData.member = { disconnect: true }
    } else if (data.memberId) {
      const isEmail = data.memberId.includes("@")
      let member

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

    // === MISE À JOUR DE L'OPPORTUNITÉ ===
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

    switch (error.code) {
      case "P2025":
        return {
          success: false,
          error: "Entité référencée non trouvée. Vérifiez les identifiants.",
        }
      case "P2002":
        return {
          success: false,
          error: "Violation de contrainte unique. Données déjà existantes.",
        }
      case "P2003":
        return {
          success: false,
          error: "Clé étrangère invalide. L'entité liée est introuvable.",
        }
      default:
        return {
          success: false,
          error: error.message || "Erreur lors de la mise à jour.",
        }
    }
  }
}
