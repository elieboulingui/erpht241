import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import { generateRandomToken } from "@/lib/generateRandomToken";
import { StripeWelcomeEmail } from '@/react-email-starter/emails/stripe-welcome';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Schéma de validation des données d'inscription
const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  name: z.string().min(3, "Votre nom complet est obligatoire")
});

// Fonction pour envoyer l'email de confirmation
async function sendConfirmationEmail(email: string, confirmationToken: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirmez votre adresse email',
      react: StripeWelcomeEmail({ token: confirmationToken, name: name }),
    });

    if (error) {
      throw new Error("Erreur lors de l'envoi de l'email de confirmation");
    }
    return data;
  } catch (error) {
    throw new Error("Erreur de service lors de l'envoi de l'email");
  }
}

// Handler POST pour l'inscription
export async function POST(request: Request) {
  try {
    // Lecture du corps de la requête
    const body = await request.json();
    const parsedBody = registerSchema.parse(body);
    const { email, password, name } = parsedBody;

    // Normalisation de l'email et hashage du mot de passe
    const normalizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Vérification si l'utilisateur existe déjà
    const existUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    
    if (existUser) {
      return NextResponse.json(
        { error: "Ce compte existe déjà !" },
        { status: 409 }
      );
    }

    // Création du nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name,
        role: "CLIENT"  // Rôle par défaut
      },
    });

    // Génération du token de confirmation
    const confirmationToken = generateRandomToken();

    // Enregistrement du token de confirmation dans la base de données
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: confirmationToken,
        expires: new Date(Date.now() + 3600000) // Expiration dans 1 heure
      }
    });

    // Envoi de l'email de confirmation
    await sendConfirmationEmail(email, confirmationToken, name);

    // Réponse à l'utilisateur
    return NextResponse.json({ message: "Inscription réussie, veuillez vérifier votre email pour confirmer votre compte." }, { status: 201 });

  } catch (error) {
    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Gestion des erreurs génériques
    console.error(error); // Log de l'erreur pour debugging
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'inscription." },
      { status: 500 }
    );
  }
}
