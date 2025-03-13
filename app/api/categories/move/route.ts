import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Importer l'instance Prisma
import { revalidatePath } from "next/cache"; // Importer revalidatePath

export async function POST(request: Request) {
  const { categoryId, newParentCategoryId } = await request.json();

  // Vérifier que les identifiants sont fournis
  if (!categoryId || !newParentCategoryId) {
    return NextResponse.json(
      { error: "Les identifiants de catégorie et de parent sont requis." },
      { status: 400 }
    );
  }

  try {
    // Vérifier que la catégorie à déplacer existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "La catégorie spécifiée n'existe pas." },
        { status: 404 }
      );
    }

    // Vérifier que la nouvelle catégorie parente existe
    const newParentCategory = await prisma.category.findUnique({
      where: { id: newParentCategoryId },
    });

    if (!newParentCategory) {
      return NextResponse.json(
        { error: "La catégorie parente spécifiée n'existe pas." },
        { status: 404 }
      );
    }

    // Mettre à jour la catégorie en définissant le parent
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        parent: {
          connect: { id: newParentCategoryId }, // Connect the category with the new parent
        },
      },
    });

    // Revalider le chemin (utilisation de l'organisation de la catégorie source)
    const path = `/listing-organisation/${category.organisationId}/produit/categorie`; 
    revalidatePath(path);

    // Retourner une réponse avec succès et éventuellement la catégorie mise à jour
    return NextResponse.json({
      message: "Catégorie déplacée avec succès.",
      updatedCategory, // You can also return the updated category if needed
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors du déplacement de la catégorie." },
      { status: 500 }
    );
  }
}
