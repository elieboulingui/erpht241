import { inngest } from "@/inngest/client";

export const logInvitationCreated = inngest.createFunction(
  { id: "log-invitation-created", name: "Log: Invitation Created" },
  { event: "invitation/created" },
  async ({ event, step }) => {
    const { default: prisma } = await import("@/lib/prisma");

    const { invitationId, userId, organisationId, email, role, ipAddress: eventIp } = event.data;

    // 🔁 Récupérer l'IP si elle n'est pas incluse dans l'événement
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

    await step.run("create-activity-log", async () => {
      await prisma.activityLog.create({
        data: {
          action: "INVITATION_CREATED",
          entityType: "Invitation",
          entityId: invitationId,
          userId,
          createdByUserId: userId,
          organisationId,
          invitationId,
          actionDetails: `Invitation envoyée à ${email} avec le rôle ${role}`,
          entityName: email,
          newData: { email, role },
          ipAddress, // ✅ Ajout de l'adresse IP ici
        },
      });
    });
  }
);
