import { generateRandomToken } from '@/lib/generateRandomToken';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client'; // Prisma client import
const prisma = new PrismaClient(); // Instantiate the Prisma client

// Function to send email via nodemailer
async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env; // Fetch environment variables

  const transport = nodemailer.createTransport({
    service: 'gmail', // Gmail SMTP server
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.verify(); // Verify SMTP config
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
      from: `"HT241" <${SMTP_EMAIL}>`, // Sender's email
      to, // Recipient email
      subject, // Email subject
      html: body, // Email body (HTML)
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

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Generate a confirmation token
    const confirmationToken = generateRandomToken();
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token expires in 1 hour

    // Store the verification token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: confirmationToken,
        expires: tokenExpiration,
      },
    });

    // Create email body HTML
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de l'email</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center;">
          <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%;">
              <h1 style="text-align: center; font-size: 24px; margin-bottom: 24px; font-weight: normal;">
                  Vérification de l'email
              </h1>
              <p style="margin-bottom: 16px;">
                  Bonjour,
              </p>
              <p style="margin-bottom: 32px; line-height: 1.5;">
                  Pour finaliser votre inscription, vous devez vérifier votre adresse e-mail.
              </p>
              <a href="https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}" 
                style="display: block; width: fit-content; margin: 0 auto 32px; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
                  Vérifier l'email
              </a>
              <p style="margin-bottom: 16px; color: #333;">
                  Ou copiez et collez cette URL dans votre navigateur :
              </p>
              <a href="https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}" 
                style="color: #0066cc; word-break: break-all; text-decoration: none; margin-bottom: 32px; display: block;">
                  https://erpht241.vercel.app/tokenconfirmed/${confirmationToken}
              </a>
              <div style="margin-bottom: 32px;">
                  <p style="margin-bottom: 8px;">
                      Vous pouvez également utiliser ce mot de passe à usage unique sur la page de vérification :
                  </p>
                  <p style="font-family: monospace; font-size: 18px; margin: 0; color: #333;">
                      ${confirmationToken}
                  </p>
              </div>
              <p style="color: #666; font-size: 14px; line-height: 1.5; border-top: 1px solid #eee; padding-top: 24px; margin: 0;">
                  Si vous ne souhaitez pas vérifier votre email ou si vous n'avez pas demandé ceci, ignorez et supprimez ce message.
              </p>
          </div>
      </body>
      </html>
    `;

    // Send the email using nodemailer
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

    // Return success response
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
