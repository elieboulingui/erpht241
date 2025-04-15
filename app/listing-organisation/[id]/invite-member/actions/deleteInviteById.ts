"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function archiveInviteByEmail(email: string, organisationId: string) {
  const session = await auth(); // ← Attendre la session
  const userId = session?.user?.id; // ← Adapter selon la structure de ton auth()

  if (!userId) {
    throw new Error("Non autorisé : utilisateur non authentifié.");
  }

  const invitation = await prisma.invitation.findUnique({
    where: {
      email_organisationId: {
        email,
        organisationId,
      },
    },
  });

  if (!invitation) {
    throw new Error("Invitation non trouvée pour cet email et cette organisation.");
  }

  const archivedInvite = await prisma.invitation.update({
    where: { id: invitation.id },
    data: {
      isArchived: true,
      archivedAt: new Date(),
      archivedBy: organisationId,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "archive_invite",
      entityType: "Invitation",
      entityId: invitation.id,
      oldData: invitation,
      newData: archivedInvite,
      userId,
      createdByUserId: userId,
      organisationId,
      invitationId: invitation.id,
      createdAt: new Date(),
    },
  });

  return archivedInvite;
}
