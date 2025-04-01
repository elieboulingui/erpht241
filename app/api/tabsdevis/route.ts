import { DevisStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extraction des paramètres de l'URL
  const contactId = searchParams.get("contactId"); // Récupère l'ID du contact
  const page = parseInt(searchParams.get("page") || "1", 10); // Page par défaut à 1
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Limite par défaut à 10

  // Vérifie si le statusFilter est présent et le transforme en tableau de DevisStatus
  const statusFilterParam = searchParams.get("status");
  const statusFilter: DevisStatus[] = statusFilterParam
    ? statusFilterParam.split(",").map((status) => status as DevisStatus)
    : []; // Filtre vide par défaut si "status" n'est pas présent

  // Si le contactId n'est pas fourni, retourner une erreur
  if (!contactId) {
    return NextResponse.json(
      { error: "L'ID du contact est requis." },
      { status: 400 }
    );
  }

  // Crée un objet de conditions de filtre pour Prisma
  const whereConditions: any = {
    isArchived: false, // Filtrer uniquement les devis non archivés
    contactId: contactId, // Filtrer par contactId
  };

  // Si un statusFilter est présent, l'ajouter aux conditions de filtre
  if (statusFilter.length > 0) {
    whereConditions.status = { in: statusFilter }; // Filtrer par le statut
  }

  try {
    // Récupère les devis avec pagination et filtrage appliqué
    const nonArchivedDevis = await prisma.devis.findMany({
      where: whereConditions, // Applique les conditions de filtrage
      skip: (page - 1) * limit, // Sauter les éléments précédents pour la pagination
      take: limit, // Limiter les éléments à la taille de la page
      include: {
        contact: { 
          select: {
            name: true, // Inclure le nom du contact dans les résultats
            email: true, // Inclure l'email du contact
            phone: true, // Inclure le téléphone du contact
            organisations: true, // Inclure les organisations du contact
          },
        },
        organisation: { 
          select: {
            name: true, // Inclure le nom de l'organisation associée
          },
        },
      },
    });

    // Compte le nombre total de devis correspondant aux critères (pour la pagination)
    const totalDevis = await prisma.devis.count({
      where: whereConditions,
    });

    // Retourner les devis paginés et le total pour la pagination
    return NextResponse.json(
      {
        data: nonArchivedDevis,
        total: totalDevis, // Nombre total de devis correspondant aux critères
        currentPage: page,
        totalPages: Math.ceil(totalDevis / limit), // Calculer le nombre total de pages
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis." },
      { status: 500 }
    );
  }
}
