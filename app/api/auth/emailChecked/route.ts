import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ 
    where: { email },
    select: {
      id: true, // Pour lier l'entrée à l'utilisateur
      email: true,
      role: true,
      organisations: {
        select: {
          id: true, // Pour potentiellement lier à une organisation
        }
      },
    }
  });

  if (user) {
    const invitations = await prisma.invitation.findMany({
      where: {
        email: user.email,
        acceptedAt: null,
      },
    });

    if (invitations.length > 0) {
      await prisma.invitation.updateMany({
        where: {
          email: user.email,
          acceptedAt: null,
        },
        data: {
          acceptedAt: new Date(),
        },
      });
    }

    const hasOrganization = user.organisations.length > 0;
    const organisationId = hasOrganization ? user.organisations[0].id : null;

    // ➕ Création du log d'activité
    await prisma.activityLog.create({
      data: {
        action: "LOGIN",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        organisationId: organisationId,
        actionDetails: `L'utilisateur ${user.email} s'est connecté.`,
        entityName: user.email,
        // ipAddress et userAgent à ajouter si tu les récupères dans la requête
      },
    });

    return NextResponse.json({ 
      exists: true, 
      invitationsAccepted: invitations.length > 0,
      role: user.role,
      hasOrganization,
    });
  }

  return NextResponse.json({ exists: false });
}
