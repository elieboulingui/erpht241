"use client";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SignIn from "@/app/components/signin-button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInButton from "@/app/components/sign-microsoft";
import { toast } from "sonner"; // Import de toast
import { Toaster } from "sonner"; // Composant pour afficher les notifications

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
      router.push("/verificationorganisation");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 flex flex-col items-center justify-center">
      <Toaster /> {/* Ajout du Toaster pour afficher les notifications */}
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="Safrimat ia"
            width={200}
            height={100}
            className="object-contain"
          />
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <h1 className="text-2xl font-semibold">Connectez-vous à votre compte</h1>
            <p className="text-sm text-muted-foreground">
              Bienvenue ! Veuillez vous connecter pour continuer.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => checkEmailExistence(email)}
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className=" text-sm text-muted-foreground hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="h-11 pr-10"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-gray-400"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Formulaire de soumission */}
            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium bg-black hover:bg-black/90"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Connexion"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-muted-foreground">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SignIn />
              <SignInButton />
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Vous n&apos;avez pas de compte ?{" "}
              </span>
              <Link href="/register" className="text-sm text-muted-foreground hover:underline">
                Créer un
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
