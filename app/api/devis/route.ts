import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

const validateId = (id: string) => /^[a-zA-Z0-9]+$/.test(id);

const extractParamsFromUrl = (url: string): { orgId?: string; contactId?: string } => {
  const searchParams = new URL(url).searchParams;
  return {
    orgId: searchParams.get("organisationId") || undefined,
    contactId: searchParams.get("contactId") || undefined,
  };
};

const generateDevisNumber = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `HT${day}${month}${year}${random}`;
};

export async function POST(request: Request) {
  try {
    const url = request.url;
    const { orgId, contactId } = extractParamsFromUrl(url);

    if (!orgId || !validateId(orgId)) {
      return NextResponse.json({ error: "L'ID de l'organisation est invalide" }, { status: 400 });
    }

    if (!contactId || !validateId(contactId)) {
      return NextResponse.json({ error: "L'ID du contact est invalide" }, { status: 400 });
    }

    const userSession = await auth();
    if (!userSession?.user?.id) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const userId = userSession.user.id;
    const devisData = await request.json();
    const { notes, pdfUrl, creationDate, dueDate, items } = devisData;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Les items du devis doivent être un tableau valide et non vide." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.description || typeof item.quantity !== "number" || typeof item.unitPrice !== "number") {
        return NextResponse.json({ error: "Certains champs des items sont invalides." }, { status: 400 });
      }
    }

    const currentDate = new Date().toISOString();
    const finalCreationDate = creationDate || currentDate;
    const finalDueDate = dueDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString();

    const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const taxAmount = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const totalWithTax = items.reduce((sum, item) => sum + (item.totalWithTax || 0), 0);

    const devis = await prisma.devis.create({
      data: {
        devisNumber: generateDevisNumber(),
        taxType: "HORS_TAXE",
        totalAmount,
        taxAmount,
        totalWithTax,
        contactId,
        organisationId: orgId,
        createdById: userId,
        notes: notes || "Non disponible",
        pdfUrl: pdfUrl || "Non disponible",
        creationDate: new Date(finalCreationDate),
        dueDate: new Date(finalDueDate),
        items: {
          create: items.map((item: any) => ({
            description: item.description || "Non disponible",
            quantity: typeof item.quantity === "number" ? item.quantity : 0,
            unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : 0,
            taxRate: typeof item.taxRate === "number" ? item.taxRate : 0,
            taxAmount: typeof item.taxAmount === "number" ? item.taxAmount : 0,
            totalPrice: typeof item.totalPrice === "number" ? item.totalPrice : 0,
            totalWithTax: typeof item.totalWithTax === "number" ? item.totalWithTax : 0,
            productId: item.productId || null,
          })),
        },
      },
    });

    // 🔁 Inngest: log de l'action de création de devis
    await inngest.send({
      name: "activit/devi.created",
      data: {
        devis,
        userId,
        organisationId: orgId,
        contactId,
        ipAddress: request.headers.get("x-forwarded-for") || "0.0.0.0",
        userAgent: request.headers.get("user-agent"),
      },
    });

    return NextResponse.json(devis, { status: 201 });
  } catch (error: any) {
    console.error("Erreur interne:", error.message || error);
    return NextResponse.json(
      { error: "Une erreur interne est survenue lors de la création du devis." },
      { status: 500 }
    );
  }
}
