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
      ipAddress,  // Ajouter l'IP si elle est transmise
    } = event.data

    // Récupérer le rôle de l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    // Si l'utilisateur existe, récupérer le rôle, sinon définir "inconnu"
    const userRole = user ? user.role : "inconnu"

    // Créer un log d'activité avec l'adresse IP et le rôle
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        organisationId,
        actionDetails,
        entityName,
        ipAddress,        // Ajouter l'adresse IP dans le log
      },
    })

    console.log(`📘 Log de connexion pour ${entityName} enregistré avec IP: ${ipAddress} et rôle: ${userRole}.`)
  }
)
