import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import  {generateRandomToken} from "@/lib/generateRandomToken";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Avoid logging sensitive data in production
    console.log('Données reçues:', { name, email });

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis." }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "L'email est déjà utilisé." }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT"  // Default role
      },
    });

    console.log('Utilisateur créé:', newUser);

    return new Response(
      JSON.stringify({ message: "Utilisateur créé avec succès." }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);

    return new Response(
      JSON.stringify({ error: "Une erreur est survenue lors de la création." }),
      { status: 500 }
    );
  }
}
