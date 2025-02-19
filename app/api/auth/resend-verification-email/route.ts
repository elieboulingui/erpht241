import { Resend } from 'resend';
import { StripeWelcomeEmail } from '@/react-email-starter/emails/stripe-welcome'; // Make sure this model exists and is correct.
import { generateRandomToken } from '@/lib/generateRandomToken';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json(); // Using the new fetch-based API

    if (!email || !name) {
      return NextResponse.json({ error: 'Email et nom requis' }, { status: 400 });
    }

    // Generate a confirmation token
    const confirmationToken = generateRandomToken();

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'HT241 <onboarding@resend.dev>',
      to: [email],
      subject: 'Confirmez votre adresse email',
      react: StripeWelcomeEmail({ token: confirmationToken, name }),
    });

    // If there is an error sending the email
    if (error) {
      return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
    }

    // Successful email sending
    return NextResponse.json({ message: 'Email envoyé avec succès', data });
  } catch (error) {
    // General error handling
    return NextResponse.json({ error: 'Une erreur s\'est produite' }, { status: 500 });
  }
}
