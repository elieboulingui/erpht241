import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// ✅ Fonction utilitaire : Valide un ID d’au moins 24 caractères alphanumériques
const validateId = (id: string) => /^[a-zA-Z0-9]{24,}$/.test(id);

export async function POST(req: Request) {
  try {
    const session = await auth();

    // 🔒 Vérifie si l'utilisateur est authentifié
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Données reçues :", body); // Ajout d'un log pour afficher le corps de la requête

    const { contactId, products, organisationId } = body;

    // 📌 Validation des champs requis
    if (!contactId || !products || !organisationId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // 📌 Validation de l'ID de l'organisation
    if (!validateId(organisationId)) {
      console.log("ID d'organisation invalide :", organisationId); // Log de l'ID pour voir ce qui est envoyé
      return NextResponse.json({ error: "ID d'organisation invalide" }, { status: 400 });
    }

    // 📌 Vérifie que la liste des produits est un tableau non vide
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "La liste des produits est requise" }, { status: 400 });
    }

    // 🛠️ Calcul des champs pour chaque produit
    const items = [];

    for (const product of products) {
      // Validation des données produit
      if (!product.price || !product.quantity) {
        console.log("Produit invalide : ", product);
        return NextResponse.json({ error: "Produit invalide, prix ou quantité manquants" }, { status: 400 });
      }

      const taxAmount = product.price * (product.taxRate || 0); // Calcul de la taxe
      const totalPrice = product.price * product.quantity; // Calcul du prix total sans taxe
      const totalWithTax = totalPrice + taxAmount; // Calcul du prix total avec taxe

      items.push({
        description: product.description || "Produit sans description", // Utilisation d'une description par défaut
        quantity: product.quantity || 1, // Valeur par défaut si quantité non définie
        unitPrice: product.price,
        taxRate: product.taxRate || 0, // Valeur par défaut si taux de taxe non défini
        taxAmount,
        totalPrice,
        totalWithTax,
      });
    }

    // 🛠️ Calcul des totaux du devis
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTaxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalWithTax = totalAmount + totalTaxAmount;

    // Génération d'un numéro de devis unique (par exemple, basé sur un timestamp ou un UUID)
    const devisNumber = `DEV-${Date.now()}`;

    // 📌 Validation de l'existence de l'organisation et du contact dans la base de données
    const organisationExists = await prisma.organisation.findUnique({ where: { id: organisationId } });
    const contactExists = await prisma.contact.findUnique({ where: { id: contactId } });

    if (!organisationExists || !contactExists) {
      console.log("Organisation ou Contact introuvable");
      return NextResponse.json({ error: "Organisation ou Contact non trouvé" }, { status: 400 });
    }

    // Création du devis avec les produits associés
    const devis = await prisma.devis.create({
      data: {
        devisNumber,
        contactId,
        organisationId,
        createdById: session.user.id,
        lastModified: session.user.id, // L'utilisateur qui a créé le devis est aussi celui qui l'a mis à jour
        taxType: "HORS_TAXE", // Exemple de type de taxe, ajuste-le selon tes besoins
        totalAmount,
        taxAmount: totalTaxAmount,
        totalWithTax,
        items: {
          create: items, // On passe les éléments calculés
        },
        dueDate: new Date(), // Date d'échéance (peut être ajustée selon tes besoins)
      },
      include: {
        items: true, // Inclut les items du devis dans la réponse
        contact: true, // Inclut les informations du contact dans la réponse
      },
    });

    return NextResponse.json(devis, { status: 201 });
  } catch (error) {
    console.error("Erreur API création devis:", error);
    return NextResponse.json(
      { error: "Erreur interne lors de la création du devis" },
      { status: 500 }
    );
  }
}
