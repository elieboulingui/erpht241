'use server';

import prisma from "@/lib/prisma";
import { Opportunity } from "@prisma/client";

interface CreateDealData {
  label: string;
  description?: string;
  amount?: number;
  merchantId?: string;
  contactId?: string;
  tags?: string[];
  tagColors?: string[];
  avatar?: string;
  deadline?: string;
  stepId: string;
  userId?: string;
}

type CreateDealResult =
  | { success: true; deal: Opportunity }
  | { success: false; error: string };

export async function createDeal(data: CreateDealData): Promise<CreateDealResult> {
  try {
    if (!data.label) throw new Error("Le champ 'label' est obligatoire.");

    // Vérifie l'existence de l'étape
    const step = await prisma.step.findUnique({ where: { id: data.stepId } });
    if (!step) throw new Error("L'étape spécifiée n'existe pas.");

    let merchantId = data.merchantId;

    // Si userId est fourni, récupérer ou créer un merchant
    if (data.userId) {
      const user = await prisma.user.findUnique({ where: { id: data.userId } });
      if (!user) throw new Error("L'utilisateur spécifié n'existe pas.");

      let merchant = await prisma.merchant.findUnique({ where: { id: data.userId } });

      if (!merchant) {
        merchant = await prisma.merchant.create({
          data: {
            id: data.userId,
            name: user.name ?? "Nom par défaut",
            role: user.role ?? "Rôle inconnu",
            email: user.email ?? "email@example.com",
            photo: user.image ?? "",
          },
        });
      }

      merchantId = merchant.id;
    }

    const opportunityData: any = {
      label: data.label,
      description: data.description ?? "",
      amount: data.amount ?? 0,
      merchant: merchantId ? { connect: { id: merchantId } } : undefined, // Updated to use "merchant" and connect the merchant by its ID// Keep as is for memberId, assuming it's correct
      avatar: data.avatar,
      stepId: data.stepId,
      deadline: data.deadline?.trim() ? new Date(data.deadline) : new Date(),
    };

    // Now create the new deal
    const newDeal = await prisma.opportunity.create({
      data: opportunityData,
    });

    return { success: true, deal: newDeal };
  } catch (error) {
    console.error("Erreur lors de la création de l'opportunité :", error);
    return {
      success: false,
      error: (error as Error).message ?? "Erreur lors de la création",
    };
  }
}
