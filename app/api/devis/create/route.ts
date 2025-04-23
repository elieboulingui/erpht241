import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

const validateId = (id: string) => /^[a-zA-Z0-9]{24,}$/.test(id);

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

    if (!validateId(organisationId)) {
      return NextResponse.json({ error: "ID d'organisation invalide" }, { status: 400 });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "La liste des produits est requise" }, { status: 400 });
    }

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

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalTaxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalWithTax = totalAmount + totalTaxAmount;

    const devisNumber = `HT-${Date.now()}`;

    const devis = await prisma.devis.create({
      data: {
        devisNumber,
        contactId,
        organisationId,
        createdById: session.user.id,
        createdByUserId: session.user.id,
        updatedByUserId: session.user.id,
        taxType: "HORS_TAXE",
        totalAmount,
        taxAmount: totalTaxAmount,
        totalWithTax,
        dueDate: new Date(),
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        contact: true,
      },
    });

    // ✅ Envoi de l’événement à Inngest
    await inngest.send({
      name: "devis/created",
      data: {
        devis,
        userId: session.user.id,
        organisationId: organisationId,
        ipAddress: req.headers.get("x-forwarded-for") || "0.0.0.0",
        userAgent: req.headers.get("user-agent") || null,
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
