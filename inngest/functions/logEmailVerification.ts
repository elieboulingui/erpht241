import { inngest } from "@/inngest/client";

export const logEmailVerification = inngest.createFunction(
  { id: "log-email-verification", name: "Log: Email Verification Sent" },
  { event: "user/email-verification.sent" },
  async ({ event, step }) => {
    const { email, token, expires, ipAddress, userAgent } = event.data;

    await step.run("log-email-verification", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      // Log dans ActivityLog avec Prisma
      await prisma.activityLog.create({
        data: {
          action: "SEND_EMAIL_VERIFICATION",
          entityType: "User",
          entityId: email,
          newData: { email, token, expires },
          ipAddress,
          userAgent,
          actionDetails: "Email de vérification envoyé à l’utilisateur pour confirmation",
          entityName: email,
        },
      });
    });
  }
);
