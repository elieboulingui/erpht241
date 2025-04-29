import { inngest } from "@/inngest/client";

export const logUserCreatedViaInvite = inngest.createFunction(
  { id: "log-user-created-via-invite", name: "Log: User Created via Invite" },
  { event: "user/created-via-invite" },
  async ({ event, step }) => {
    const { default: prisma } = await import("@/lib/prisma");

    const { userId, createdByUserId, organisationId, email, role, ipAddress: eventIp } = event.data;

    // Si l'IP n'est pas fournie dans l'événement, récupérez-la via l'API
    let ipAddress = eventIp;
    if (!ipAddress) {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (err) {
        console.warn("Impossible de récupérer l'adresse IP :", err);
        ipAddress = "unknown";  // Définir "unknown" en cas d'échec
      }
    }

    await step.run("log-new-user", async () => {
      await prisma.activityLog.create({
        data: {
          action: "USER_CREATED_VIA_INVITE",
          entityType: "User",
          entityId: userId,
          userId: createdByUserId,
          createdByUserId,
          organisationId,
          relatedUserId: userId,
          entityName: email,
          actionDetails: `Utilisateur ${email} créé avec le rôle ${role} via une invitation.`,
          newData: { email, role },
          ipAddress,  // Ajouter l'adresse IP ici
        },
      });
    });
  }
);
