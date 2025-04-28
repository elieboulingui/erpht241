import { inngest } from "@/inngest/client";

export const logInvitationCreated = inngest.createFunction(
  { id: "log-invitation-created", name: "Log: Invitation Created" },
  { event: "invitation/created" },
  async ({ event, step }) => {
    const { default: prisma } = await import("@/lib/prisma");

    const { invitationId, userId, organisationId, email, role } = event.data;

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
        },
      });
    });
  }
);
