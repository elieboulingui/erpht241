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

    const emailTemplate = `
  <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de l'email</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
    <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">
            Vérification de l'email
        </h1>

        <p style="margin-bottom: 16px;">
            Bonjour ${email}, <!-- Nom dynamique -->
        </p>

        <p style="margin-bottom: 32px; line-height: 1.5;">
            Pour finaliser votre inscription, vous devez vérifier votre adresse e-mail.
        </p>

        <a href="https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}" 
           style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
            Vérifier l'email
        </a>

        <p style="margin-bottom: 16px; color: #333;">
            Ou copiez et collez cette URL dans votre navigateur :
        </p>

        <a href="https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}" 
           style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">
            https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}
        </a>

        <div style="margin-bottom: 32px;">
            <p style="margin-bottom: 8px;">
                Vous pouvez également utiliser ce mot de passe à usage unique sur la page de vérification :
            </p>
            <p style="font-family: monospace; font-size: 18px; margin: 0; color: #333;">
                ${confirmationToken} <!-- Token dynamique -->
            </p>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 24px; margin: 0;">
            Si vous ne souhaitez pas vérifier votre email ou si vous n'avez pas demandé ceci, ignorez et supprimez ce message. Veuillez ne pas transférer cet email à quelqu'un d'autre.
        </p>
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
