"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function deleteDealStage(stageId: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Non authentifié");

    const {
      id: userId,
      name: userName,
      role: userRole,
      organisationId
    } = session.user;

    const existingStage = await prisma.step.findUnique({
      where: { id: stageId },
    });

    if (!existingStage) throw new Error("Étape introuvable");

    await prisma.step.delete({ where: { id: stageId } });

    console.log("➡️ Envoi Inngest dealStage/deleted");

    await inngest.send({
      name: "dealStage/deleted",
      data: {
        stageId,
        userId, // ✅ identifiant correct pour la clé étrangère
        userName,
        userRole,
        deletedAt: new Date().toISOString(),
        organisationId,
        oldData: existingStage,
      },
    });

    console.log("✅ Événement envoyé à Inngest");

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw new Error("Suppression échouée");
  }
}
