'use server';

import prisma from "@/lib/prisma";

export async function updateDeal(data: {
  id: string;
  label: string;
  description?: string;
  amount: number;
  merchantId: string;
  avatar?: string;
  deadline?: string;
  stepId?: string;
}) {
  try {
    // Vérifiez si l'opportunité existe avant de tenter la mise à jour
    const existingDeal = await prisma.opportunity.findUnique({
      where: { id: data.id },
    });

    if (!existingDeal) {
      throw new Error("L'opportunité à mettre à jour n'existe pas.");
    }

    // Mise à jour de l'opportunité
    const updatedDeal = await prisma.opportunity.update({
      where: {
        id: data.id,
      },
      data: {
        label: data.label,
        description: data.description,
        amount: data.amount,
        merchantId: data.merchantId,
        avatar: data.avatar,
        deadline:data.deadline
      },
    });

    return { success: true, deal: updatedDeal };
  } catch (error:any) {
    console.error("Erreur lors de la mise à jour du deal:", error);
    return { success: false, error: error.message || error };
  }
}
