'use server'

import prisma from '@/lib/prisma'

export async function updateProductAction({
  productId,
  organisationId,
  name,
  category,
  description,
}: {
  productId: string
  organisationId: string
  name: string
  category: string
  description: string
}) {
  try {
    await prisma.product.update({
      where: {
        id: productId,
        organisationId,
      },
      data: {
        name,
        description,
        categories: {
          set: [], // Supprime les anciennes catégories
          connectOrCreate: [
            {
              where: {
                category_organisation_unique: {
                  name: category,
                  organisationId: organisationId,
                },
              },
              create: {
                name: category,
                organisation: {
                  connect: { id: organisationId },
                },
              },
            },
          ],
        },
      },
    })
  } catch (error) {
    console.error('Erreur de mise à jour du produit :', error)
    throw error
  }
}
