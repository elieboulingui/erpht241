"use server";
import prisma from '@/lib/prisma';

type ReorderStepsParams = {
  organisationId: string;
  from: number;
  to: number;
};

export async function reorderSteps({ organisationId, from, to }: ReorderStepsParams) {
  try {
    if (from === to) return { success: true };

    const steps = await prisma.step.findMany({
      where: { organisationId },
      orderBy: { stepNumber: 'asc' },
    });

    console.log('from:', from, 'to:', to);
    console.log('steps:', steps.map(s => ({ id: s.id, stepNumber: s.stepNumber })));

    // Récupérer les deux étapes à échanger
    const stepFrom = steps.find(s => s.stepNumber === from);
    const stepTo = steps.find(s => s.stepNumber === to);

    if (!stepFrom || !stepTo) {
      throw new Error("Une des étapes à échanger est introuvable");
    }
    // Échange des stepNumber via une transaction
    await prisma.$transaction([
      prisma.step.update({
        where: { id: stepFrom.id },
        data: { stepNumber: -1 }, // Valeur temporaire pour éviter conflit unique
      }),
      prisma.step.update({
        where: { id: stepTo.id },
        data: { stepNumber: from },
      }),
      prisma.step.update({
        where: { id: stepFrom.id },
        data: { stepNumber: to },
      }),
    ]);

    console.log(`✅ Étapes échangées : ${from} ⇄ ${to}`);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur lors de l’échange des étapes :', error);
    return { success: false, error: error.message };
  }
}
