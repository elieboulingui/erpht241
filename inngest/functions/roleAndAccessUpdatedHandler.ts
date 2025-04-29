import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const roleAndAccessUpdatedHandler = inngest.createFunction(
  {
    name: "Role and Access Updated - Activity Log",
    id: "",
  },
  { event: "user/role-and-access-updated" },
  async ({ event, step }: { event: any; step: any }) => {
    const {
      userId,
      organisationId,
      oldRole,
      oldAccessType,
      newRole,
      newAccessType,
      ipAddress: eventIp, // Récupération de l'IP depuis l'événement
    } = event.data;

    // 🔁 Si l'IP n'est pas incluse, récupérer l'IP via l'API ipify
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

    // Enregistrement du log d'activité
    await prisma.activityLog.create({
      data: {
        action: "ROLE_OU_ACCES_MODIFIÉ",
        entityType: "user",
        entityId: userId,
        userId: userId,
        organisationId: organisationId,
        createdByUserId: userId, // Peut être remplacé si l'action vient d’un admin
        oldData: JSON.stringify({ role: oldRole, accessType: oldAccessType }),
        newData: JSON.stringify({ role: newRole, accessType: newAccessType }),
        createdAt: new Date(),
        ipAddress, // Ajout de l'adresse IP
      },
    });

    return { success: true };
  }
);
