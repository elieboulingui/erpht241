import { inngest } from '@/inngest/client';
import prisma from '@/lib/prisma';

export const categoryArchivedAll = inngest.createFunction(
  { id: 'category-archived-activity-log' },
  { event: 'category/archived-all' },
  async ({ event }) => {
    const { userId, organisationId, updatedCount, timestamp } = event.data;

    // Récupérer l'adresse IP via l'API ipify
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ip = data.ip; // L'adresse IP récupérée

    // Créer l'entrée dans l'Activity Log avec l'adresse IP
    await prisma.activityLog.create({
      data: {
        action: 'ARCHIVE_ALL_CATEGORIES',
        entityType: 'Category',
        entityId: organisationId,
        newData: JSON.stringify({ isArchived: true }), // Nouvelles données pour l'archivage
        userId,
        organisationId,
        createdAt: new Date(timestamp),
        actionDetails: `Archivage de ${updatedCount} catégorie(s) pour l'organisation ${organisationId}.`,
        ipAddress: ip, // Ajout de l'adresse IP dans le log
      },
    });

    return { status: 'archived_logged' };
  }
);
