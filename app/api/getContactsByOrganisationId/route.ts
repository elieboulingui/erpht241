"use server";

import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get("organisationId");

    if (!organisationId) {
        return new Response(
            JSON.stringify({ error: "L'ID de l'organisation est requis." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const organisationWithContacts = await prisma.organisation.findUnique({
            where: {
                id: organisationId,
            },
            include: {
                Contact: { // Vérifie que le nom du champ est bien `contacts` dans ton modèle Prisma
                    where: {
                        isArchived: false,
                    },
                },
            },
        });

        return new Response(
            JSON.stringify(organisationWithContacts?.Contact || []),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        return new Response(
            JSON.stringify({ error: "Erreur serveur lors de la récupération des contacts." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}