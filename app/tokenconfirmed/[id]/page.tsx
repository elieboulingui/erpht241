"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"; // Importer toast de sonner

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(5).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Retrieve the email from localStorage
  const email = typeof window !== "undefined" ? localStorage.getItem('userEmail') : null;

  // Extract the token from the URL
  const extractTokenFromUrl = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/tokenconfirmed\/([A-Za-z0-9]+)/);

    if (match && match[1]) {
      const tokenFromUrl = match[1];
      setVerificationCode(tokenFromUrl.split("")); // Fill the input fields with the token characters
      return tokenFromUrl;
    }

    return null;
  };

  // Run on mount to extract the token from the URL
  useEffect(() => {
    extractTokenFromUrl();
  }, []);

  // Focus the first input field on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle the change in the input fields
  const handleChange = (index: number, value: string) => {
    if (/^[A-Za-z0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Focus the next input if the current one is filled
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace to focus the previous input field
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Submit the form automatically after all inputs are filled
  useEffect(() => {
    const code = verificationCode.join(""); // Join the input values into a single code string

    if (code.length === 5 && email) { // Check if the code is complete and the email exists
      // Send the verification request to the API
      const verifyToken = async () => {
        try {
          const res = await fetch("/api/auth/verifytoken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ identifier: email, token: code }),
          });

          if (!res.ok) {
            throw new Error("Erreur dans la réponse du serveur.");
          }

          const data = await res.json();

          if (data.error) {
            toast.error(data.error || "Code invalide.");
            return;
          }

          toast.success("Token validé avec succès.");
          window.location.href = "/login"; // Redirect after successful validation
        } catch (err) {
          toast.error("Une erreur est survenue. Veuillez réessayer.");
        }
      };

      verifyToken();
    }
  }, [verificationCode, email]);

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
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
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

            <div className="text-center">
              <span className="text-gray-600">Vous n&apos;avez pas reçu de mail? </span>
              <button
                type="button"
                onClick={() => toast.info("Renvoyer l'email de vérification...")}
                className="text-black underline hover:text-gray-600"
              >
                Renvoyez
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
