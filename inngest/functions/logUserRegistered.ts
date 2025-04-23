import { inngest } from "@/inngest/client";

export const logUserRegistered = inngest.createFunction(
  { id: "log-user-registered", name: "Log: User Registered" },
  { event: "user/registered.log-only" },
  async ({ event, step }) => {
    const { userId, email, name, ipAddress, userAgent } = event.data;

    await step.run("log-registration", async () => {
      const { default: prisma } = await import("@/lib/prisma");

      await prisma.activityLog.create({
        data: {
          action: "REGISTER",
          entityType: "User",
          entityId: userId,
          userId,
          organisationId: null,
          entityName: email,
          actionDetails: `Nouvel utilisateur inscrit avec l'adresse ${email}`,
          ipAddress,
          userAgent,
        },
      });
    });
  }
);
