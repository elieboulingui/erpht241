import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assure-toi que prisma est bien configuré
import sendMail from "@/lib/sendmail"; // La fonction pour envoyer l'email
import crypto from "crypto"; // Pour générer un token sécurisé
import { z } from "zod"; // Pour valider l'email

// Schéma de validation de l'email avec Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(req: Request) {
  try {
    // Récupérer et valider le corps de la requête
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Chercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Si l'utilisateur n'est pas trouvé, renvoyer une erreur
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Générer un token sécurisé pour la réinitialisation
    const token = crypto.randomBytes(32).toString("hex");

    // Créer un nouveau token de réinitialisation sans chercher un token existant
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000), // Le token expire dans 1 heure
      },
    });

    // Construire le lien de réinitialisation
    const resetLink = `https://erpht241.vercel.app/reset-passwords/${token}`;

    // Créer le modèle de l'email à envoyer
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de votre mot de passe</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
          <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
              <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">
                  Réinitialisation de votre mot de passe
              </h1>
              <p style="margin-bottom: 16px;">
                  Bonjour ${user.name || ""},
              </p>
              <p style="margin-bottom: 32px; line-height: 1.5;">
                  Vous avez demandé la réinitialisation de votre mot de passe.
              </p>
              <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; margin: 0 auto 32px;">
                  Réinitialiser le mot de passe
              </a>
              <p style="margin-bottom: 16px; color: #333;">
                  Ou copiez et collez cette URL dans votre navigateur :
              </p>
              <a href="${resetLink}" style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">
                  ${resetLink}
              </a>
              <div style="margin-bottom: 32px;">
                  <p style="margin-bottom: 8px;">
                      Ce lien est valide pendant 1 heure.
                  </p>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 24px; margin: 0;">
                  Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
              </p>
          </div>
      </body>
      </html>
    `;

    // Envoyer l'email
    const emailResult = await sendMail({
      to: email,
      name: user.name || "",
      subject: "Réinitialisation de votre mot de passe",
      body: emailTemplate,
    });

    // Si l'email n'a pas pu être envoyé, renvoyer une erreur
    if (emailResult.status === "error") {
      return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
    }

    // Si tout se passe bien, renvoyer un message de succès
    return NextResponse.json({ message: "Email envoyé avec succès" }, { status: 200 });

  } catch (error) {
    console.error("Erreur interne du serveur:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
