import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const logInvitationSent = inngest.createFunction(
  {
      name: "Log Invitation Sent",
      id: "1"
  },
  { event: "invitation/sent" },
  async ({ event }) => {
    const {
      invitationId,
      userId,
      createdByUserId,
      organisationId,
      email,
      role,
      accessType,
    } = event.data;

    await prisma.activityLog.create({
      data: {
        action: "INVITATION_ENVOYÉE",
        entityType: "invitation",
        entityId: invitationId,
        userId,
        createdByUserId,
        organisationId,
        newData: { email, role, accessType },
        createdAt: new Date(),
      },
    });

    return { message: "Activity log enregistré via Inngest" };
  }
);
