"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Assurez-vous d'avoir bien installé sonner
import { useRouter } from "next/navigation"; // Importation de useRouter
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailExists, setEmailExists] = useState<boolean | null>(null); // Ajout de l'état pour la vérification de l'email
  const [isLoading, setIsLoading] = useState(false); // Ajout de l'état de chargement
  const router = useRouter();

  // Fonction pour vérifier si l'email existe
  const checkEmailExistence = async (email: string) => {
    setEmailExists(null);
    const response = await fetch("/api/auth/emailChecked", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (data.exists === false) {
      toast.error("L'email n'existe pas dans notre base de données.");
      setEmailExists(false);
    } else {
      setEmailExists(true);
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Vérification si l'email existe
    if (emailExists === null) {
      await checkEmailExistence(email);
    }

    if (emailExists === false) {
      setIsLoading(false);
      return;
    }

    // Vérification du mot de passe
    if (!password || password.length < 6) {
      toast.error("Le mot de passe doit comporter au moins 6 caractères.");
      setIsLoading(false);
      return;
    }

    // Tentative de connexion
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Mot de passe incorrect.");
      } else {
        toast.error("Erreur de connexion.");
      }
    } else {
      toast.success("Connexion réussie !");
      router.push("/pos/dashboard"); // Redirection après connexion réussie
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Section principale avec fond orange et courbe blanche */}
      <div className="flex-1 bg-gradient-to-br from-red-900 to-red-950 relative flex flex-col items-center pt-10 pb-20">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-20 h-20 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
              <path d="M50,0 C60,0 70,10 70,25 C70,10 80,0 90,0 C100,0 100,10 100,25 C100,40 90,50 75,50 C90,50 100,60 100,75 C100,90 90,100 75,100 C60,100 50,90 50,75 C50,90 40,100 25,100 C10,100 0,90 0,75 C0,60 10,50 25,50 C10,50 0,40 0,25 C0,10 10,0 25,0 C40,0 50,10 50,25 Z" />
            </svg>
          </div>
        </div>

        {/* Texte de bienvenue */}
        <h1 className="text-white text-3xl font-medium mb-8">Bon retour !</h1>

        {/* Carte de connexion */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-8 z-10">
          <h2 className="text-2xl font-bold mb-6">Connexion</h2>

          <form onSubmit={handleSubmit}>
            {/* Champ email */}
            <div className="mb-4 relative">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <div className="h-full aspect-square bg-red-900 flex items-center justify-center rounded-l-md">
                  <Mail className="h-5 w-5 text-white" />
                </div>
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                className="pl-20 h-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Champ mot de passe */}
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <div className="h-full aspect-square bg-red-900 flex items-center justify-center rounded-l-md">
                  <Key className="h-5 w-5 text-white" />
                </div>
              </div>
              <Input
                type="password"
                placeholder="Password"
                className="pl-20 h-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              className="w-full h-14 text-lg bg-red-900 hover:bg-red-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Connexion"}
            </Button>
          </form>
        </div>

        {/* Forme courbe blanche en bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 bg-white"
          style={{
            borderTopLeftRadius: "50% 100%",
            borderTopRightRadius: "50% 100%",
          }}
        ></div>
      </div>
    </div>
  );
}
