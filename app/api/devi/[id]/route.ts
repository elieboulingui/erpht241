import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

enum DevisStatus {
  ATTENTE = 'ATTENTE',
  VALIDE = 'VALIDE',
  FACTURE = 'FACTURE',
  ARCHIVE = 'ARCHIVE'
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: devisId } = await context.params;
    if (!devisId) {
      return NextResponse.json({ error: "ID du devis requis" }, { status: 400 });
    }

    const existingDevis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: { items: true },
    });

    if (!existingDevis) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }

    const data = await request.json();

    const updatedDevis = await prisma.$transaction(async (tx) => {
      await tx.devisItem.deleteMany({ where: { devisId } });

      const devis = await tx.devis.update({
        where: { id: devisId },
        data: {
          status: data.status ? (data.status as DevisStatus) : undefined,
          totalAmount: data.totalAmount,
          taxAmount: data.taxAmount,
          totalWithTax: data.totalWithTax,
          notes: data.notes,
          lastModified: new Date(),
          items: {
            create: data.items.map((item: any) => {
              let productId = null;
              if (item.productId && typeof item.productId === "string" &&
                  (isNaN(Number(item.productId)) || /^[a-z0-9]+$/.test(item.productId))) {
                productId = item.productId;
              }

              return {
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                totalPrice: item.totalPrice,
                totalWithTax: item.totalWithTax,
                productId,
              };
            }),
          },
        },
        include: { items: true },
      });

      return devis;
    });

    // ✅ Envoi de l’événement Inngest pour journalisation
    await inngest.send({
      name: "devis/updated",
      data: {
        oldData: existingDevis,
        newData: updatedDevis,
        userId: session.user.id,
        organisationId: updatedDevis.organisationId,
        ipAddress: request.headers.get('x-forwarded-for') || '0.0.0.0',
        userAgent: request.headers.get('user-agent') || null,
      },
    });

    return NextResponse.json(updatedDevis);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du devis" }, { status: 500 });
  }
}
