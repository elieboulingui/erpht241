'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateDealData {
  label: string;
  description?: string;
  amount: number;
  merchantId: string;
  tags: string[];
  tagColors: string[];
  avatar?: string;
  deadline?: string;
  stepId: string; // <-- requis par le modèle
}

export async function createDeal(data: CreateDealData) {
  try {
    const newDeal = await prisma.opportunity.create({
      data: {
        label: data.label ,
        description: data.description ?? "",
        amount: data.amount,
        merchantId: data.merchantId,
        tags: data.tags,
        tagColors: data.tagColors,
        avatar: data.avatar,
        deadline: data.deadline ? new Date(data.deadline) : new Date(), // valeur par défaut
        stepId: data.stepId, // <-- requis ici
      },
    });

    revalidatePath('/deals');

    return {
      success: true,
      deal: newDeal,
    };
  } catch (error) {
    console.error("Erreur lors de la création :", error);

    return {
      success: false,
      error: "Erreur lors de la création",
    };
  }
}
