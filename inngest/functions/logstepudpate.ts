// inngest/functions/logActivity.ts

import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"

// ... logDealCreated et logMerchantCreated déjà présents

export const logStepUpdated = inngest.createFunction(
  { id: "log-step-updated" },
  { event: "step/updated" },
  async ({ event }) => {
    const { stepId, userId, oldData, newData } = event.data

    try {
      await prisma.activityLog.create({
        data: {
          action: "UPDATE",
          entityType: "Step",
          entityId: stepId,
          oldData,
          newData,
          userId: userId ?? null,
          createdByUserId: userId ?? null,
          actionDetails: `Mise à jour du nom de l'étape : "${oldData.label}" → "${newData.label}"`,
          entityName: newData.label,
        },
      })
    } catch (error) {
      console.error("Erreur log update step:", error)
    }
  }
)
