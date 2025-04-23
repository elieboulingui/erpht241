import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import sendMail from "@/lib/sendmail";
import crypto from "crypto";
import { z } from "zod";
import { inngest } from "@/inngest/client"; // 👈 Inngest client

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
        organisations: true,
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
        expiresAt: new Date(Date.now() + 3600000), // 1h
      },
    });

    const resetLink = `https://erpht241.vercel.app/reset-passwords/${token}`;

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Réinitialisation de votre mot de passe</title></head>
      <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <div style="background-color: white; padding: 40px; border-radius: 8px;">
          <h1 style="text-align: center;">Réinitialisation de votre mot de passe</h1>
          <p>Bonjour ${user.name || ""},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none;">Réinitialiser le mot de passe</a>
          <p>Ou copiez-collez cette URL : <a href="${resetLink}">${resetLink}</a></p>
          <p style="font-size: 14px;">Ce lien est valide pendant 1 heure.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
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

    // 🔎 Infos pour log Inngest
    const userAgent = req.headers.get("user-agent") || null;
    const ipAddress = req.headers.get("x-forwarded-for") || null;

    // 📬 Envoie l'événement à Inngest
    await inngest.send({
      name: "user/password-reset.requested",
      data: {
        userId: user.id,
        email: user.email,
        organisationId: user.organisations?.[0]?.id || null,
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
