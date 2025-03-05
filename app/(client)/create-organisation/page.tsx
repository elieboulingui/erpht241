"use client"

import { useEffect, useState } from "react";
import { OrganizationStep } from "./components/TabsOne";
import { TeamStep } from "./components/TabsTwo";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import React from "react";

// OnboardingPageProps n'est plus nécessaire ici pour le type d'export
export default function Page() {
  // Assurez-vous que ownerId est obtenu depuis un autre endroit, par exemple, via `useEffect` ou depuis un contexte.
  const [ownerId, setOwnerId] = useState<string>("");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    logo: null as string | null,
    organizationName: "",
    slug: "",
    team: [{ email: "", role: "Membre" }],
    ownerId, // Utilisation du state pour ownerId
  });

  // Vous pouvez définir ownerId ici via un useEffect si vous l'obtenez de localStorage, d'un API, ou autre.
  useEffect(() => {
    const storedOwnerId = localStorage.getItem("ownerId");
    if (storedOwnerId) {
      setOwnerId(storedOwnerId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="relative mb-8">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-sm text-gray-900 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </button>
          )}
          <div className="flex justify-center">
            <Image
               src="/images/ht241.png" 
              alt="High2Tech Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500">Step {step} sur 2</p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full w-32 rounded-full bg-black transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 ? (
            <OrganizationStep
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
            />
          ) : (
            <TeamStep formData={formData} setFormData={setFormData} />
          )}
        </div>
      </div>
    </div>
  );
}
