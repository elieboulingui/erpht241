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
      ipAddress: eventIp, // si fourni via l'event
    } = event.data;

    // 🔁 Fallback IP : si absente dans event.data, la récupérer via ipify
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Échec de récupération de l'adresse IP :", err);
        ipAddress = "unknown";
      }
    }

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
        ipAddress, // ✅ Ajout de l'adresse IP ici
      },
    });

    console.log(`🗑️ Log d'activité - Favori supprimé : ${entityId}`);
  }
);
