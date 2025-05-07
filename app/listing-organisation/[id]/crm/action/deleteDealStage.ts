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
      organisationId,
    } = session.user;

    console.log("🔍 Suppression de l'étape :", stageId, "pour l'organisation :", organisationId);

    // Vérifie que l'étape appartient bien à l'organisation de l'utilisateur
    const existingStage = await prisma.step.findFirst({
      where: {
        id: stageId,
        organisationId,
      },
    });

    if (!existingStage) throw new Error("Étape introuvable");

    // Gérer les opportunités liées à cette étape
    const opportunitiesLinked = await prisma.opportunity.findMany({
      where: {
        stepId: stageId,
      },
    });

    if (opportunitiesLinked.length > 0) {
      console.log("➡️ Suppression des opportunités liées à cette étape");

      // Supprimer les opportunités liées à l'étape
      await prisma.opportunity.deleteMany({
        where: {
          stepId: stageId,
        },
      });
    }

    // Supprimer l'étape
    await prisma.step.delete({
      where: {
        id: stageId,
      },
    });

    console.log("➡️ Envoi Inngest dealStage/deleted");

    await inngest.send({
      name: "dealStage/deleted",
      data: {
        stageId,
        userId,
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
