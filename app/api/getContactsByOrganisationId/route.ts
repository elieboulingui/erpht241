"use server";

import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    console.log("API GET /api/getContactsByOrganisationId appelée");
    
    try {
        const { searchParams } = new URL(request.url);
        const organisationId = searchParams.get("organisationId");
        
        console.log("organisationId reçu:", organisationId);

        if (!organisationId) {
            console.error("Erreur: Aucun organisationId fourni");
            return NextResponse.json(
                { error: "L'ID de l'organisation est requis." },
                { status: 400 }
            );
        }

        console.log("Recherche des contacts pour l'organisation:", organisationId);
        
        const organisationWithContacts = await prisma.organisation.findUnique({
            where: { id: organisationId },
            include: {
                Contact: {
                    where: { isArchived: false },
                },
                notes: true
            },
        });

        if (!organisationWithContacts) {
            console.error("Organisation non trouvée pour l'ID:", organisationId);
            return NextResponse.json(
                { error: "Organisation non trouvée." },
                { status: 404 }
            );
        }

        console.log(`${organisationWithContacts.Contact?.length || 0} contacts trouvés`);
        
        return NextResponse.json(organisationWithContacts.Contact || []);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        return NextResponse.json(
            { 
                error: "Erreur serveur lors de la récupération des contacts.",
                details: error instanceof Error ? error.message : 'Erreur inconnue'
            },
            { status: 500 }
        );
    }
}