"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { OrganizationStep } from "./components/TabsOne"
import { DomainStep } from "./components/TabsTwo"

// Define the form data structure
interface FormData {
  logo: string | null
  organizationName: string
  slug: string
  domain: string | null
  ownerId: string
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    logo: null,
    organizationName: "",
    slug: "",
    domain: null,
    ownerId: "",
  })

  // Handle form submission after completing all steps
  const handleSubmit = async () => {
    if (loading) return

    if (!formData.logo || !formData.organizationName || !formData.slug || !formData.domain) {
      toast.error("Veuillez remplir tous les champs requis")
      return
    }

    setLoading(true)

    const body = {
      name: formData.organizationName,
      slug: formData.slug,
      logo: formData.logo,
      domain: formData.domain,
    }

    try {
      const response = await fetch("/api/createorg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("Réponse du serveur:", result)
        toast.success("Organisation créée avec succès !")
        // Redirect to dashboard or next page
        // window.location.href = "/dashboard"
      } else {
        console.error("Erreur serveur:", result)
        toast.error(result.error || "Une erreur s'est produite lors de la création de l'organisation.")
      }
    } catch (error) {
      console.error("Erreur de communication avec le serveur:", error)
      toast.error("Erreur de communication avec le serveur.")
    } finally {
      setLoading(false)
    }
  }

  // Handle next step
  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      handleSubmit()
    }
  }

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
            <Image src="/images/ht241.png" alt="High2Tech Logo" width={120} height={60} className="h-12 w-auto" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500">Étape {step} sur 2</p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-black transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 ? (
            <OrganizationStep formData={formData} setFormData={setFormData} onNext={handleNext} />
          ) : (
            <DomainStep formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} />
          )}
        </div>
      </div>
    </div>
  )
}
