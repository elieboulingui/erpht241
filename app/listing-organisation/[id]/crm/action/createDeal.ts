'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Opportunity } from "@prisma/client"; // ✅ Import du type généré par Prisma

interface CreateDealData {
  label: string;
  description?: string;
  amount: number;
  merchantId: string;
  tags: string[];
  tagColors: string[];
  avatar?: string;
  deadline?: string;
  stepId: string;
}

type CreateDealResult =
  | {
      success: true;
      deal: Opportunity;
    }
  | {
      success: false;
      error: string;
    };

export async function createDeal(data: CreateDealData): Promise<CreateDealResult> {
  try {
    if (!data.stepId || !data.merchantId) {
      throw new Error("Les champs stepId et merchantId sont obligatoires.");
    }

    const newDeal = await prisma.opportunity.create({
      data: {
        label: data.label,
        description: data.description ?? "",
        amount: data.amount,
        merchantId: data.merchantId,
        tags: data.tags,
        tagColors: data.tagColors,
        avatar: data.avatar ?? "",
        deadline: data.deadline ? new Date(data.deadline) : new Date(),
        stepId: data.stepId,
      },
    });

    console.log(newDeal);

    return {
      success: true,
      deal: newDeal,
    };
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    return {
      success: false,
      error: (error as Error).message ?? "Erreur lors de la création",
    };
  }
}
