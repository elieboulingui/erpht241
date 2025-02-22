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
    const resetLink = `https://erpht241.vercel.app/reset-password/${token}`;

    // Créer le modèle de l'email à envoyer
    const emailTemplate = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.name || ""},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le bouton ci-dessous pour le réinitialiser :</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; background-color: #2e75b7; color: white; text-decoration: none; border-radius: 5px;">
            Réinitialiser le mot de passe
          </a>
          <p>Ou copiez-collez ce lien dans votre navigateur :</p>
          <p>${resetLink}</p>
          <p>Ce lien est valide pendant 1 heure.</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        </body>
      </html>
    `;

    // Envoyer l'email
    const emailResult = await sendMail({
      to: email,
      name: user.name || "",
      subject: "Vérification de votre adresse email sur HT241",
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
 