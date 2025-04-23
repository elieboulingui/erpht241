import { inngest } from "@/inngest/client";

export const logPasswordReset = inngest.createFunction(
  { id: "log-password-reset", name: "Log: Password Reset" },
  { event: "user/password-reset" },
  async ({ event, step }) => {
    const { default: prisma } = await import("@/lib/prisma");

    const { userId, email, ipAddress, userAgent } = event.data;

    await step.run("log-password-reset", async () => {
      await prisma.activityLog.create({
        data: {
          action: "PASSWORD_RESET",
          entityType: "User",
          entityId: userId,
          userId,
          organisationId: null,
          createdByUserId: null,
          ipAddress,
          userAgent,
          actionDetails: `L'utilisateur ${email} a réinitialisé son mot de passe.`,
          entityName: email,
          newData: {
            message: "Mot de passe mis à jour",
          },
        },
      });
    });
  }
);
