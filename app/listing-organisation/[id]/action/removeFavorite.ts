// "use server";

// import prisma from "@/lib/prisma";

// // Fonction server action pour supprimer un favori
// export async function removeFavorite(contactId: string, organisationId: string) {
//   try {
//     // Supprimer le favori lié à ce contact et organisation
//     await prisma.favorite.deleteMany({
//       where: {
//         contactId,
//         organisationId,
//       },
//     });

//     return { success: true };
//   } catch (error: any) {
//     console.error("Erreur lors de la suppression du favori :", error);

//     return {
//       success: false,
//       error: error?.message || "Une erreur est survenue lors de la suppression.",
//     };
//   }
// }



"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function removeFavorite(contactId: string, organisationId: string) {
  try {
    // Delete the favorite
    await prisma.favorite.delete({
      where: {
        contactId_organisationId: {
          contactId,
          organisationId,
        },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error removing favorite:", error)
    return { success: false, error: "Échec de la suppression du favori" }
  }
}
