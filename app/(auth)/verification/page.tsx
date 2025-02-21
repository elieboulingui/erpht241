"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(5).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Récupérer l'email depuis le localStorage
  const email = typeof window !== "undefined" ? localStorage.getItem('userEmail') : null; // Récupérer l'email du localStorage

  // Focus initial sur le premier champ
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [])

  // Gérer le focus sur le champ vide suivant après une modification
  useEffect(() => {
    const firstEmptyInputIndex = verificationCode.findIndex(value => value === "")
    if (firstEmptyInputIndex !== -1) {
      inputRefs.current[firstEmptyInputIndex]?.focus()
    }
  }, [verificationCode])

  // Gérer les changements de valeur dans les champs de saisie
  const handleChange = (index: number, value: string) => {
    // Accepter uniquement les chiffres ou les lettres
    if (/^[A-Za-z0-9]*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Focus sur le champ suivant si la valeur est remplie et ce n'est pas le dernier champ
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  // Gérer les actions de suppression avec la touche Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus() // Focus sur le champ précédent
    }
  }

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = verificationCode.join("")

    if (!code || !email) {
      alert("Veuillez entrer un code valide et vérifier que vous êtes connecté.")  // Remplacer toast par alert
      return
    }

    if (!/^[A-Za-z0-9]+$/.test(code)) {
      alert("Le code de vérification n'est pas valide. Assurez-vous qu'il ne contient que des lettres et des chiffres.")  // Remplacer toast par alert
      return
    }

    try {
      const res = await fetch('/api/auth/verifytoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, token: code }),
      })

      if (!res.ok) {
        throw new Error("Erreur dans la réponse du serveur.")
      }

      const data = await res.json()

      if (data.error) {
        alert(data.error || "Code invalide.")  // Remplacer toast par alert
        return
      }

      alert("Token validé avec succès.")  // Remplacer toast par alert
      window.location.href = "/login"  // Redirection après validation

    } catch (err) {
      alert("Une erreur est survenue. Veuillez réessayer.")  // Remplacer toast par alert
    }
  }

  // Gérer l'envoi d'un nouvel email de vérification
  const handleResend = async () => {
    if (!email) {
      alert("L'email n'a pas été trouvé. Veuillez vous reconnecter.")  // Remplacer toast par alert
      return
    }

    try {
      const res = await fetch('/api/auth/resend-verification-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur dans la réponse du serveur.")
      }

      const data = await res.json()

      if (data.error) {
        alert(data.error || "Une erreur est survenue lors de l'envoi de l'email.")  // Remplacer toast par alert
        return
      }

      alert("L'email de vérification a été renvoyé. Veuillez vérifier vos emails.")  // Remplacer toast par alert

    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Une erreur est survenue lors de l'envoi de l'email: ${err.message || 'Veuillez réessayer.'}`)  // Remplacer toast par alert
      } else {
        alert("Une erreur inconnue est survenue lors de l'envoi de l'email. Veuillez réessayer.")  // Remplacer toast par alert
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8">
        <Image
          src="/images/ht241.png"
          alt="High Tech Logo"
          width={100}
          height={100}
          className="h-12 w-auto"
        />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            S&apos;il vous plait checker vos email
          </h1>
          <p className="text-gray-600 text-center">
            Votre compte a été créé avec succès. Un email de confirmation vous a été envoyé.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"  // Accepter les lettres et les chiffres
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center border rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-lg"
                  aria-label={`Digit ${index + 1} of verification code`}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Connexion
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Je n&apos;ai pas recu de mail ! </span>
              <button
                type="button"
                onClick={handleResend}
                className="text-black underline hover:text-gray-600"
              >
                Renvoyez
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
