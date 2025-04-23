import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"

export const logUserLogin = inngest.createFunction(
  {
    id: "log-user-login",
    name: "Log activité - Connexion utilisateur",
  },
  {
    event: "activity/user.login",
  },
  async ({ event }) => {
    const {
      action,
      entityType,
      entityId,
      userId,
      organisationId,
      actionDetails,
      entityName,
    } = event.data

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        organisationId,
        actionDetails,
        entityName,
      },
    })

    console.log(`📘 Log de connexion pour ${entityName} enregistré.`)
  }
)
