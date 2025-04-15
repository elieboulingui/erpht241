"use server";

import { auth } from "@/auth";
import { generateRandomToken } from "@/lib/generateRandomToken";
import sendMail from "@/lib/sendmail";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AccessType } from "@prisma/client";

// Constants
const DEFAULT_PASSWORD = "password123";
const VALID_ROLES = ["MEMBRE", "ADMIN"];
const VALID_ACCESS_TYPES = ["READ", "WRITE", "ADMIN"];

// Validation helpers
function isValidRole(role: string): boolean {
  return VALID_ROLES.includes(role.toUpperCase());
}

function isValidAccessType(accessType: string): boolean {
  return VALID_ACCESS_TYPES.includes(accessType.toUpperCase());
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

async function createUserWithDefaultPassword(
  email: string,
  role: string,
  organisationId: string,
  accessType: string
) {
  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role.toUpperCase() as "MEMBRE" | "ADMIN",
      accessType: "READ",
      organisations: {
        connect: { id: organisationId },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

async function sendInvitationEmail(
  email: string,
  organisationName: string,
  role: string,
  accessType: string,
  inviteToken: string
) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation à rejoindre l'organisation</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 40px; border-radius: 8px;">
            <h1 style="text-align: center;">Invitation à rejoindre ${organisationName}</h1>
            <p>Bonjour ${email},</p>
            <p>Vous avez été invité à rejoindre l'organisation <strong>${organisationName}</strong> en tant que <strong>${role}</strong> avec un accès de type <strong>${accessType}</strong>.</p>
            <p>Pour finaliser votre inscription :</p>
            <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}" style="display:inline-block;padding:12px 24px;background:#000;color:white;text-decoration:none;border-radius:4px;">Vérifier l'email</a>
            <p>Ou copiez ce lien :</p>
            <a href="https://erpht241.vercel.app/accept-invitation/${inviteToken}">https://erpht241.vercel.app/accept-invitation/${inviteToken}</a>
            <p>Mot de passe par défaut : <code>${DEFAULT_PASSWORD}</code></p>
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

// ✅ MAIN FUNCTION
export async function sendInvitationToUser(
  organisationId: string,
  email: string,
  role: string,
  accessType: string
) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Utilisateur non authentifié");
    }

    const userId = session.user.id;

    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation non trouvée");
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        organisationId,
      },
    });

    if (existingInvitation) {
      console.log("Invitation déjà envoyée, nouvelle invitation sera renvoyée.");
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!isValidRole(role)) {
      throw new Error("Rôle invalide");
    }

    if (!isValidAccessType(accessType)) {
      accessType = "READ";
      console.warn("Access type is invalid or missing, defaulting to 'READ'");
    }

    const inviteToken = generateRandomToken();

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: inviteToken,
        expires: new Date(Date.now() + 3600000),
      },
    });

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role: role.toUpperCase() as "MEMBRE" | "ADMIN",
        organisationId,
        invitedById: userId,
        token: inviteToken,
        accessType: accessType.toUpperCase() as AccessType,
        tokenExpiresAt: new Date(Date.now() + 3600000),
      },
    });

    if (!user) {
      user = await createUserWithDefaultPassword(email, role, organisationId, accessType);
    }

    await sendInvitationEmail(email, organisation.name, role, accessType, inviteToken);

    // ✅ Log activity
    await prisma.activityLog.create({
      data: {
        action: "INVITATION_ENVOYÉE",
        entityType: "invitation",
        entityId: invitation.id,
        userId: userId,
        organisationId: organisationId,
        createdByUserId: userId,
        newData: {
          email,
          role,
          accessType,
        },
      },
    });

    return { message: "Invitation envoyée avec succès." };
  } catch (error) {
    console.error("Erreur générée:", error);
    throw new Error("Une erreur s'est produite lors de l'envoi de l'invitation");
  }
}
