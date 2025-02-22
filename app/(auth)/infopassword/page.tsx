'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Info } from "lucide-react"

export default function PasswordResetConfirmation() {
  // Déclare une variable d'état pour stocker l'email récupéré
  const [email, setEmail] = useState<string | null>(null)

  // Utilise useEffect pour récupérer l'email depuis localStorage au montage du composant
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") // Récupérer l'email de localStorage
    if (storedEmail) {
      setEmail(storedEmail) // Mettre à jour l'état avec l'email récupéré
    }
  }, [])

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
            Un mail a été envoyé pour la réinitialisation du mot de passe, veuillez cliquer sur le lien.
          </p>

          {/* Affiche l'email récupéré ou un texte par défaut */}
          <div className="text-gray-900 font-medium mb-6">
            {email ? email : "Email non disponible"}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Si vous ne recevez pas de mail, veuillez vérifier que l&apos;email renseigné est correct. Aussi vérifiez
              les spams.
            </p>
          </div>

          {/* Action Links */}
          <div className="space-y-4">
            <div className="text-center">
              <Link href="/reset-password" className="text-black hover:underline font-medium">
                Je n&apos;ai pas reçu de mail ! Renvoyez
              </Link>
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
  )
}
