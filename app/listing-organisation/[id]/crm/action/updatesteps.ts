'use server'

import prisma from '@/lib/prisma'

export async function updateDealdrages({
  id,
  stepId,
}: {
  id: string
  stepId: string
}) {
  try {
    // 1. Récupérer l'étape cible à déplacer
    const currentStep = await prisma.step.findUnique({
      where: { id },
      include: { opportunities: true }, // On récupère aussi les opportunités liées
    })

    if (!currentStep) {
      return {
        success: false,
        error: 'Étape non trouvée',
      }
    }

    // 2. Récupérer l'étape avec le `stepId` cible pour la mise à jour
    const targetStep = await prisma.step.findUnique({
      where: { id: stepId },
    })

    if (!targetStep) {
      return {
        success: false,
        error: 'Étape cible non trouvée',
      }
    }

    // 3. Vérifier si la réorganisation est nécessaire
    if (currentStep.stepNumber === targetStep.stepNumber) {
      return {
        success: false,
        error: 'Les étapes sont déjà dans la même position',
      }
    }

    // 4. Mettre à jour les autres étapes (réajustement du `stepNumber` pour éviter les doublons)
    const allSteps = await prisma.step.findMany({
      where: { organisationId: currentStep.organisationId },
      orderBy: { stepNumber: 'asc' },
    })

    const targetStepIndex = allSteps.findIndex(step => step.id === targetStep.id)

    // Si on déplace une étape vers une position plus élevée (plus bas dans la liste)
    if (currentStep.stepNumber > targetStep.stepNumber) {
      await prisma.step.updateMany({
        where: {
          organisationId: currentStep.organisationId,
          stepNumber: { gte: targetStep.stepNumber, lt: currentStep.stepNumber },
        },
        data: {
          stepNumber: { increment: 1 },
        },
      })
    }
    // Si on déplace une étape vers une position plus basse (plus haut dans la liste)
    else {
      await prisma.step.updateMany({
        where: {
          organisationId: currentStep.organisationId,
          stepNumber: { gt: currentStep.stepNumber, lte: targetStep.stepNumber },
        },
        data: {
          stepNumber: { decrement: 1 },
        },
      })
    }

    // 5. Mettre à jour le `stepNumber` de l'étape cible
    const updatedStep = await prisma.step.update({
      where: { id },
      data: {
        stepNumber: targetStep.stepNumber,
      },
    })

    return { success: true, deal: updatedStep }
  } catch (error: any) {
    console.error('Erreur lors du changement de step:', error)
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
    }
  }
}
