import { inngest } from "@/inngest/client"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// Fonction pour récupérer l'adresse IP via l'API Ipify
async function getIpAddress() {
  const response = await fetch("https://api.ipify.org/?format=json")
  const data = await response.json()
  return data.ip
}

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

    // Récupère l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress()

    // Création du log d'activité avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData: oldData ?? Prisma.JsonNull, // Utilisation correcte pour champ JSON
        newData: newData ?? Prisma.JsonNull, // Utilisation correcte pour champ JSON
        userId,
        actionDetails,
        entityName,
        ipAddress,
      },
    })

    console.log(`🗑️ Log d'activité - Favori supprimé : ${entityId} de l'IP ${ipAddress}`)
  }
)
