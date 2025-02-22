"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PasswordResetConfirmation() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Utilise useEffect pour récupérer l'email depuis localStorage au montage du composant
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail"); // Récupérer l'email de localStorage
    if (storedEmail) {
      setEmail(storedEmail); // Mettre à jour l'état avec l'email récupéré
    }
  }, []);

  // Fonction pour envoyer la requête d'activation de réinitialisation de mot de passe
  const handleResendRequest = async () => {
    if (!email) {
      setMessage("Email non disponible. Impossible de renvoyer la demande.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Afficher un toast de succès
        toast.success("Un nouveau mail a été envoyé pour réinitialiser ton mot de passe.");
      } else {
        // Afficher un toast d'erreur
        toast.error(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      // Afficher un toast d'erreur
      toast.error("Erreur lors de la requête.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image
            src="/images/ht241.png"
            alt="H241 HIGH TECH Logo"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">La demande de réinitialisation a été envoyée</h1>
          <p className="text-gray-600 mb-4">
            Un mail a été envoyé pour la réinitialisation du mot de passe. Veuillez cliquer sur le lien dans l'email pour réinitialiser votre mot de passe.
          </p>

          {/* Affiche l'email récupéré ou un texte par défaut */}
          <div className="text-gray-900 font-medium mb-6">
            {email ? email : "Email non disponible"}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Si vous ne recevez pas de mail, veuillez vérifier que l'email renseigné est correct. Aussi, vérifiez
              les spams.
            </p>
          </div>
          {/* Action Links */}
          <div className="space-y-4">
            <div className="text-center">
              <button
                onClick={handleResendRequest}
                className="text-black hover:underline font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Je n'ai pas reçu de mail ! Renvoyez"}
              </button>
            </div>
            <div className="text-center">
              <Link href="/login" className="text-black hover:underline font-medium">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
