import { generateRandomToken } from '@/lib/generateRandomToken';  // Make sure to import your token generation function
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // Use nodemailer for email sending

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

    // Create email body HTML without using the name
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de votre compte HT241</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #1E2344; max-width: 600px; margin: 0 auto; padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2A305A; border-radius: 5px; color: #ffffff">
            <tr>
              <td style="padding: 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <img src="https://www.ht241.com/logo.png" alt="HT241 Logo" style="width: 200px; height: auto; display: block; margin: 0 auto;">
                </div>
                <p style="margin-bottom: 20px; color: #ffffff">Bonjour,</p>
                <p style="margin-bottom: 20px;color: #ffffff">
                  Merci de vous être inscrit sur HT241. Pour finaliser votre inscription et activer votre compte, veuillez utiliser le code d'authentification suivant :
                </p>
                <p style="margin-bottom: 20px;color: #ffffff; font-size: 24px; font-weight: bold;">
                  <strong>${confirmationToken}</strong>
                </p>
                <p style="margin-top: 30px;color: #ffffff">
                  Si vous n'avez pas créé de compte sur HT241, veuillez ignorer cet email.
                </p>
                <p style="margin-top: 30px;color: #ffffff">
                  Cordialement,<br>L'équipe HT241
                </p>
              </td>
            </tr>
          </table>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #7f8c8d; font-size: 12px;">© 2024 HT241. Tous droits réservés.</p>
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
