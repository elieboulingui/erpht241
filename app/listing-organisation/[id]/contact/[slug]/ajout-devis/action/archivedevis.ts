// app/actions/archiveDevis.ts

import  prisma  from '@/lib/prisma' // Assuming you're using Prisma for database interaction

// Server action to archive a devis (mark isArchived as true)
export async function archiveDevis(devisId: string) {
  try {
    if (!devisId) {
      throw new Error('Devis ID is required')
    }

    // Assuming 'devis' is the table you're updating
    const archivedDevis = await prisma.devis.update({
      where: {
        id: devisId,
      },
      data: {
        isArchived: true, // Mark the devis as archived
      },
    })

    return {
      success: true,
      message: `Devis with ID ${devisId} has been archived.`,
      archivedDevis,
    }
  } catch (error) {
    console.error('Error archiving devis:', error)
    return {
      success: false,
      message: 'Failed to archive the devis.',
     
    }
  }
}
