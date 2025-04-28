import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

// Crée une fonction pour logger l'événement de vérification d'email
export const logUserEmailVerified = inngest.createFunction(
  {
    id: "log-user-email-verified",  // Identifiant unique de la fonction
    name: "Log: User Email Verified", // Nom de la fonction dans Inngest
  },
  {
    event: "user/email-verified", // L'événement que tu vas émettre
  },
  async ({ event, step }) => {
    const { userId, email, emailVerified, ipAddress } = event.data;

    // Créer un log dans la base de données
    await step.run("create-email-verification-log", async () => {
      await prisma.activityLog.create({
        data: {
          action: "USER_EMAIL_VERIFIED", // Action à enregistrer
          entityType: "User", // Type de l'entité (ici l'utilisateur)
          entityId: userId,  // ID de l'utilisateur
          userId,  // L'utilisateur qui a vérifié l'email (peut être le même que userId)
          createdByUserId: userId, // ID de l'utilisateur qui a effectué l'action
          organisationId: null, // Si tu as une organisation, tu peux la récupérer ici
          actionDetails: `L'email de ${email} a été vérifié.`,
          entityName: email,  // Utiliser l'email comme nom de l'entité
          newData: {
            email,  // Email vérifié
            emailVerified,  // Date de la vérification
            ipAddress, // Adresse IP du client
          },
        },
      });
    });

    console.log(`📘 Log de vérification d'email pour ${email} enregistré avec succès.`);
  }
);
