import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import sendMail from "@/lib/sendmail";
import crypto from "crypto";
import { z } from "zod";

// Schéma de validation de l'email
const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organisations: true, // Si l'utilisateur peut avoir plusieurs organisations
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    const resetLink = `https://erpht241.vercel.app/reset-passwords/${token}`;

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

    const emailResult = await sendMail({
      to: email,
      name: user.name || "",
      subject: "Réinitialisation de votre mot de passe",
      body: emailTemplate,
    });

    if (emailResult.status === "error") {
      return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
    }

    // Récupération de l'IP et du user-agent
    const userAgent = req.headers.get("user-agent") || null;
    const ipAddress = req.headers.get("x-forwarded-for") || null;

    // Ajout d'un log dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: "FORGOT_PASSWORD_REQUEST",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        organisationId: user.organisations?.[0]?.id || null, // Première organisation si elle existe
        actionDetails: `L'utilisateur ${user.email} a demandé une réinitialisation de mot de passe.`,
        entityName: user.email,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({ message: "Email envoyé avec succès" }, { status: 200 });

  } catch (error) {
    console.error("Erreur interne du serveur:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
