"use server"

import { Contact, MeetingType, User } from "@prisma/client";
import prisma from "@/lib/prisma";

// Définition de l'interface Meeting avec les relations
interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  description: string | null;
  type: MeetingType;
  status: string;
  createdAt: Date;
  contactId: string;
  contact: Contact;  // Relation vers le contact
  participants: User[];  // Relation vers les participants
}

// Type partiel pour les données de la réunion, permettant de passer des IDs de participants
type PartialMeeting = Partial<Meeting> & {
  participants?: string[];  // Tableau d'IDs de participants
};

// Fonction pour mettre à jour une réunion
const updateMeeting = async (
  id: string, 
  data: PartialMeeting
): Promise<Meeting> => {
  try {
    const { participants, contactId, ...rest } = data;  // Extraire les données à mettre à jour

    // Création de l'objet de mise à jour pour Prisma
    const updateData: any = {
      ...rest,  // Champs simples comme title, date, etc.

      // Si un contactId est fourni, connecter le contact à la réunion
      ...(contactId && {
        contact: {
          connect: { id: contactId },  // Connecte le contact via son ID
        },
      }),

      // Si des participants sont fournis, mettre à jour la liste des participants
      ...(participants && participants.length > 0 && {
        participants: {
          set: participants.map((participantId) => ({
            id: participantId,  // Connecte chaque participant via son ID
          })),
        },
      }),
    };

    // Afficher les données de mise à jour dans la console avant d'effectuer la mise à jour
    console.log("Données de mise à jour de la réunion :", updateData);

    // Effectuer la mise à jour de la réunion dans la base de données
    const updatedMeeting = await prisma.meeting.update({
      where: { id },  // Identifie la réunion à mettre à jour par son ID
      data: updateData,  // Données à mettre à jour
      include: {  // S'assurer que le contact et les participants sont renvoyés dans le résultat
        contact: true,
        participants: true,
      }
    });

    // Retourner la réunion mise à jour avec les participants et le contact
    return updatedMeeting;

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réunion :", error);
    throw new Error("Échec de la mise à jour de la réunion");  // Capture l'erreur et renvoie un message
  }
};

export default updateMeeting;
