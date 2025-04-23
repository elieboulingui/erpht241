"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
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

  // Archive l'invitation
  const archivedInvite = await prisma.invitation.update({
    where: { id: invitation.id },
    data: {
      isArchived: true,
      archivedAt: new Date(),
      archivedBy: organisationId,
    },
  });

  // Envoie l'événement à Inngest pour enregistrer un log d'activité
  await inngest.send({
    name: "invite/archived", // Nom de l'événement
    data: {
      invitationId: invitation.id,
      userId,
      organisationId,
      oldData: invitation,
      newData: archivedInvite,
    },
  });

  return archivedInvite;
}
