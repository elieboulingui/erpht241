import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client" // ← Ajoute ceci

export const logFavoriteAdded = inngest.createFunction(
  {
    id: "log-favorite-added",
    name: "Log activité - Favori ajouté",
  },
  {
    event: "activity/favorite.added",
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
        oldData: oldData ? JSON.stringify(oldData) : Prisma.JsonNull, // ✅ ici
        newData: JSON.stringify(newData),
        userId,
        actionDetails,
        entityName,
      },
    })

    console.log(`📝 Log d'activité - Favori ajouté : ${entityId}`)
  }
)
