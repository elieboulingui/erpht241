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
      ipAddress: eventIp,  // Récupération de l'IP de l'événement
    } = event.data;

    // Si l'IP n'est pas fournie, récupérez-la depuis l'API
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown"; // Définir une valeur par défaut en cas d'échec
      }
    }

    // Enregistrer l'activité dans la base de données avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId,
        organisationId,
        actionDetails,
        entityName,
        ipAddress,  // Ajout de l'adresse IP ici
      },
    });

    console.log(`📘 Log de connexion pour ${entityName} enregistré avec l'adresse IP : ${ipAddress}`);
  }
);
