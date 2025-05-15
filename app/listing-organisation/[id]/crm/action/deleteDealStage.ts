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

    // Récupérer l'étape à supprimer
    const existingStage = await prisma.step.findFirst({
      where: {
        id: stageId,
        organisationId,
      },
    });

    if (!existingStage) throw new Error("Étape introuvable");

    const stepNumberToDelete = existingStage.stepNumber;

    // Supprimer les opportunités liées
    const opportunitiesLinked = await prisma.opportunity.findMany({
      where: {
        stepId: stageId,
      },
    });

    if (opportunitiesLinked.length > 0) {
      console.log("➡️ Suppression des opportunités liées à cette étape");
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

    console.log("➡️ Réorganisation des étapes suivantes");

    // Mettre à jour les étapes suivantes
    await prisma.step.updateMany({
      where: {
        organisationId,
        stepNumber: {
          gt: stepNumberToDelete,
        },
      },
      data: {
        stepNumber: {
          decrement: 1,
        },
      },
    });

    // Envoyer l'événement Inngest
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

    console.log("✅ Étape supprimée et étapes réordonnées");

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur:", error);
    throw new Error("Suppression échouée");
  }
}
