'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"  // Importing the toast from sonner

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("") // Nouveau champ pour la confirmation
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // Afficher ou masquer le mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // Afficher ou masquer la confirmation du mot de passe
  const [token, setToken] = useState<string | null>(null) // Stocker le token
  const router = useRouter()

  useEffect(() => {
    // Extraction du token depuis l'URL avec une expression régulière
    const regex = /reset-passwords\/([a-f0-9]{64})/; // Token est une chaîne hexadécimale de 64 caractères
    const match = window.location.href.match(regex)
    if (match && match[1]) {
      setToken(match[1]) // Définir le token si trouvé
      console.log("Token trouvé :", match[1])
    } else {
      console.log("Token non trouvé dans l'URL")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // Vérifier si le mot de passe, la confirmation du mot de passe et le token sont présents
    if (!token) {
      setError("Le token est requis.")
      toast.error("Le token est requis.")
      setIsLoading(false)
      return
    }

    if (!password || !confirmPassword) {
      setError("Le mot de passe et sa confirmation sont requis.")
      toast.error("Le mot de passe et sa confirmation sont requis.")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      toast.error("Les mots de passe ne correspondent pas.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success("Mot de passe réinitialisé avec succès !")
        router.push("/login") // Redirection après succès
      } else {
        setError(data.error || "Une erreur est survenue.")
        toast.error(data.error || "Une erreur est survenue.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la requête.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Réinitialisation du mot de passe</h1>
          <p className="text-gray-600 mb-6">Entrez votre nouveau mot de passe</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Champ Confirmation du mot de passe */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
              {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
