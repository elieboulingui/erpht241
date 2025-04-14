import { generateRandomToken } from '@/lib/generateRandomToken';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

// Fonction d'envoi d'email
async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.verify();
  } catch (error) {
    console.error('Erreur de configuration du transport:', error);
    return {
      status: 'error',
      message: 'Erreur de configuration du transport d\'email',
      error,
    };
  }

  try {
    const sendResult = await transport.sendMail({
      from: `"HT241" <${SMTP_EMAIL}>`,
      to,
      subject,
      html: body,
    });

    console.log('Email envoyé avec succès:', sendResult);

    return {
      status: 'success',
      message: 'Email envoyé avec succès',
      result: sendResult,
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      status: 'error',
      message: 'Erreur lors de l\'envoi de l\'email',
      error,
    };
  }
}

// Endpoint POST
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const confirmationToken = generateRandomToken();
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: confirmationToken,
        expires: tokenExpiration,
      },
    });

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de l'email</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: sans-serif;">
          <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
              <h1 style="text-align: center; font-size: 24px;">Vérification de l'email</h1>
              <p>Bonjour,</p>
              <p>Pour finaliser votre inscription, veuillez vérifier votre adresse e-mail.</p>
              <a href="https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px;">Vérifier l'email</a>
              <p>Ou copiez ce lien :</p>
              <a href="https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}">https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}</a>
              <p>Code à usage unique :</p>
              <code>${confirmationToken}</code>
              <hr />
              <p style="font-size: 14px; color: #666;">Si vous n'avez pas demandé cet email, ignorez ce message.</p>
          </div>
      </body>
      </html>
    `;

    const emailResult = await sendMail({
      to: email,
      subject: 'Vérification de votre adresse email sur HT241',
      body: emailTemplate,
    });

    if (emailResult.status === 'error') {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation" },
        { status: 500 }
      );
    }

    // Récupération des métadonnées HTTP
    const headerList = headers();
    const userAgent = (await headerList).get('user-agent') || null;
    const ipAddress =
      (await headerList).get('x-forwarded-for')?.split(',')[0]?.trim() ||
      (await headerList).get('x-real-ip') ||
      null;

    // Log dans ActivityLog
    await prisma.activityLog.create({
      data: {
        action: 'SEND_EMAIL_VERIFICATION',
        entityType: 'User',
        entityId: email,
        newData: {
          email,
          token: confirmationToken,
          expires: tokenExpiration,
        },
        userAgent: userAgent ?? undefined,
        ipAddress: ipAddress ?? undefined,
        actionDetails: 'Email de vérification envoyé à l’utilisateur pour confirmation',
        entityName: email,
      },
    });

    return NextResponse.json(
      { message: 'Inscription réussie, veuillez vérifier votre email pour confirmer votre compte.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur générale:', error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de l'inscription." },
      { status: 500 }
    );
  }
}
