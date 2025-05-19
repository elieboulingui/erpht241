"use server"
import prisma from "@/lib/prisma";
import { CreateInvoice, MakePushUSSD } from "@/lib/ebiling/pay";

interface DonationData {
  amount: number;
  payer_msisdn: string;
  payer_email: string;
  short_description: string;
  external_reference: string;
  courseId: string; // utilisé pour associer le produit
}

export async function createDonation(data: DonationData) {
  try {
    console.log("Début du processus de don avec les données suivantes:", data);

    // Étape 1: Vérifier ou créer le contact
    let contact = await prisma.contact.findUnique({
      where: { email: data.payer_email },
    });

    if (!contact) {
      console.log("Contact non trouvé. Création en cours...");
      contact = await prisma.contact.create({
        data: {
          email: data.payer_email,
          phone: data.payer_msisdn,
          fullName: "Donateur Anonyme", // ou nom réel si dispo
        },
      });
      console.log("Contact créé :", contact);
    } else {
      console.log("Contact existant :", contact);
    }

    // Étape 2: Récupérer le produit lié au don
    const product = await prisma.product.findUnique({
      where: { id: data.courseId },
    });

    if (!product) {
      console.log("Produit introuvable avec l’ID :", data.courseId);
      return { success: false, message: "Produit associé introuvable." };
    }

    console.log("Produit trouvé :", product);

    // Étape 3: Connecter le produit au contact (si pas déjà lié)
    await prisma.contact.update({
      where: { id: contact.id },
      data: {
        products: {
          connect: { id: product.id },
        },
      },
    });

    console.log("Produit lié au contact avec succès.");

    // Étape 4: Créer la facture
    const getInvoice = await CreateInvoice(data);
    console.log("Réponse de création de la facture:", getInvoice);

    if (!getInvoice.server_transaction_id) {
      console.log("Échec de la création de la facture.");
      return { success: false, message: "Impossible de traiter la transaction." };
    }

    // Étape 5: Créer la commande
    const commande = await prisma.order.create({
      data: {
        reference: data.external_reference,
        payerEmail: data.payer_email,
        payerMsisdn: data.payer_msisdn,
        shortDescription: data.short_description,
        amount: data.amount,
        server_transaction_id: getInvoice.server_transaction_id,
        bill_id: getInvoice.e_bill.bill_id,
        contactId: contact.id, // lie la commande au contact
      }
    });

    console.log("Commande créée :", commande);

    // Étape 6: Initier paiement USSD
    const paymentSystemName = "airtelmoney";
    console.log(`Demande USSD pour bill_id: ${getInvoice.e_bill.bill_id}`);

    await MakePushUSSD({
      bill_id: getInvoice.e_bill.bill_id,
      payment_system_name: paymentSystemName,
      payer_msisdn: data.payer_msisdn,
    });

    console.log("Paiement USSD lancé.");
    return { success: true, message: "Don effectué avec succès !" };

  } catch (error) {
    console.error("Erreur lors du don:", error);
    return { success: false, message: "Une erreur s'est produite lors du traitement du don." };
  }
}
