'use server';

import  prisma  from "@/lib/prisma";

export async function updateDeal(data: {
  id: string;
  label: string;
  description?: string;
  amount: number;
  merchantId: string;
  tags?: string[];
  tagColors?: string[];
  avatar?: string;
  deadline?: string;
  stepId?: string;
}) {
  try {
    const updatedDeal = await prisma.opportunity.update({
      where: {
        id: data.id,
      },
      data: {
        label: data.label,
        description: data.description,
        amount: data.amount,
        merchantId: data.merchantId,
        tags: data.tags,
        tagColors: data.tagColors,
        avatar: data.avatar,
        deadline: data.deadline,
        stepId: data.stepId,
      },
    });

    return { success: true, deal: updatedDeal };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du deal:", error);
    return { success: false, error };
  }
}
