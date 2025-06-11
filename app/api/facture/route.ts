import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("id");

    if (!contactId) {
      return new Response(
        JSON.stringify({ error: "Missing contactId parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const devisFactures = await prisma.devis.findMany({
      where: {
        contactId,
        status: "FACTURE", // adapte à ton enum réel
        isArchived: false,
      },
      orderBy: {
        creationDate: "desc",
      },
      select: {
        id: true,               // ID unique (UUID ou CUID)
        devisNumber: true,      // numéro de facture
        creationDate: true,     // date de facturation
        dueDate: true,          // date d'échéance
        taxAmount: true,        // taxes
        status: true,           // statut
      },
    });

    return new Response(
      JSON.stringify(devisFactures),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching devis factures:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
