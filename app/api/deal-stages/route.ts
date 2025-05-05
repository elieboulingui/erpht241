import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");

  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis." },
      { status: 400 }
    );
  }

  try {
    const stages = await prisma.step.findMany({
      where: { organisationId },
      include: { opportunities: true },
    });

    // Log clair pour debug
    console.log("Étapes brutes :", JSON.stringify(stages, null, 2));

    const mappedStages = stages.map((stage) => ({
      id: stage.id,
      label: stage.label,
      description: stage.description,
      color: stage.color,
      organisationId: stage.organisationId,
      opportunities: stage.opportunities.map((opportunity) => ({
        id: opportunity.id,
        label: opportunity.label,
        description: opportunity.description,
        amount: opportunity.amount,
        merchantId: opportunity.merchantId,
        avatar: opportunity.avatar,
        deadline: opportunity.deadline,
        tags: opportunity.tags,
        tagColors: opportunity.tagColors,
        createdAt: opportunity.createdAt,
        updatedAt: opportunity.updatedAt,
      })),
    }));

    console.log("Étapes formatées :", JSON.stringify(mappedStages, null, 2));

    return NextResponse.json(mappedStages, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des étapes :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des étapes." },
      { status: 500 }
    );
  }
}
