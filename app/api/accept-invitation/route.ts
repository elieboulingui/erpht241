// /app/api/accept-invitation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assurez-vous que Prisma est correctement configuré

// Fonction GET pour accepter l'invitation en utilisant le token dans l'URL
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token'); // Récupérer le token depuis l'URL
  
  try { 
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }

    // Chercher le token dans la base de données
    const verificationToken = await prisma.invitation.findFirst({
      where: {
        token: token, // Vérifier si le token correspond à un enregistrement
      },
    });

    // Vérifier si l'invitation existe
    if (!verificationToken) {
      return NextResponse.json({ error: 'Invitation non trouvée' }, { status: 404 });
    }

    // Si le token est trouvé, renvoyer l'id et le token
    return NextResponse.json({ id: verificationToken.id, token: verificationToken.token });
  } catch (error) {
    // Gérer l'erreur du serveur
    console.error('Erreur lors de la récupération de l\'invitation:', error);
    return NextResponse.json({ error: 'Erreur du serveur' }, { status: 500 });
  }
}
