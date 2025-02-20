import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import sendMail from "@/lib/sendmail"; // Import de la fonction d'envoi des emails
import { generateRandomToken } from "@/lib/generateRandomToken"; // Génération du token de confirmation

// Schéma pour valider les données d'inscription
const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  name: z.string().min(3, "Votre nom complet est obligatoire"),
});

// Handler pour les requêtes POST (inscription d'un utilisateur)
export async function POST(request: Request) {
  try {
    // Parsing du corps de la requête
    const body = await request.json();
    const parsedBody = registerSchema.parse(body);
    const { email, password, name } = parsedBody;

    // Normalisation de l'email et hachage du mot de passe
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Vérification si l'utilisateur existe déjà
    const existUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existUser) {
      return NextResponse.json(
        { error: "Ce compte existe déjà !" },
        { status: 409 }
      );
    }

    // Création du nouvel utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name,
        role: "ADMIN", // Le rôle par défaut peut être 'ADMIN' ou 'CLIENT'
      },
    });

    // Génération d'un token aléatoire pour la vérification de l'email
    const confirmationToken = generateRandomToken();

    // Stockage du token de vérification dans la base de données
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: confirmationToken,
        expires: new Date(Date.now() + 3600000), // Le token expire dans 1 heure
      },
    });

    // Modèle de l'email de vérification (HTML)
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de votre compte HT241</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #1E2344; max-width: 600px; margin: 0 auto; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2A305A; border-radius: 5px; color: #ffffff">
            <tr>
              <td style="padding: 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <img src="/images/ht241.png"  alt="HT241 Logo" style="width: 200px; height: auto; display: block; margin: 0 auto;">
                </div>
                <p style="margin-bottom: 20px; color: #ffffff">Bonjour ${name ? name : 'stagiaire'},</p>
                <p style="margin-bottom: 20px;color: #ffffff">
                  Merci de vous être inscrit sur HT241. Pour finaliser votre inscription et activer votre compte, veuillez utiliser le code d'authentification suivant :
                </p>
                <p style="margin-bottom: 20px;color: #ffffff; font-size: 24px; font-weight: bold;">
                  <strong>${confirmationToken}</strong>
                </p>
                <p style="margin-top: 30px;color: #ffffff">
                  Si vous n'avez pas créé de compte sur HT241, veuillez ignorer cet email.
                </p>
                <p style="margin-top: 30px;color: #ffffff">
                  Cordialement,<br>L'équipe HT241
                </p>
              </td>
            </tr>
          </table>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #7f8c8d; font-size: 12px;">© 2024 HT241. Tous droits réservés.</p>
          </div>
        </body>
      </html>
    `;

    // Envoi de l'email de vérification avec le token OTP
    const emailResult = await sendMail({
      to: email,
      name: name, // Passez le nom ici
      subject: "Vérification de votre adresse email sur HT241",
      body: emailTemplate,
    });

    if (emailResult.status === "error") {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation" },
        { status: 500 }
      );
    }

    // Retourner une réponse de succès
    return NextResponse.json(
      { message: "Inscription réussie, veuillez vérifier votre email pour confirmer votre compte." },
      { status: 201 }
    );
  } catch (error) {
    // Gestion des erreurs de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Gestion générique des erreurs
    console.error(error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'inscription." },
      { status: 500 }
    );
  }
}
