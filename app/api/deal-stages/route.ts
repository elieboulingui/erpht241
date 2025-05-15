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
    // Récupérer les étapes (Step) liées à l'organisation
    const stages = await prisma.step.findMany({
      where: { organisationId },
      orderBy: {
        stepNumber: "asc",
      },
      include: {
        opportunities: {
          include: {
            contact: true,
            merchant: true,
            member: true,
          },
        },
      },
    });
    

    console.log("Étapes brutes :", JSON.stringify(stages, null, 2));

    // Formater les étapes et les opportunités
    const mappedStages = stages.map((stage) => ({
      id: stage.id,
      label: stage.label,
      description: stage.description,
      color: stage.color,
      organisationId: stage.organisationId,
      opportunities: stage.opportunities.map((opportunity: any) => ({
        id: opportunity.id,
        label: opportunity.label,
        description: opportunity.description,
        amount: opportunity.amount,
        merchantId: opportunity.merchantId,
        memberId: opportunity.memberId,
        stepId: opportunity.stepId,
        avatar: opportunity.avatar,
        deadline: opportunity.deadline,

        tags: opportunity.tags || [], // ✅ Champ scalaire directement accessible

        contact: opportunity.contact
          ? {
              id: opportunity.contact.id,
              name: opportunity.contact.name,
              logo: opportunity.contact.logo,
              adresse: opportunity.contact.adresse,
              status_contact: opportunity.contact.status_contact,
              email: opportunity.contact.email,
              phone: opportunity.contact.phone,
              niveau: opportunity.contact.niveau,
              sector: opportunity.contact.sector,
              createdAt: opportunity.contact.createdAt,
              updatedAt: opportunity.contact.updatedAt,
              isArchived: opportunity.contact.isArchived,
              archivedAt: opportunity.contact.archivedAt,
              archivedBy: opportunity.contact.archivedBy,
              createdByUserId: opportunity.contact.createdByUserId,
              updatedByUserId: opportunity.contact.updatedByUserId,
            }
          : null,

        merchant: opportunity.merchant
          ? {
              id: opportunity.merchant.id,
              name: opportunity.merchant.name,
              email: opportunity.merchant.email,
              phone: opportunity.merchant.phone,
              photo: opportunity.merchant.photo,
            }
          : null,

        member: opportunity.member
          ? {
              id: opportunity.member.id,
              name: opportunity.member.name,
              email: opportunity.member.email,
              phone: opportunity.member.phone,
              photo: opportunity.member.photo,
            }
          : null,
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
