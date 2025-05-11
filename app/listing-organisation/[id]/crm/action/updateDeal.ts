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
  tags?: Array<string | string>  // Ajout de la propriété 'tags'
}

export async function updateDeal(data: DealUpdateData) {
  try {
    // Vérifier si l'ID existe
    if (!data.id) {
      return { success: false, error: "ID manquant" }
    }

    // Trouver l'opportunité à mettre à jour
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: data.id },
    })

    if (!opportunity) {
      return { success: false, error: "Opportunité non trouvée" }
    }

    const updateData: any = {
      label: data.label,
      description: data.description,
      amount: data.amount ?? 0,
    }

    // Gérer la date limite (deadline)
    if (data.deadline !== undefined) {
      if (data.deadline === null) {
        updateData.deadline = null
      } else {
        const parsedDate = new Date(data.deadline)
        if (isNaN(parsedDate.getTime())) {
          return {
            success: false,
            error: "Format de date invalide pour la deadline.",
          }
        }
        updateData.deadline = parsedDate
      }
    }

    // Gérer l'ID de l'étape (stepId)
    if (data.stepId) {
      updateData.stepId = data.stepId
    }

    // Gérer le marchand (merchant)
    if (data.merchantId !== undefined) {
      if (data.merchantId === null) {
        updateData.merchant = { disconnect: true }
      } else {
        const isEmail = data.merchantId.includes("@")
        let merchant = isEmail
          ? await prisma.merchant.findFirst({ where: { email: data.merchantId } })
          : await prisma.merchant.findUnique({ where: { id: data.merchantId } })

        if (!merchant) {
          if (!isEmail) {
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
          } else {
            merchant = await prisma.merchant.create({
              data: {
                email: data.merchantId,
                name: data.merchantId.split("@")[0] ?? "Nouveau marchand",
              },
            })
          }
        }
        updateData.merchant = { connect: { id: merchant.id } }
      }
    }

    // Gérer le contact
    if (data.contactId !== undefined) {
      if (data.contactId === null) {
        updateData.contact = { disconnect: true }
      } else {
        const contact = await prisma.contact.findUnique({
          where: { id: data.contactId },
        })

        if (!contact) {
          return {
            success: false,
            error: `Le contact avec l'ID ${data.contactId} n'existe pas.`,
          }
        }

        updateData.contact = { connect: { id: data.contactId } }
      }
    }

    // Gérer le membre
    if (data.memberId !== undefined) {
      if (data.memberId === null) {
        updateData.member = { disconnect: true }
      } else {
        const isEmail = data.memberId.includes("@")
        let member = isEmail
          ? await prisma.merchant.findFirst({ where: { email: data.memberId } })
          : await prisma.merchant.findUnique({ where: { id: data.memberId } })

        if (!member) {
          if (!isEmail) {
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
          } else {
            member = await prisma.merchant.create({
              data: {
                email: data.memberId,
                name: data.memberId.split("@")[0] ?? "Nouveau membre",
              },
            })
          }
        }
        updateData.member = { connect: { id: member.id } }
      }
    }

    // Gérer l'ajout des tags (si nécessaire)
    if (data.tags) {
      updateData.tags = data.tags; // Ajouter les tags dans l'objet updateData
    }

    // Mise à jour finale
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

    // Gestion des erreurs en fonction des codes d'erreur de Prisma
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
