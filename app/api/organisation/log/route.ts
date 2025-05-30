import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const organisationId = searchParams.get("id");

  if (!organisationId) {
    return NextResponse.json({ error: "Organisation ID manquant" }, { status: 400 });
  }

  try {
    const logs = await prisma.activityLog.findMany({
      where: { organisationId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        createdBy: true,
        updatedBy: true,
        relatedUser: true,
        product: true,
        devis: true,
        task: true,
        contact: true,
      },
    });

    // Inclure l'adresse IP dans chaque log (si présente)
    const logsWithIp = logs.map((log) => ({
      ...log,
      ipAddress: log.ipAddress || "Adresse IP non disponible", // Assurez-vous que vous avez l'adresse IP
    }));

    return NextResponse.json(logsWithIp);
  } catch (error) {
    console.error("Erreur lors de la récupération des logs :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
