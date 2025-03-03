// backend action pour la création de la catégorie
"use server";
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est correctement configuré
import { NextResponse } from "next/server";

export async function createCategory({
  name,
  description,
  organisationId,
}: {
  name: string;
  description?: string;
  organisationId: string;
}) {
  if (!name || !organisationId) {
    throw new Error("Le nom et l'ID de l'organisation sont requis.");
  }

  try {
    // Création de la catégorie
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        organisationId,
      },
    });

  //  if(newCategory){
  //   return NextResponse.json({ error: 'cette categories existe deja' }, { status: 404 });
  //  }
    return newCategory;
  } catch (error) {
    console.error("Erreur lors de la création de la catégorie:", error);
    throw new Error("Erreur serveur lors de la création de la catégorie.");
  }
} 
