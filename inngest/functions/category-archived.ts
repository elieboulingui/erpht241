import { inngest } from '@/inngest/client';
import prisma from '@/lib/prisma';

export const categoryArchivedAll = inngest.createFunction(
  { id: 'category-archived-activity-log' },
  { event: 'category/archived-all' },
  async ({ event }) => {
    const { userId, organisationId, updatedCount, timestamp } = event.data;

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
      },
    });

    return { status: 'archived_logged' };
  }
);
