"use server"
import prisma from "@/lib/prisma"; 
import { Role, AccessType } from "@prisma/client"; // Cela importe directement les énumérations de Prisma

// Fonction pour mettre à jour le rôle et le type d'accès d'un utilisateur
export async function updateUserRoleAndAccess(userId: string, organisationId: string, newRole: Role, newAccessType: AccessType) {
  if (!userId || !organisationId || !newRole || !newAccessType) {
    throw new Error("Tous les paramètres (userId, organisationId, newRole, newAccessType) sont requis.");
  }

  try {
    // Vérifier si l'utilisateur appartient à l'organisation
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
      include: {
        members: true, // Inclure tous les membres de l'organisation
      },
    });

    if (!organisation) {
      throw new Error("Organisation non trouvée.");
    }

    // Vérifier si l'utilisateur est bien un membre de l'organisation
    const isUserMember = organisation.members.some(member => member.id === userId);

    if (!isUserMember) {
      throw new Error("L'utilisateur n'est pas membre de cette organisation.");
    }

    // Mettre à jour le rôle et le type d'accès de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: newRole,
        accessType: newAccessType,
      },
    });

    // Retourner l'utilisateur mis à jour
    return updatedUser;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du rôle et du type d'accès de l'utilisateur:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error(`Erreur serveur lors de la mise à jour: ${error.message}`);
  }
}
