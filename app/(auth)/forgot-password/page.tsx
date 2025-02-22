"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false) // État pour suivre le clic du bouton

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Indiquer que l'action est en cours
  
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Email envoyé ! Vérifie ta boîte mail.");
      } else {
        alert(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la requête.");
    } finally {
      setIsLoading(false); // Réinitialiser après la requête
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Mot de passe oublié ?</h1>
          <p className="text-gray-600 mb-6">
            Ne t&apos;inquiète pas nous t&apos;enverrons un lien par mail pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Entrez votre email"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={isLoading}>
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link href="/login" className="text-black hover:underline font-semibold">
                Connexion
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
