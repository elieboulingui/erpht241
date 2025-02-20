import nodemailer from "nodemailer";

export default async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",  // Use Gmail SMTP server
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transport.verify(); // Verify SMTP config
  } catch (error) {
    console.error("Erreur de configuration du transport:", error);
    return {
      status: "error",
      message: "Erreur de configuration du transport d'email",
      error,
    };
  }

  try {
    const sendResult = await transport.sendMail({
      from: `"HT241" <${SMTP_EMAIL}>`,  // Sender's email
      to,  // Recipient email
      subject,  // Email subject
      html: body,  // Email body (HTML)
    });

    console.log("Email envoyé avec succès:", sendResult);

    return {
      status: "success",
      message: "Email envoyé avec succès",
      result: sendResult,
    };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return {
      status: "error",
      message: "Erreur lors de l'envoi de l'email",
      error,
    };
  }
}
