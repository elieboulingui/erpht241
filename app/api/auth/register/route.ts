import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import sendMail from "@/lib/sendmail";
import { generateRandomToken } from "@/lib/generateRandomToken";
import os from 'os'; // Import pour récupérer l'IP locale du serveur

// Schéma de validation
const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
  name: z.string().min(3, "Votre nom complet est obligatoire"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);
    const normalizedEmail = email.toLowerCase();

    const existUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existUser) {
      return NextResponse.json(
        { error: "Ce compte existe déjà !" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        role: "ADMIN",
      },
    });

    const confirmationToken = generateRandomToken();

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: confirmationToken,
        expires: new Date(Date.now() + 3600000), // 1h
      },
    });

    const emailTemplate = `...`; // ton template reste ici

    const emailResult = await sendMail({
      to: email,
      name,
      subject: "Vérification de votre adresse email sur HT241",
      body: emailTemplate,
    });

    if (emailResult.status === "error") {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation" },
        { status: 500 }
      );
    }

    const userAgent = request.headers.get("user-agent") || null;
    const ipFromHeader = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    // Récupération IP locale du serveur
    let localIp = ''; // Déclaration correcte de localIp
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      if (interfaces) {
        for (const interfaceDetails of interfaces) {
          if (interfaceDetails.family === 'IPv4' && !interfaceDetails.internal) {
            localIp = interfaceDetails.address;
            break;
          }
        }
      }
    }

    // Assignation de l'adresse IP (priorité aux en-têtes 'x-forwarded-for', sinon à l'IP locale)
    let ipAddress = ipFromHeader || localIp;

    // Si l'IP est vide ou l'adresse est localhost, on tente de récupérer l'IP publique externe
    if (!ipAddress || ipAddress === "::1" || ipAddress === "127.0.0.1") {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ipAddress = data.ip;
      } catch (fetchErr) {
        console.error("Erreur lors de la récupération de l'IP externe :", fetchErr);
      }
    }

    // Enregistrement de l'activité
    await prisma.activityLog.create({
      data: {
        action: "REGISTER",
        entityType: "User",
        entityId: user.id,
        userId: user.id,
        organisationId: null,
        entityName: user.email,
        actionDetails: `Nouvel utilisateur inscrit avec l'adresse ${user.email}`,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json(
      { message: "Inscription réussie, veuillez vérifier votre email pour confirmer votre compte." },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Erreur d'inscription :", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'inscription." },
      { status: 500 }
    );
  }
}
