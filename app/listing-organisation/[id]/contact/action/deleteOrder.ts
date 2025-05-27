'use server'

import  prisma  from '@/lib/prisma' // adapte le chemin à ton projet

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error('Erreur de suppression de la commande :', error)
    return { success: false, message: 'Échec de la suppression' }
  }
}
