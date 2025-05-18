// lib/server/donation.ts
"use server"
import prisma from "@/lib/prisma";
import { CreateInvoice, MakePushUSSD } from "@/lib/ebiling/pay";

interface DonationData {
  amount: number;
  payer_msisdn: string;
  payer_email: string;
  short_description: string;
  external_reference: string;
  courseId: string;  // Même si on ne l'utilise pas ici, on garde ce champ pour la structure de données
}

export async function createDonation(data: DonationData) {
  try {
    console.log("Début du processus de don avec les données suivantes:", data);

    // Créer une facture via l'API externe
    const getInvoice = await CreateInvoice(data);
    console.log("Réponse de la création de la facture:", getInvoice);

    if (!getInvoice.server_transaction_id) {
      console.log("Échec de la création de la facture, ID de transaction manquant.");
      return { success: false, message: "Impossible de traiter la transaction." };
    }

    // Créer la commande dans la base de données (sans l'information du produit)
    const commande = await prisma.order.create({
      data: {
        reference: data.external_reference,
        payerEmail: data.payer_email,
        payerMsisdn: data.payer_msisdn,
        shortDescription: data.short_description,
        amount: data.amount,
        server_transaction_id: getInvoice.server_transaction_id,
        bill_id: getInvoice.e_bill.bill_id,
      }
    });
    
    console.log("Commande créée avec succès:", commande);

    // Initier le paiement via USSD
    const paymentSystemName = "airtelmoney"; // Exemple de système de paiement
    console.log(`Envoi de la demande de paiement via USSD pour le bill_id: ${getInvoice.e_bill.bill_id}`);
    await MakePushUSSD({
      bill_id: getInvoice.e_bill.bill_id,
      payment_system_name: paymentSystemName,
      payer_msisdn: data.payer_msisdn,
    });

    console.log("Demande de paiement via USSD envoyée avec succès.");
    return { success: true, message: "Don effectué avec succès !" };
  } catch (error) {
    console.error("Erreur lors du don:", error);
    return { success: false, message: "Une erreur s'est produite lors du traitement du don." };
  }
}
