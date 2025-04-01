import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assurez-vous que Prisma est bien initialisé
import { auth } from "@/auth" // Assurez-vous que l'authentification est bien configurée

// Fonction de validation pour les ID alphanumériques (ne contenant que des caractères alphanumériques)
const validateId = (id: string) => /^[a-zA-Z0-9]+$/.test(id);

// Fonction pour extraire les paramètres de l'URL (organisationId et contactId)
const extractParamsFromUrl = (url: string): { orgId: string | undefined, contactId: string | undefined } => {
  const searchParams = new URL(url).searchParams;
  return {
    orgId: searchParams.get('organisationId') ?? undefined,
    contactId: searchParams.get('contactId') ?? undefined
  };
};

// Fonction POST pour créer un devis
export async function POST(request: Request) {
  try {
    // Extraction des paramètres de l'URL
    const url = request.url;
    const { orgId, contactId } = extractParamsFromUrl(url);

    // Validation des IDs de l'organisation et du contact
    if (!orgId || !validateId(orgId)) {
      return NextResponse.json({ error: "L'ID de l'organisation est invalide" }, { status: 400 });
    }

    if (!contactId || !validateId(contactId)) {
      return NextResponse.json({ error: "L'ID du contact est invalide" }, { status: 400 });
    }

    // Authentification et récupération de l'ID de l'utilisateur depuis la session
    const userSession = await auth();
    if (!userSession || !userSession.user.id) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }

    const userId = userSession.user.id;

    // Lire les données du devis envoyées dans la requête
    const devisData = await request.json();
    const { notes, pdfUrl } = devisData;  // Notes et URL du PDF sont toujours disponibles dans `devisData`

    // Définir les montants fixes
    const totalAmount = 1212;
    const taxAmount = 1212;
    const totalWithTax = 1212;

    // Création du devis dans la base de données avec Prisma
    const devis = await prisma.devis.create({
      data: {
        devisNumber: `${Math.floor(Math.random() * 100000)}`, // Numéro de devis généré aléatoirement
        taxType: "HORS_TAXE", // Type de taxe (peut être modifié selon la logique de votre application)
        totalAmount,          // Montant total fixe
        taxAmount,            // Montant des taxes fixe
        totalWithTax,         // Montant total avec taxes fixe
        contactId,            // L'ID du contact
        organisationId: orgId, // L'ID de l'organisation
        createdById: userId,   // ID de l'utilisateur authentifié (créateur)
        notes,               // Notes supplémentaires (facultatif)
        pdfUrl,              // URL du PDF généré (facultatif)
      },
    });

    // Retourner le devis créé en JSON avec un statut 201 (créé avec succès)
    return NextResponse.json(devis, { status: 201 });

  } catch (error: unknown) {
    // Gestion des erreurs
    if (error instanceof Error) {
      console.error('Erreur lors de la création du devis :', error.message);
      console.error('Détails de l\'erreur :', error.stack);
      return NextResponse.json({ error: 'Une erreur interne est survenue lors de la création du devis.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Une erreur inconnue est survenue.' }, { status: 500 });
  }
}
