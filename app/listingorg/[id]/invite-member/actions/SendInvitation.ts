"use server";

import { auth } from "@/auth";
import { generateRandomToken } from "@/lib/generateRandomToken";
import sendMail from "@/lib/sendmail";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const DEFAULT_PASSWORD = "password123"; // Mot de passe par défaut

// Vérifie si un rôle est valide
function isValidRole(role: string): boolean {
  const validRoles = ['MEMBRE', 'ADMIN'];
  return validRoles.includes(role.toUpperCase());
}

// Crée un utilisateur avec un mot de passe par défaut
async function createUserWithDefaultPassword(email: string, role: string, organisationId: string) {
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10); // Hachage du mot de passe par défaut
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role as 'MEMBRE' | 'ADMIN',
      organisations: {
        connect: { id: organisationId },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

// Envoie un email d'invitation
async function sendInvitationEmail(email: string, organisationName: string, role: string, inviteToken: string) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation à rejoindre l'organisation</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
        <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
            <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">Invitation à rejoindre ${organisationName}</h1>
            <p style="margin-bottom: 16px;">Bonjour ${email},</p>
            <p style="margin-bottom: 32px; line-height: 1.5;">Vous avez été invité à rejoindre l'organisation <strong>${organisationName}</strong> en tant que <strong>${role}</strong>.</p>
            <p style="margin-bottom: 32px; line-height: 1.5;">Pour finaliser votre inscription, vous devez vérifier votre adresse e-mail.</p>
            <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">Vérifier l'email</a>
            <p style="margin-bottom: 16px; color: #333;">Ou copiez et collez cette URL dans votre navigateur :</p>
            <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">https://erpht241.vercel.app/accept-invitation/${inviteToken}</a>
            <div style="margin-bottom: 32px;">
              <p style="margin-bottom: 8px;">Votre mot de passe par défaut est :</p>
              <p style="font-family: monospace; font-size: 18px; margin: 0; color: #333;">${DEFAULT_PASSWORD}</p>
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 24px; margin: 0;">Si vous ne souhaitez pas vérifier votre email ou si vous n'avez pas demandé ceci, ignorez et supprimez ce message.</p>
        </div>
    </body>
    </html>
  `;

  await sendMail({
    to: email,
    name: "HT241 Team",
    subject: "Invitation à rejoindre l'organisation",
    body: emailTemplate,
  });
}

export async function sendInvitationToUser(organisationId: string, email: string, role: string) {
  try {
    // 1. Vérifier si l'utilisateur est authentifié
    const session = await auth();
    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }
    const userId = session.user.id;

    // 2. Vérifier si l'organisation existe
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!organisation) {
      throw new Error("Organisation non trouvée");
    }

    // 3. Vérifier si l'invitation a déjà été envoyée
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        organisationId,
      },
    });
    if (existingInvitation) {
      throw new Error("Cet email a déjà été invité à rejoindre cette organisation");
    }

    // 4. Vérifier le rôle
    if (!isValidRole(role)) {
      throw new Error("Rôle invalide");
    }

    // 5. Générer un token d'invitation
    const inviteToken = generateRandomToken();

    // 6. Créer le token de vérification
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: inviteToken,
        expires: new Date(Date.now() + 3600000), // Expiration dans 1 heure
      },
    });

    // 7. Créer l'invitation
    await prisma.invitation.create({
      data: {
        email,
        role: role.toUpperCase() as 'MEMBRE' | 'ADMIN',
        organisationId,
        invitedById: userId,
        token: inviteToken,
        tokenExpiresAt: new Date(Date.now() + 3600000),  // 1 heure d'expiration
      },
    });

    // 8. Créer l'utilisateur si nécessaire
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await createUserWithDefaultPassword(email, role, organisationId);
    }

    // 9. Envoyer l'email d'invitation
    await sendInvitationEmail(email, organisation.name, role, inviteToken);

    return { message: "Invitation envoyée avec succès." };
  } catch (error) {
    console.error("Erreur générée:", error);
    throw new Error("Une erreur s'est produite lors de l'envoi de l'invitation.");
  }
}
