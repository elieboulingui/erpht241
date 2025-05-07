'use server';

import prisma from "@/lib/prisma";

export async function deleteDeal(id: string) {
  try {
    // Attempt to delete the deal
    const deletedDeal = await prisma.opportunity.delete({
      where: {
        id: id,
      },
    });

    return { success: true, deal: deletedDeal };
  } catch (error) {
    console.error("Erreur lors de la suppression du deal:", error);
    return { success: false, error };
  }
}
