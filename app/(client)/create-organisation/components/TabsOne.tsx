"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { UploadButton } from "@/utils/uploadthing"
import { toast } from "sonner"

interface FormData {
  logo: string | null
  organizationName: string
  slug: string
  domain: string | null
  ownerId: string
}

interface OrganizationStepProps {
  formData: FormData
  setFormData: (data: FormData) => void
  onNext: () => void
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/[^\w-]+/g, "") // Supprimer les caractères spéciaux
    .replace(/--+/g, "-") // Empêcher les doubles tirets
    .replace(/^-+|-+$/g, "") // Supprimer les tirets au début et à la fin
    .slice(0, 50) // Limiter à 50 caractères
}

export function OrganizationStep({ formData, setFormData, onNext }: OrganizationStepProps) {
  const [slugEdited, setSlugEdited] = useState(false)

  // Handle the organization name change and auto-generate the slug
  const handleOrganizationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = generateSlug(name)

    setFormData({
      ...formData,
      organizationName: name,
      slug: slugEdited ? formData.slug : slug, // Only update slug if not edited by the user
    })
  }

  // Handle the slug input change manually by the user
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value
    setSlugEdited(true) // Indicate that the user has edited the slug
    const validSlug = generateSlug(newSlug) // Generate a valid slug from user input
    setFormData({ ...formData, slug: validSlug }) // Set the valid slug
  }

  const isNextDisabled = !formData.logo || !formData.organizationName || !formData.slug

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Ajouter une organisation</h2>
        <p className="text-sm text-gray-500">
          Nous avons simplement besoin de quelques informations de base pour configurer votre organisation. Vous pourrez
          les modifier ultérieurement.
        </p>
      </div>

      <div className="space-y-4">
        {/* Logo Section */}
        <div>
          <Label htmlFor="logo">Logo *</Label>
          <div className="mt-2 flex items-center gap-6">
            <div className="flex items-center justify-center hover:border-primary cursor-pointer">
              <label htmlFor="logo" className="cursor-pointer text-black p-4 text-center">
                <UploadButton
                  endpoint="imageUploader"
                  className="relative h-full w-full ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                  onClientUploadComplete={(res: any) => {
                    console.log("Fichiers uploadés: ", res)
                    if (res && res[0]) {
                      setFormData({ ...formData, logo: res[0].ufsUrl })
                      toast.success("Upload du logo terminé !")
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Erreur lors de l'upload: ${error.message}`)
                  }}
                />
              </label>
            </div>

            {/* Display logo if available */}
            {formData.logo && (
              <div className="w-32 h-32 flex items-center justify-center border-2 border-solid border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={formData.logo || "/placeholder.svg"}
                  alt="Logo prévisualisé"
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Organization Name Section */}
        <div>
          <Label htmlFor="organizationName">Nom de l&apos;organisation *</Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={handleOrganizationNameChange}
            className="mt-2"
            disabled={!formData.logo} // Désactiver si pas de logo
          />
        </div>

        {/* Slug Section */}
        <div>
          <Label htmlFor="slug">Slug généré</Label>
          <div className="mt-2 flex items-center">
            <span className="text-gray-500">/organisation/</span>
            <Input
              id="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              className="flex-1"
              disabled={!formData.organizationName}
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <Button onClick={onNext} className="w-full bg-black hover:bg-black/90" disabled={isNextDisabled}>
        Étape suivante
      </Button>
    </div>
  )
}
