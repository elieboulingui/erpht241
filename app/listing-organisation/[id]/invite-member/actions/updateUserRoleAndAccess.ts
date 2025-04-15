"use server";
import prisma from "@/lib/prisma";
import { Role, AccessType } from "@prisma/client";

// Fonction pour mettre à jour le rôle et le type d'accès d'un utilisateur
export async function updateUserRoleAndAccess(
  userId: string,
  organisationId: string,
  newRole: Role,
  newAccessType: AccessType
) {
  if (!userId || !organisationId || !newRole || !newAccessType) {
    throw new Error("Tous les paramètres (userId, organisationId, newRole, newAccessType) sont requis.");
  }

  try {
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
      include: {
        members: true,
      },
    });

    if (!organisation) {
      throw new Error("Organisation non trouvée.");
    }

    const isUserMember = organisation.members.some(member => member.id === userId);

    if (!isUserMember) {
      throw new Error("L'utilisateur n'est pas membre de cette organisation.");
    }

    // Récupérer l'utilisateur avant la mise à jour pour stocker les anciennes valeurs
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        accessType: true,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
        accessType: newAccessType,
        updatedAt: new Date(),
      },
    });

    // Enregistrement dans le journal d'activité
    await prisma.activityLog.create({
      data: {
        action: "ROLE_OU_ACCES_MODIFIÉ",
        entityType: "user",
        entityId: userId,
        userId: userId, // utilisateur concerné
        organisationId: organisationId,
        createdByUserId: userId, // tu peux remplacer ça par le vrai utilisateur initiateur si besoin
        oldData: {
          role: existingUser?.role,
          accessType: existingUser?.accessType,
        },
        newData: {
          role: newRole,
          accessType: newAccessType,
        },
      },
    });

    return updatedUser;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du rôle et du type d'accès de l'utilisateur:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error(`Erreur serveur lors de la mise à jour: ${error.message}`);
  }
}
