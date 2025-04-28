import { inngest } from '@/inngest/client';
import prisma from '@/lib/prisma';

export const categoryArchivedAll = inngest.createFunction(
  { id: 'category-archived-activity-log' },
  { event: 'category/archived-all' },
  async ({ event }) => {
    const { userId, organisationId, updatedCount, timestamp, ipAddress } = event.data;

    // Crée un log d'activité dans Prisma, incluant l'adresse IP
    await prisma.activityLog.create({
      data: {
        action: 'ARCHIVE_ALL_CATEGORIES',
        entityType: 'Category',
        entityId: organisationId,
        newData: { isArchived: true },
        userId,
        organisationId,
        createdAt: new Date(timestamp),
        actionDetails: `Archivage de ${updatedCount} catégorie(s) pour l'organisation ${organisationId}.`,
        ipAddress,  // Ajoute l'adresse IP dans le log
      },
    });

    return { status: 'archived_logged' };
  }
);
