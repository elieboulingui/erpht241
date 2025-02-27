"use server"

import { auth } from "@/auth"; // Assurez-vous que la fonction auth() récupère l'utilisateur connecté
import { generateRandomToken } from "@/lib/generateRandomToken"; // Importer la fonction pour générer un token unique
import sendMail from "@/lib/sendmail"; // Importer la fonction sendMail
import prisma from "@/lib/prisma"; // Prisma pour accéder à la base de données
import bcrypt from "bcryptjs"; // Pour le hachage du mot de passe

const DEFAULT_PASSWORD = "password123"; // Mot de passe par défaut

// Fonction qui envoie une invitation à un utilisateur pour une organisation spécifique
export async function sendInvitationToUser(organisationId: string, email: string, role: string) {
  try {
    // 1. Récupérer l'utilisateur authentifié
    const session = await auth();
    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }
    const userId = session.user.id;

    // 2. Vérifier si l'organisation existe et récupérer son nom
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!organisation) {
      throw new Error("Organisation non trouvée");
    }

    const organisationName = organisation.name; // Nom de l'organisation

    // 3. Vérifier si l'invitation a déjà été envoyée à cet email
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        organisationId,
      },
    });

    if (existingInvitation) {
      throw new Error("Cet email a déjà été invité à rejoindre cette organisation");
    }

    // 4. Générer un token unique pour l'invitation
    const inviteToken = generateRandomToken();

    // 5. Créer un token de vérification dans la base de données
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: inviteToken,
        expires: new Date(Date.now() + 3600000), // Expiration dans 1 heure
      },
    });

    // 6. Vérification du rôle et conversion en valeur de l'énumération `Role`
    const validRoles = ['MEMBRE', 'ADMIN'];
    const roleUpper = role.toUpperCase();

    if (!validRoles.includes(roleUpper)) {
      throw new Error("Rôle invalide");
    }

    const roleEnum = roleUpper as 'MEMBRE' | 'ADMIN'; // Type casting explicite

    // 7. Créer l'invitation dans la base de données
    const invitation = await prisma.invitation.create({
      data: {
        email,
        role: roleEnum,  // Utiliser la valeur valide de l'énumération
        organisationId,
        invitedById: userId, // Associe l'utilisateur qui envoie l'invitation
        token: inviteToken,  // Ajoutez le token généré ici
        tokenExpiresAt: new Date(Date.now() + 3600000),  // Date d'expiration du token (1 heure)
      },
    });

    // 8. Vérifier si l'utilisateur existe déjà dans la base de données
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 9. Si l'utilisateur n'existe pas, le créer avec un mot de passe par défaut
    if (!user) {
      const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);  // Hachage du mot de passe par défaut

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword, // Utilisation du mot de passe haché par défaut
          role: roleEnum,  // Rôle passé dans l'invitation
          name: "",  // Vous pouvez ajouter des informations supplémentaires ici
          organisations: {
            connect: { id: organisationId },  // Lier l'utilisateur à l'organisation
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    // 10. Préparer l'email HTML avec la nouvelle structure
    let emailTemplate = `
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
            <p style="margin-bottom: 32px; line-height: 1.5;">Vous avez été invité à rejoindre l'organisation <strong>${organisationName}</strong> en tant que <strong>${roleEnum}</strong>.</p>
            <p style="margin-bottom: 32px; line-height: 1.5;">Pour finaliser votre inscription, vous devez vérifier votre adresse e-mail.</p>
            <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">Vérifier l'email</a>
            <p style="margin-bottom: 16px; color: #333;">Ou copiez et collez cette URL dans votre navigateur :</p>
            <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">https://erpht241.vercel.app/accept-invitation/${inviteToken}</a>
            <div style="margin-bottom: 32px;">
              ${!user ? `<p style="margin-bottom: 8px;">Votre mot de passe par défaut est :</p>
              <p style="font-family: monospace; font-size: 18px; margin: 0; color: #333;">${DEFAULT_PASSWORD}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 24px; margin: 0;">Si vous ne souhaitez pas vérifier votre email ou si vous n'avez pas demandé ceci, ignorez et supprimez ce message.</p>
        </div>
    </body>
    </html>
    `;

    // 11. Envoyer l'email d'invitation avec la structure HTML
    await sendMail({
      to: email,
      name: "HT241 Team",
      subject: "Invitation à rejoindre l'organisation",
      body: emailTemplate,
    });

    return { message: "Invitation envoyée avec succès." };
  } catch (error) {
    console.error("Erreur générée:", error);
    throw new Error("Une erreur s'est produite lors de l'envoi de l'invitation.");
  }
}
