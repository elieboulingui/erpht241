import { inngest } from "@/inngest/client";

export const logUserCreatedViaInvite = inngest.createFunction(
  { id: "log-user-created-via-invite", name: "Log: User Created via Invite" },
  { event: "user/created-via-invite" },
  async ({ event, step }) => {
    const { default: prisma } = await import("@/lib/prisma");

    const { userId, createdByUserId, organisationId, email, role, ipAddress } = event.data;

    // Log l'action avec l'adresse IP
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
          actionDetails: `Utilisateur ${email} créé avec le rôle ${role} via une invitation. Adresse IP: ${ipAddress}`,
          newData: { email, role, ipAddress }, // Inclure l'adresse IP dans les nouvelles données
        },
      });
    });
  }
);
