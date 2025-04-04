import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"  // Assurez-vous que le chemin est correct

export async function DELETE(request: NextRequest) {
  try {
    // Récupère l'ID du devis depuis les paramètres de l'URL
    const devisId = request.nextUrl.pathname.split("/").pop()

    if (!devisId) {
      return NextResponse.json({ error: "L'ID du devis est requis" }, { status: 400 })
    }

    // Vérifier si le devis existe avant de le supprimer
    const devisExists = await prisma.devis.findUnique({
      where: { id: devisId },
    })

    if (!devisExists) {
      return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })
    }

    // Suppression du devis
    await prisma.devis.delete({
      where: { id: devisId },
    })

    // Retourne une réponse de succès
    return NextResponse.json({ message: "Devis supprimé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression du devis:", error)
    return NextResponse.json({ error: "Erreur serveur, veuillez réessayer plus tard" }, { status: 500 })
  }
}
