import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

// Définition locale de l'énumération DevisStatus (si l'import depuis @prisma/client pose problème)
enum DevisStatus {
  ATTENTE = 'ATTENTE',
  VALIDE = 'VALIDE',
  FACTURE = 'FACTURE',
  ARCHIVE = 'ARCHIVE'
}

// PUT: Mettre à jour un devis existant
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Récupérer l'ID du devis à partir des paramètres
    const { id: devisId } = await context.params

    if (!devisId) {
      return NextResponse.json({ error: "ID du devis requis" }, { status: 400 })
    }

    // Vérifier si le devis existe
    const existingDevis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: { items: true },
    })

    if (!existingDevis) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 })
    }

    const data = await request.json()

    // Démarrer une transaction pour mettre à jour le devis et ses articles
    const updatedDevis = await prisma.$transaction(async (tx: {
        devisItem: { deleteMany: (arg0: { where: { devisId: string } }) => any }; devis: {
          update: (arg0: {
            where: { id: string }; data: {
              status: DevisStatus | undefined // Utilisation de l'énumération DevisStatus
              totalAmount: any; taxAmount: any; totalWithTax: any; notes: any; lastModified: Date // Mettre à jour le timestamp de modification
              items: { create: any }
            }; include: { items: boolean }
          }) => any
        }; activityLog: {
          create: (arg0: {
            data: {
              action: string; entityType: string; entityId: string; oldData: string // Stocker les données anciennes
              newData: string // Stocker les nouvelles données
              userId: any; createdByUserId: any; organisationId: any; actionDetails: string; entityName: string; ipAddress: string; userAgent: string | null
            }
          }) => any
        }
      }) => {
      // 1. Supprimer les anciens articles
      await tx.devisItem.deleteMany({
        where: { devisId },
      })

      // 2. Mettre à jour le devis
      const devis = await tx.devis.update({
        where: { id: devisId },
        data: {
          status: data.status ? (data.status as DevisStatus) : undefined, // Utilisation de l'énumération DevisStatus
          totalAmount: data.totalAmount,
          taxAmount: data.taxAmount,
          totalWithTax: data.totalWithTax,
          notes: data.notes,
          lastModified: new Date(), // Mettre à jour le timestamp de modification
          items: {
            create: data.items.map((item: any) => {
              let productId = null
              if (
                item.productId &&
                typeof item.productId === "string" &&
                (isNaN(Number(item.productId)) || /^[a-z0-9]+$/.test(item.productId))
              ) {
                productId = item.productId
              }

              return {
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                totalPrice: item.totalPrice,
                totalWithTax: item.totalWithTax,
                productId: productId,
              }
            }),
          },
        },
        include: {
          items: true,
        },
      })

      // 3. Ajouter une entrée dans le journal d'activités
      await tx.activityLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'Devis',
          entityId: devisId,
          oldData: JSON.stringify(existingDevis), // Stocker les données anciennes
          newData: JSON.stringify(devis), // Stocker les nouvelles données
          userId: session.user.id,
          createdByUserId: session.user.id,
          organisationId: devis.organisationId,
          actionDetails: 'Devis mis à jour',
          entityName: 'Devis',
          ipAddress: request.headers.get('x-forwarded-for') || '0.0.0.0',
          userAgent: request.headers.get('user-agent'),
        }
      })

      return devis
    })

    // Retourner le devis mis à jour en réponse
    return NextResponse.json(updatedDevis)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du devis" }, { status: 500 })
  }
}
