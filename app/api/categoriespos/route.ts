// pages/api/categories.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Récupère toutes les catégories avec leurs produits
        const categories = await prisma.category.findMany({
            where: {
                isArchived: false, // Optionnel : Filtrer les catégories archivées
            },
            include: {
                Product: true, // Inclure les produits associés
            },
        });
        
        // Retourner les catégories avec un statut 200
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        // Retourner une erreur en cas d'échec avec un statut 500
        return NextResponse.json({ error: "Erreur lors de la récupération des catégories" }, { status: 500 });
    }
}
