import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { inngest } from "@/inngest/client"; // Si vous utilisez Inngest pour gérer des événements

// ============================
// GET: Récupérer les logs d'activité pour un contact ou reliés à ce contact
// ============================
export async function GET(req: NextRequest) {
  const contactId = req.nextUrl.searchParams.get("contactId");

  if (!contactId) {
    return new NextResponse("Contact ID required", { status: 400 });
  }

  try {
    // Récupérer les logs d'activité liés à ce contactId ou qui ont une relation avec ce contact
    const activityLogs = await prisma.activityLog.findMany({
      where: {
        OR: [
          { contactId }, // Logs où contactId est directement égal à celui fourni
          { relatedUserId: contactId }, // Logs où le contactId est lié via un autre champ (exemple: relatedUserId)
          // Ajoutez d'autres conditions de relation si nécessaire
        ],
      },
      include: {
        user: true, // Inclure l'utilisateur qui a effectué l'action
        organisation: true, // Inclure l'organisation concernée
        contact: true, // Inclure le contact associé
        // Ajoutez d'autres relations si vous en avez besoin
      },
      orderBy: {
        createdAt: 'desc', // Trier les logs par la date de création
      },
    });

    console.log(activityLogs); // Log des résultats pour le débogage

    return NextResponse.json(activityLogs); // Retourner les logs au format JSON
  } catch (error) {
    console.error("[ACTIVITYLOGS_GET]", error); // Log de l'erreur
    return new NextResponse(error instanceof Error ? error.message : "Internal error", {
      status: 500,
    });
  }
}
