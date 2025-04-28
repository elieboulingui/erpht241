// inngest/functions/user/role-and-access-updated.ts
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";

export const roleAndAccessUpdatedHandler = inngest.createFunction(
  {
      name: "Role and Access Updated - Activity Log",
      id: ""
  },
  { event: "user/role-and-access-updated" },
  async ({ event, step }: { event: any; step: any }) => {
    const {
      userId,
      organisationId,
      oldRole,
      oldAccessType,
      newRole,
      newAccessType,
    } = event.data;

    await prisma.activityLog.create({
      data: {
        action: "ROLE_OU_ACCES_MODIFIÉ",
        entityType: "user",
        entityId: userId,
        userId: userId,
        organisationId: organisationId,
        createdByUserId: userId, // Peut être remplacé si l'action vient d’un admin
        oldData: { role: oldRole, accessType: oldAccessType },
        newData: { role: newRole, accessType: newAccessType },
        createdAt: new Date(),
      },
    });

    return { success: true };
  }
);
