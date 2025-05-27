// inngest/functions/logActivity.ts
import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"

export const logDealCreated = inngest.createFunction(
  { id: "log-deal-created" },
  { event: "deal/created" },
  async ({ event }) => {
    const { deal, userId } = event.data

    try {
      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          entityType: "Opportunity",
          entityId: deal.id,
          newData: deal,
          userId: userId ?? null,
          organisationId: deal.organisationId ?? null,
          createdByUserId: userId ?? null,
          actionDetails: `Création de l'opportunité ${deal.label}`,
          entityName: deal.label,
        },
      })
    } catch (error) {
      console.error("Erreur log deal:", error)
    }
  }
)

export const logMerchantCreated = inngest.createFunction(
  { id: "log-merchant-created" },
  { event: "merchant/created" },
  async ({ event }) => {
    const { merchant, userId } = event.data

    try {
      await prisma.activityLog.create({
        data: {
          action: "CREATE",
          entityType: "Merchant",
          entityId: merchant.id,
          newData: merchant,
          userId: userId ?? null,
          organisationId: merchant.organisationId ?? null,
          createdByUserId: userId ?? null,
          actionDetails: `Création du marchand ${merchant.name}`,
          entityName: merchant.name,
        },
      })
    } catch (error) {
      console.error("Erreur log merchant:", error)
    }
  }
)
