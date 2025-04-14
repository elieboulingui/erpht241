"use server"

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assurez-vous que Prisma est correctement initialisé
import { auth } from '@/auth'; // Assurez-vous d'importer votre logique d'authentification

// Fonction de validation de date (format YYYY-MM-DD)
const validateDate = (date: string) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(date);
};

// Fonction de validation des IDs (alphanumériques, minimum 24 caractères)
const validateId = (id: string) => {
  const idPattern = /^[a-zA-Z0-9]{24,}$/;
  return idPattern.test(id);
};

// Action principale pour créer un "devis"
export async function Createdevis(devisData: any, req: Request) {
  const session = await auth()

  try {
    const {
      orgId,
      contactId,
      totalAmount,
      taxAmount,
      totalWithTax,
      taxType,
      dueDate,
      items,
      createdById,
    } = devisData;

    // Validation des données reçues
    if (!orgId || !validateId(orgId)) {
      return NextResponse.json({ error: 'L\'ID de l\'organisation est invalide' }, { status: 400 });
    }
    if (!contactId || !validateId(contactId)) {
      return NextResponse.json({ error: 'L\'ID du contact est invalide' }, { status: 400 });
    }
    if (typeof totalAmount !== 'number') {
      return NextResponse.json({ error: 'Le montant total est requis et doit être un nombre' }, { status: 400 });
    }
    if (typeof taxAmount !== 'number') {
      return NextResponse.json({ error: 'Le montant des taxes est requis et doit être un nombre' }, { status: 400 });
    }
    if (typeof totalWithTax !== 'number') {
      return NextResponse.json({ error: 'Le montant total avec taxes est requis et doit être un nombre' }, { status: 400 });
    }
    if (!['TVA', 'HORS_TAXE'].includes(taxType)) {
      return NextResponse.json({ error: 'Le type de taxe est invalide' }, { status: 400 });
    }
   
    if (dueDate && !validateDate(dueDate)) {
      return NextResponse.json({ error: 'Le format de la date d\'échéance est invalide' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Les éléments du devis sont requis et doivent être un tableau' }, { status: 400 });
    }
    if (!createdById || !validateId(createdById)) {
      return NextResponse.json({ error: 'L\'ID du créateur est invalide' }, { status: 400 });
    }

    // Préparation des items pour le "devis"
    const itemsData = items.map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      taxRate: item.taxRate,
      taxAmount: item.unitPrice * item.taxRate * item.quantity,
      totalPrice: item.unitPrice * item.quantity,
      totalWithTax: (item.unitPrice * item.quantity) * (1 + item.taxRate),
    }));

    // Création du devis et des éléments associés dans une seule opération
    const devis = await prisma.devis.create({
      data: {
        devisNumber: `HT${Math.floor(Math.random() * 100000)}`, // Génération d'un numéro de devis aléatoire
        taxType,
        totalAmount,
        taxAmount: 1212,  // Cette variable doit être présente et correcte
        totalWithTax,
        contactId,
        organisationId: orgId,
        createdById,
        items: {
          create: itemsData, // Création des éléments du devis
        },
      },
      include: {
        items: true, // Inclure les éléments créés dans la réponse
      },
    });
    
    // Récupérer l'adresse IP et le User-Agent depuis les entêtes de la requête
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'Inconnu'
    const userAgent = req.headers.get('user-agent') || 'Inconnu'

    // Enregistrement dans le journal d'activité
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'Devis',
        entityId: devis.id,
        entityName: devis.devisNumber,
        oldData: undefined, // Pas d'ancien état pour la création
        newData: { ...devis },
        organisationId: orgId,
        userId: session?.user.id,
        createdByUserId: session?.user.id,
        noteId: null, // Pas de note associée pour un devis
        ipAddress,
        userAgent,
        actionDetails: `Création du devis ${devis.devisNumber}.`,
      },
    });

    // Transformer l'objet Prisma en un objet plain JavaScript JSON
    const devisPlain = JSON.parse(JSON.stringify(devis)); // Ensure it's plain JSON

    // Retourner le devis créé avec ses éléments associés
    return NextResponse.json(devisPlain, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    return NextResponse.json({ error: 'Une erreur inattendue est survenue' }, { status: 500 });
  }
}
