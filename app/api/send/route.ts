// import StripeWelcomeEmail from '@/react-email-starter/emails/stripe-welcome';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// // Export a POST method to handle your API request
// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   const confirmationToken = "ezez";
//   const name = "bnoul";

//   const { data, error } = await resend.emails.send({
//     from: 'Acme <onboarding@resend.dev>',
//     to: ['elieboulingui2@gmail.com'],
//     subject: 'Hello world',
//     react: StripeWelcomeEmail({ token: confirmationToken, name: name }),
//   });


//   if (error) {
//     return res.status(400).json(error);
//   }

//   res.status(200).json(data);
// }
