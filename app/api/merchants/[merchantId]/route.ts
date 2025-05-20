import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { merchantId: string } }) {
  // Attente des paramètres pour éviter l'erreur
  const { merchantId } = await params // Important de faire l'attente ici

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        name: true,
        photo: true,
      },
    })

    if (!merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), { status: 404 })
    }
   console.log(merchant)
    return new Response(JSON.stringify(merchant), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "Error fetching merchant data" }), { status: 500 })
  }
}
