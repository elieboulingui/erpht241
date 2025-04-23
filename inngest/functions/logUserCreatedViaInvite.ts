import { inngest } from "@/inngest/client";

export const logUserCreatedViaInvite = inngest.createFunction(
  { id: "log-user-created-via-invite", name: "Log: User Created via Invite" },
  { event: "user/created-via-invite" },
  async ({ event, step }) => {
    const { default: prisma } = await import("@/lib/prisma");

    const { userId, createdByUserId, organisationId, email, role } = event.data;

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
        },
      });
    });
  }
);
