import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// ✅ Fonction utilitaire : Valide un ID d’au moins 24 caractères alphanumériques
const validateId = (id: string) => /^[a-zA-Z0-9]{24,}$/.test(id);

export async function POST(req: Request) {
  try {
    // Authentification de l'utilisateur
    const session = await auth();

    // Vérification que l'utilisateur est authentifié
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupération du corps de la requête
    const body = await req.json();
    console.log("Données reçues :", body);

    // Extraction des données importantes
    const { contactId, products, organisationId } = body;

    // Validation des champs nécessaires
    if (!contactId || !products || !organisationId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Validation de l'ID d'organisation
    if (!validateId(organisationId)) {
      console.log("ID d'organisation invalide :", organisationId);
      return NextResponse.json({ error: "ID d'organisation invalide" }, { status: 400 });
    }

    // Vérification de la liste des produits
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "La liste des produits est requise" }, { status: 400 });
    }

    // Création des items à partir des produits
    const items = products.map((product: any) => {
      const taxRate = product.taxRate || 0;
      const taxAmount = product.price * product.quantity * taxRate;
      const totalPrice = product.price * product.quantity;
      const totalWithTax = totalPrice + taxAmount;

      return {
        description: product.description || "",
        quantity: product.quantity || 1,
        unitPrice: product.price,
        taxRate,
        taxAmount,
        totalPrice,
        totalWithTax,
        productId: product.id || undefined,
        createdByUserId: session.user.id,
      };
    });

    console.log("Items créés :", items);

    // Calcul des totaux
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTaxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalWithTax = totalAmount + totalTaxAmount;

    console.log("Total montant :", totalAmount);
    console.log("Total taxe :", totalTaxAmount);
    console.log("Total avec taxe :", totalWithTax);

    // Création du numéro de devis unique
    const devisNumber = `DEV-${Date.now()}`;

    // Création du devis dans la base de données
    const devis = await prisma.devis.create({
      data: {
        devisNumber,
        contactId,
        organisationId,
        createdById: session.user.id,
        createdByUserId: session.user.id,
        updatedByUserId: session.user.id,
        taxType: "HORS_TAXE", // Ajuste cela selon ton modèle
        totalAmount,
        taxAmount: totalTaxAmount,
        totalWithTax,
        dueDate: new Date(), // Utilise la date actuelle ou une date spécifique
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        contact: true,
      },
    });

    console.log("Devis créé :", devis);

    // Réponse réussie avec le devis créé
    return NextResponse.json(devis, { status: 201 });

  } catch (error) {
    console.error("Erreur API création devis:", error);

    // Retourner une erreur interne
    return NextResponse.json(
      { error: "Erreur interne lors de la création du devis" },
      { status: 500 }
    );
  }
}