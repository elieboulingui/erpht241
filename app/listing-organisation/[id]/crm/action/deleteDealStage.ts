"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function deleteDealStage(stageId: string) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Non authentifié");

    const { id: userId, name: userName, role: userRole } = session.user;

    // Récupérer l'étape et son organisationId à partir du stageId
    const existingStage = await prisma.step.findFirst({
      where: {
        id: stageId,
      },
      select: {
        id: true,
        stepNumber: true,
        organisationId: true,  // Récupérer organisationId ici
      },
    });

    if (!existingStage) throw new Error("Étape introuvable");

    const { organisationId, stepNumber: stepNumberToDelete } = existingStage;

    console.log("🔍 Suppression de l'étape :", stageId, "pour l'organisation :", organisationId);

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

    // Mettre à jour les étapes suivantes sans entrer en conflit avec les contraintes d'unicité
    const stepsToUpdate = await prisma.step.findMany({
      where: {
        organisationId,
        stepNumber: { gt: stepNumberToDelete },
      },
    });

    // Mise à jour des étapes suivantes avec des numéros uniques
    await Promise.all(
      stepsToUpdate.map((step, index) =>
        prisma.step.update({
          where: { id: step.id },
          data: { stepNumber: stepNumberToDelete + index + 1 },
        })
      )
    );

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
