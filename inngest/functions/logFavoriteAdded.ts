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
      ipAddress: eventIp, // ← permet d'utiliser une IP fournie dans l'event
    } = event.data;

    // 🔁 Fallback pour récupérer l'IP si elle n’est pas dans event.data
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown";
      }
    }

    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        oldData: oldData ? JSON.stringify(oldData) : Prisma.JsonNull,
        newData: JSON.stringify(newData),
        userId,
        actionDetails,
        entityName,
        ipAddress, // ✅ Adresse IP ajoutée ici
      },
    });

    console.log(`📝 Log d'activité - Favori ajouté : ${entityId}`);
  }
);
