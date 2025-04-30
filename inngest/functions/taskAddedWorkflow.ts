import axios from 'axios'
import prisma from '@/lib/prisma' // Assurez-vous d'importer correctement votre instance Prisma
import { inngest } from "@/inngest/client"

// Type explicite pour l'événement
interface FavoriteAddedEvent {
  userId: string
  activity: string
  taskId: string
  taskType: string
  taskStatus: string
  taskPriority: string
  organisationId: string
}

// Fonction pour obtenir l'IP publique
async function fetchPublicIP(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  } catch (error) {
    console.error('Error fetching IP:', error)
    return 'Unknown IP'
  }
}

// Créez un workflow pour l'événement activity/favorite.added
export const taskAddedWorkflow = inngest.createFunction(
  {
    name: 'Log favorite activity when a task is created',
    id: 'favorite-added-log', // Assurez-vous d'ajouter un ID unique pour la fonction
  },
  { event: 'activity/task.added' }, // Spécifiez l'événement qui déclenche ce workflow
  async ({ event }: { event: FavoriteAddedEvent }) => { // Typage explicite de l'événement
    const { userId, activity, taskId, taskType, taskStatus, taskPriority, organisationId } = event

    // Récupération de l'adresse IP publique de l'utilisateur
    const userIp = await fetchPublicIP()

    // Enregistrement de l'activité dans la base de données via Prisma
    try {
      const activityLog = await prisma.activityLog.create({
        data: {
          action: 'FAVORITE_ADDED', // L'action peut être une valeur définie comme 'FAVORITE_ADDED'
          entityType: 'Task', // L'entité concernée est de type 'Task'
          entityId: taskId, // ID de la tâche concernée
          actionDetails: `Task with ID ${taskId} marked as favorite`, // Détails de l'action
          userId, // L'ID de l'utilisateur qui a effectué l'action
          ipAddress: userIp, // L'IP de l'utilisateur
          organisationId, // L'ID de l'organisation
          createdAt: new Date(),
          entityName: 'Task', // Nom de l'entité (facultatif)
        },
      })

      console.log('Favorite activity logged successfully with IP:', userIp)
      return { message: 'Favorite activity logged successfully.', activityLog }
    } catch (dbError) {
      console.error('Error saving activity log:', dbError)
      throw new Error('Failed to log activity in the database.')
    }
  }
)
