import { inngest } from "@/inngest/client";
import { EventSchemas } from "inngest";

export const logPasswordResetRequested = inngest.createFunction(
  { 
    id: "log-password-reset-requested",
    name: "Log: Password Reset Requested",
  },
  { event: "user/password-reset.requested" }, // 👈 L'événement déclencheur
  async ({ event, step, logger }) => {
    const { userId, email, organisationId, ipAddress, userAgent } = event.data;

    try {
      await step.run("create-activity-log", async () => {
        await import("@/lib/prisma").then(async ({ default: prisma }) => {
          await prisma.activityLog.create({
            data: {
              action: "FORGOT_PASSWORD_REQUEST",
              entityType: "User",
              entityId: userId,
              userId,
              organisationId,
              entityName: email,
              actionDetails: `L'utilisateur ${email} a demandé une réinitialisation de mot de passe.`,
              ipAddress,
              userAgent,
            },
          });
        });
      });

      logger.info("Activity log enregistré avec succès.");
    } catch (error) {
      logger.error("Erreur lors de la création du log d'activité:", error);
      throw error;
    }
  }
);
