"use server";

import { auth } from "@/auth";
import { generateRandomToken } from "@/lib/generateRandomToken";
import sendMail from "@/lib/sendmail";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AccessType } from '@prisma/client';

// Constants
const DEFAULT_PASSWORD = "password123"; // Default password for new users
const VALID_ROLES = ['MEMBRE', 'ADMIN']; // Valid roles
const VALID_ACCESS_TYPES = ['READ', 'WRITE', 'ADMIN']; // Valid access types

// Enum validation functions
function isValidRole(role: string): boolean {
  return VALID_ROLES.includes(role.toUpperCase());
}

function isValidAccessType(accessType: string): boolean {
  return VALID_ACCESS_TYPES.includes(accessType.toUpperCase());
}

// Utility function to hash a password
async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

// Create a user with default password and assign the specified access type
async function createUserWithDefaultPassword(email: string, role: string, organisationId: string, accessType: string) {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role.toUpperCase() as 'MEMBRE' | 'ADMIN', // Ensure role is valid
      accessType: "READ",  // Ensure access type is valid
      organisations: {
        connect: { id: organisationId },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

// Send an invitation email to the user
async function sendInvitationEmail(email: string, organisationName: string, role: string, accessType: string, inviteToken: string) {
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
            <p style="margin-bottom: 32px; line-height: 1.5;">Vous avez été invité à rejoindre l'organisation <strong>${organisationName}</strong> en tant que <strong>${role}</strong> avec un accès de type <strong>${accessType}</strong>.</p>
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

// Main function to send invitation
export async function sendInvitationToUser(organisationId: string, email: string, role: string, accessType: string) {
  try {
    // Verify if the user is authenticated
    const session = await auth();
    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const userId = session.user.id;

    // Verify if the organisation exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!organisation) {
      throw new Error("Organisation non trouvée");
    }

    // Check if the invitation has already been sent
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        organisationId,
      },
    });
    if (existingInvitation) {
      console.log("Invitation déjà envoyée, nouvelle invitation sera renvoyée.");
    }

    // Check if the user exists in the database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // Validate role and access type
    if (!isValidRole(role)) {
      throw new Error("Rôle invalide");
    }
    if (!isValidAccessType(accessType)) {
      accessType = "READ";  // Default to READ if invalid or empty
      console.warn("Access type is invalid or missing, defaulting to 'READ'");
    }

    // Generate an invitation token
    const inviteToken = generateRandomToken();

    // Create the verification token for email confirmation
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: inviteToken,
        expires: new Date(Date.now() + 3600000), // Expiration in 1 hour
      },
    });

    // Create the invitation with the correct access type
 // Create the invitation with the correct access type
await prisma.invitation.create({
  data: {
    email,
    role: role.toUpperCase() as 'MEMBRE' | 'ADMIN', // Ensure valid role
    organisationId,
    invitedById: userId,
    token: inviteToken,
    accessType: accessType.toUpperCase() as 'READ' | 'WRITE' | 'ADMIN', // Use 'accessType' instead of 'AccessType'
    tokenExpiresAt: new Date(Date.now() + 3600000), // 1 hour expiration
  },
});


    // Create the user if they don't exist
    if (!user) {
      user = await createUserWithDefaultPassword(email, role, organisationId, accessType);
    }

    // Send the invitation email
    await sendInvitationEmail(email, organisation.name, role, accessType, inviteToken);

    return { message: "Invitation envoyée avec succès." };
  } catch (error) {
    console.error("Erreur générée:", error);
    throw new Error("Une erreur s'est produite lors de l'envoi de l'invitation");
  }
}
