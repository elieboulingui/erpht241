// inngest/functions/user/role-and-access-updated.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Assurez-vous d'importer auth pour récupérer la session de l'utilisateur

// Fonction pour obtenir l'adresse IP de l'utilisateur
async function getIpAddress() {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;
}

export const roleAndAccessUpdatedHandler = inngest.createFunction(
  {
      name: "Role and Access Updated - Activity Log",
      id: ""
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
    } = event.data;

    // Récupère la session de l'utilisateur (authentification)
    const session = await auth();
    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const createdByUserId = session.user.id;

    // Récupère l'adresse IP de l'utilisateur
    const ipAddress = await getIpAddress();

    // Enregistrer l'activité dans le log
    await prisma.activityLog.create({
      data: {
        action: "ROLE_OU_ACCES_MODIFIÉ",
        entityType: "user",
        entityId: userId,
        userId: userId,
        organisationId: organisationId,
        createdByUserId: createdByUserId, // L'utilisateur qui effectue l'action
        oldData: { role: oldRole, accessType: oldAccessType },
        newData: { role: newRole, accessType: newAccessType },
        createdAt: new Date(),
        ipAddress,  // Ajouter l'adresse IP ici
      },
    });

    return { success: true };
  }
);
