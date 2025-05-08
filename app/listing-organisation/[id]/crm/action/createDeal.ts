'use server';

import prisma from "@/lib/prisma";
import { Opportunity } from "@prisma/client";

interface CreateDealData {
  label: string;
  description?: string;
  amount: number;
  merchantId: string;
  contactId: string;
  tags: string[];
  tagColors: string[];
  avatar?: string;
  deadline?: string; // deadline est maintenant optionnel
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
    if (!data.stepId) {
      throw new Error("Le champ 'stepId' est obligatoire.");
    } else if (!data.merchantId) {
      throw new Error("Le champ 'merchantId' est obligatoire.");
    } 
    

    // Vérification que l'étape existe
    const step = await prisma.step.findUnique({
      where: { id: data.stepId },
    });

    if (!step) {
      throw new Error("L'étape spécifiée n'existe pas.");
    }

    // Vérification que le contact existe
    const contact = await prisma.contact.findUnique({
      where: { id: data.contactId },
    });

    if (!contact) {
      throw new Error("Le contact spécifié n'existe pas.");
    }

    // Assurez-vous que deadline est soit une string, soit une date valide (ou une date par défaut)
    const deadline = data.deadline ? new Date(data.deadline) : new Date(); // Date actuelle par défaut

    // Création de l'opportunité
    const newDeal = await prisma.opportunity.create({
      data: {
        label: data.label,
        description: data.description ?? "",
        amount: data.amount,
        merchantId: data.merchantId,
        contactId: data.contactId,  // Lien avec le contact
        tags: data.tags,
        tagColors: data.tagColors,
        avatar: data.avatar,
        deadline: deadline,  // On passe la date (ou la date actuelle par défaut)
        stepId: data.stepId,
      },
    });

    return {
      success: true,
      deal: newDeal,
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'opportunité :", error);
    return {
      success: false,
      error: (error as Error).message ?? "Erreur lors de la création",
    };
  }
}