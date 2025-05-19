"use server";
import prisma from "@/lib/prisma";
import { CreateInvoice, MakePushUSSD } from "@/lib/ebiling/pay";
import { auth } from "@/auth"; // récupère l'utilisateur connecté

interface DonationData {
  amount: number;
  payer_msisdn: string;
  payer_email: string;
  short_description: string;
  external_reference: string;
  courseId: string;
}

const quantity = 1; // Quantité par défaut
const taxRate = 0; // Taux de taxe (0 si hors taxe)

export async function createDonation(data: DonationData) {
  try {
    console.log("Début du processus de don avec les données suivantes:", data);

    // 1. Récupérer l'utilisateur connecté
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return { success: false, message: "Utilisateur non authentifié." };
    }

    // 2. Récupérer l'organisation à partir du cours
    const course = await prisma.product.findUnique({
      where: { id: data.courseId },
      select: { organisationId: true },
    });

    if (!course) {
      return { success: false, message: "Le cours spécifié est introuvable." };
    }

    const organisationId = course.organisationId;

    // 3. Vérifier si un contact existe avec cet email
    let contact = await prisma.contact.findFirst({
      where: { email: data.payer_email },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          email: data.payer_email,
          phone: data.payer_msisdn,
          name: data.payer_email.split("@")[0],
          organisations: { connect: [{ id: organisationId }] },
          niveau: "CLIENT",
        },
      });
      console.log("Contact créé:", contact);
    } else {
      console.log("Contact existant trouvé:", contact);
    }

    // 4. Créer une commande (order)
    const commande = await prisma.order.create({
      data: {
        reference: data.external_reference,
        payerEmail: data.payer_email,
        payerMsisdn: data.payer_msisdn,
        shortDescription: data.short_description,
        amount: data.amount,
        server_transaction_id: "",
        bill_id: "",
      },
    });

    // 5. Créer une facture via l'API externe
    const getInvoice = await CreateInvoice(data);
    if (!getInvoice.server_transaction_id) {
      return { success: false, message: "Impossible de traiter la transaction." };
    }

    // 6. Mettre à jour la commande avec les infos de la facture
    await prisma.order.update({
      where: { id: commande.id },
      data: {
        server_transaction_id: getInvoice.server_transaction_id,
        bill_id: getInvoice.e_bill.bill_id,
      },
    });

    // 7. Calculer les montants de la facture
    const unitPrice = data.amount; // Prix unitaire provenant de la donation
    const taxAmount = quantity * unitPrice * (taxRate / 100); // Calcul de la taxe
    const totalPrice = quantity * unitPrice; // Prix total sans taxe
    const totalWithTax = totalPrice + taxAmount;

    // 8. Créer un devis lié au contact
    const devis = await prisma.devis.create({
      data: {
        devisNumber: `DEV-${Date.now()}`,
        taxType: "HORS_TAXE",
        status: "ATTENTE",
        totalAmount: data.amount,
        taxAmount: 0,
        totalWithTax: data.amount,
        organisationId,
        contactId: contact.id,
        createdById: user.id,
        createdByUserId: user.id,
        updatedByUserId: user.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: {
          create: [
            {
              description: data.short_description,
              quantity,
              unitPrice,
              taxRate,
              taxAmount,
              totalPrice,
              totalWithTax,
              createdByUserId: user.id,
            },
          ],
        },
      },
    });

    console.log("Devis créé avec succès:", devis);

    // 9. Envoi du paiement via USSD
    await MakePushUSSD({
      bill_id: getInvoice.e_bill.bill_id,
      payment_system_name: "airtelmoney",
      payer_msisdn: data.payer_msisdn,
    });

    console.log("Demande de paiement USSD envoyée.");
    return { success: true, message: "Don effectué avec succès !" };

  } catch (error) {
    console.error("Erreur lors du traitement du don:", error);
    return { success: false, message: "Une erreur s'est produite lors du traitement du don." };
  }
}
