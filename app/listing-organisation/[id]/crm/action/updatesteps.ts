'use server'

import prisma from '@/lib/prisma'

export async function updateDealdrage({
  id,
  stepId,
}: {
  id: string
  stepId: string
}) {
  try {
    const updatedDeal = await prisma.opportunity.update({
      where: { id },
      data: {
        stepId,
      },
    });

    return { success: true, deal: updatedDeal };
  } catch (error: any) {
    console.error('Error moving card:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}