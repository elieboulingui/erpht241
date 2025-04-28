import { inngest } from "@/inngest/client";
import { auth } from "@/auth";  // Importer l'auth pour récupérer la session
import prisma from "@/lib/prisma";  // Assurez-vous d'avoir Prisma configuré

export const logEmailVerification = inngest.createFunction(
  { id: "log-email-verification", name: "Log: Email Verification Sent" },
  { event: "user/email-verification.sent" },
  async ({ event, step }) => {
    const { email, token, expires, ipAddress, userAgent } = event.data;

    // Récupérer la session et l'ID de l'utilisateur
    const session = await auth();

    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const userId = session.user.id; // ID de l'utilisateur connecté

    await step.run("log-email-verification", async () => {
      // Log dans ActivityLog avec Prisma
      await prisma.activityLog.create({
        data: {
          action: "SEND_EMAIL_VERIFICATION",
          entityType: "User",
          entityId: email,
          newData: { email, token, expires },
          ipAddress,  // Ajout de l'adresse IP dans le log
          userAgent,  // Ajout du User-Agent dans le log
          actionDetails: "Email de vérification envoyé à l’utilisateur pour confirmation",
          entityName: email,
          userId,  // Enregistrer l'ID de l'utilisateur qui a envoyé la vérification
        },
      });
    });
  }
);
