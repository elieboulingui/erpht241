"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Importer useRouter
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(5).fill(""));
  const [token, setToken] = useState<string | null>(null); // Pour stocker le token
  const router = useRouter();
  
  // Récupérer l'ID du token depuis l'URL avec useRouter
  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token as string); // Sauvegarder le token dans l'état
    }
  }, [router.query.token]); // Si le token change dans l'URL, mettez à jour l'état

  // Focus initial sur le premier champ
  useEffect(() => {
    if (verificationCode.length > 0) {
      // Focus sur le premier champ
      document.getElementById("input-0")?.focus();
    }
  }, []);

  // Gérer le focus sur le champ vide suivant après une modification
  useEffect(() => {
    const firstEmptyInputIndex = verificationCode.findIndex(value => value === "");
    if (firstEmptyInputIndex !== -1) {
      document.getElementById(`input-${firstEmptyInputIndex}`)?.focus();
    }
  }, [verificationCode]);

  // Gérer les changements de valeur dans les champs de saisie
  const handleChange = (index: number, value: string) => {
    if (/^[A-Za-z0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 4) {
        document.getElementById(`input-${index + 1}`)?.focus();
      }
    }
  };

  // Gérer les actions de suppression avec la touche Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      document.getElementById(`input-${index - 1}`)?.focus();
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");

    if (!code || !token) {
      alert("Veuillez entrer un code valide et vérifier le token.");
      return;
    }

    if (!/^[A-Za-z0-9]+$/.test(code)) {
      alert("Le code de vérification n'est pas valide.");
      return;
    }

    try {
      const res = await fetch('/api/auth/verifytoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, verificationCode: code }),
      });

      if (!res.ok) {
        throw new Error("Erreur dans la réponse du serveur.");
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error || "Code invalide.");
        return;
      }

      alert("Token validé avec succès.");
      window.location.href = "/login"; // Redirection après validation
    } catch (err) {
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

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
            S&apos;il vous plaît vérifiez vos emails
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
                  id={`input-${index}`}
                  type="text"
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
              <span className="text-gray-600">Je n&apos;ai pas reçu de mail ! </span>
              <button
                type="button"
                onClick={() => alert("Renvoyer l'email")}
                className="text-black underline hover:text-gray-600"
              >
                Renvoyez
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
