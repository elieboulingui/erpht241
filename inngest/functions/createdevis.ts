// services/inngest.ts

import { inngest } from "@/inngest/client";  // Importation de l'API Inngest
import prisma from "@/lib/prisma";  // Client Prisma pour interagir avec ta base de données
import axios from "axios";

// Fonction Inngest pour traiter l'événement "activity/devis.created"
export const logDevisCreatedmannuellement = inngest.createFunction(
  { id: 'devis-created', name: 'Devis Created' },  // ID et nom de la fonction
  { event: 'activity/devis.created' },  // L'événement auquel cette fonction est associée
  async ({ event }) => {
    try {
      // Extraction des données de l'événement
      const { action, entityType, entityId, entityName, oldData, newData, userId, ipAddress, userAgent, actionDetails } = event.data;

      console.log("Handling devis creation event:", event.data);  // Log pour débogage

      // Créer un log d'activité dans la base de données via Prisma
      await prisma.activityLog.create({
        data: {
          action,  // Action effectuée (devis créé)
          entityType,  // Type de l'entité (ici, Devis)
          entityId,  // ID de l'entité (ID du devis)
          entityName,  // Nom de l'entité (Numéro du devis)
          oldData: JSON.stringify(oldData),  // Données avant la création (vide ici)
          newData: JSON.stringify(newData),  // Données après la création
          createdByUserId: userId,  // ID de l'utilisateur ayant créé le devis
          ipAddress,  // Adresse IP de la requête
          userAgent,  // User-Agent de la requête
          actionDetails,  // Détails supplémentaires sur l'action
          createdAt: new Date(),  // Date de création du log
        },
      });

      // Si on veut récupérer l'adresse IP à partir d'une API externe (ipify), on peut aussi le faire
      const ipifyResponse = await axios.get("https://api.ipify.org?format=json");
      const ip = ipifyResponse.data.ip;
      
      // Si tu souhaites ajouter l'IP récupérée de manière externe
      await prisma.activityLog.update({
        where: { id: event.data.entityId },  // On suppose que le log a été créé avec un ID unique
        data: { ipAddress: ip },
      });

      console.log("Activity log created successfully for devis creation:", entityId);  // Log pour débogage

      return { message: "Activity log created successfully" };  // Retourner un message de succès
    } catch (error) {
      console.error("Error logging devis creation:", error);  // Log des erreurs
      throw error;  // Relancer l'erreur si elle se produit
    }
  }
);
