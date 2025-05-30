import { Toaster } from "@/components/ui/sonner"
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"
import "./globals.css";

// Chargement des polices
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Utilisation de font-display: swap pour éviter le flickering
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Utilisation de font-display: swap pour éviter le flickering
});

export const metadata = {
  title: "Erpht241",
  description: "Generated by create next app",
};

// Layout principal pour l'application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
      </body>
    </html>
  );
}
