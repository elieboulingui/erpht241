"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

interface ProductSelection {
  id: string;
  quantity: number;
  totalPrice: number;
}

export async function createDevisByContactName(
  contactName: string,
  selectedItems: ProductSelection[],
  notes = ""
) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Non autorisé");
    }

    const contact = await prisma.contact.findFirst({
      where: { name: contactName },
      select: {
        id: true,
        organisations: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!contact) {
      throw new Error("Contact introuvable");
    }

    const organisationId = contact.organisations[0]?.id;

    if (!organisationId) {
      throw new Error("Organisation introuvable pour ce contact");
    }

    // Supposons un taux de TVA fixe à 20%
    const taxRate = 0.2;

    // Préparer les items en récupérant description et prix unitaire
    const devisItemsData = await Promise.all(
      selectedItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
          select: {
            description: true,
            price: true, // <- cette ligne est importante
          },
        });

        if (!product) {
          throw new Error(`Produit avec id ${item.id} introuvable`);
        }

        const unitPrice = product.price;
        const description = product.description;
        const quantity = item.quantity;
        const totalPrice = unitPrice * quantity; // tu peux utiliser item.totalPrice aussi si fiable
        const taxAmount = totalPrice * taxRate;
        const totalWithTax = totalPrice + taxAmount;

        return {
          productId: item.id,
          description,
          quantity,
          unitPrice,
          totalPrice,
          taxRate,
          taxAmount,
          totalWithTax,
        };
      })
    );

    // Calcul des totaux globaux du devis
    const totalAmount = devisItemsData.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    const totalTaxAmount = devisItemsData.reduce(
      (acc, item) => acc + item.taxAmount,
      0
    );
    const totalWithTax = totalAmount + totalTaxAmount;

    const devisNumber = `HT${Date.now()}`; // numéro unique

    const newDevis = await prisma.devis.create({
      data: {
        devisNumber,
        notes,
        taxType: "TVA",
        status: "FACTURE",
        totalAmount,
        taxAmount: totalTaxAmount,
        totalWithTax,
        organisationId,
        contactId: contact.id,
        createdById: session.user.id,
        items: {
          create: devisItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return newDevis;
  } catch (error) {
    console.error("Erreur création devis:", error);
    throw new Error("Erreur serveur lors de la création du devis");
  }
}
