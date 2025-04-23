import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client"; // 👈 importe Inngest

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { contactId, products, organisationId } = body;

    if (!contactId || !products || !organisationId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "La liste des produits est requise" }, { status: 400 });
    }

    const items = [];

    for (const product of products) {
      if (!product.unitPrice || !product.quantity) {
        return NextResponse.json({ error: "Produit invalide, prix ou quantité manquants" }, { status: 400 });
      }

      const taxAmount = product.unitPrice * (product.taxRate || 0);
      const totalPrice = product.unitPrice * product.quantity;
      const totalWithTax = totalPrice + taxAmount;

      items.push({
        description: product.description || "Produit sans description",
        quantity: product.quantity || 1,
        unitPrice: product.unitPrice,
        taxRate: product.taxRate || 0,
        taxAmount,
        totalPrice,
        totalWithTax,
      });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTaxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalWithTax = totalAmount + totalTaxAmount;
    const devisNumber = `DEV-${Date.now()}`;

    const organisationExists = await prisma.organisation.findUnique({ where: { id: organisationId } });
    const contactExists = await prisma.contact.findUnique({ where: { id: contactId } });

    if (!organisationExists || !contactExists) {
      return NextResponse.json({ error: "Organisation ou Contact non trouvé" }, { status: 400 });
    }

    const devis = await prisma.devis.create({
      data: {
        devisNumber,
        contactId,
        organisationId,
        createdById: session.user.id,
        taxType: "HORS_TAXE",
        totalAmount,
        taxAmount: totalTaxAmount,
        totalWithTax,
        items: {
          create: items,
        },
        dueDate: new Date(),
      },
      include: {
        items: true,
        contact: true,
      },
    });

    // ✅ Déclencher un événement Inngest pour le log
    await inngest.send({
      name: "devisia/created",
      data: {
        devis,
        userId: session.user.id,
        organisationId,
        contactId,
        ipAddress: req.headers.get("x-forwarded-for") || "0.0.0.0",
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json(devis, { status: 201 });
  } catch (error: any) {
    console.error("Erreur API création devis:", error);
    return NextResponse.json(
      { error: "Erreur interne lors de la création du devis" },
      { status: 500 }
    );
  }
}
