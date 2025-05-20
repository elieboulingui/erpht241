import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  context: { params: { merchantId: string } }
) {
  const { merchantId } = context.params // ✅ PAS de await ici

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        name: true,
        photo: true,
      },
    })

    if (!merchant) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(merchant), { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: "Error fetching merchant data" }), {
      status: 500,
    })
  }
}
