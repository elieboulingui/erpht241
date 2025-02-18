"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SignIn } from "@/app/components/signin-button" // This component now renders a button, not a form.

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({}) // Réinitialiser les erreurs des champs

    if (!name || !email || !password) {
      const errors: { [key: string]: string } = {}
      if (!name) errors.name = "Le nom est requis."
      if (!email) errors.email = "L'email est requis."
      if (!password) errors.password = "Le mot de passe est requis."
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        setLoading(false)
        return
      }

      // Gestion du succès (ex. redirection vers la page de connexion)
      window.location.href = "/TokenConfirmed"  // Ou utilisez le routage de next.js : `router.push('/login')`

    } catch (err) {
      setError("Une erreur est survenue.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <img
             src="/images/ht241.png"
            alt="High Tech Logo"
            width={100}
            height={100}
            className="h-12 w-auto"
          />
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-2xl font-semibold text-center">Créer votre compte</h1>
            <p className="text-sm text-center text-muted-foreground">
              Veuillez remplir les détails pour commencer.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">
                  Nom complet
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    className="pl-10"
                    placeholder="Entrez votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <User className="h-5 w-5" />
                  </span>
                </div>
                {fieldErrors.name && <p className="text-red-500 text-sm">{fieldErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </span>
                </div>
                {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium" htmlFor="password">
                    Mot de passe
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <EyeOff className="h-5 w-5" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}
              </div>

              <Button className="w-full bg-black text-white hover:bg-gray-800" disabled={loading}>
                {loading ? "Chargement..." : "Créer un compte"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-muted-foreground">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SignIn /> {/* Bouton de connexion */}
                <Button variant="outline" className="w-full">
                  <Image
                        src="/images/google.png"
                    alt="Microsoft"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Google
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="font-semibold hover:underline">
                  Connectez-vous
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
