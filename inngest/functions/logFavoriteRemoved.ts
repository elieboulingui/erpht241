import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const logFavoriteRemoved = inngest.createFunction(
  {
    id: "log-favorite-removed",
    name: "Log activité - Favori supprimé",
  },
  {
    event: "activity/favorite.removed",
  },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      oldData,
      newData,
      userId,
      actionDetails,
      entityName,
    } = event.data

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData: oldData ? JSON.stringify(oldData) : Prisma.JsonNull,
        newData: newData ? JSON.stringify(newData) : Prisma.JsonNull,
        userId,
        actionDetails,
        entityName,
      },
    })

    console.log(`🗑️ Log d'activité - Favori supprimé : ${entityId}`)
  }
)
