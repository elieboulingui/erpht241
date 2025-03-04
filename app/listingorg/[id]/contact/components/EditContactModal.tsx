"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateContact } from "../action/updateContact"
import { UploadButton } from "@/utils/uploadthing"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  stage: string
  tags: string
  adresse?: string
  record?: string
  logo?: string
  status_contact: string
}

interface EditContactModalProps {
  contact: Contact
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EditContactModal({ contact, isOpen, onClose, onSuccess }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || "",
    stage: contact.stage || "LEAD",
    tags: "",
    adresse: contact.adresse || "",
    record: contact.record || "",
    logo: contact.logo || "",
    status_contact: "PEOPLE",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Convertir les tags en tableau s'ils sont sous forme de chaîne
    const initialTags = Array.isArray(contact.tags)
      ? contact.tags.join(", ")
      : typeof contact.tags === "string"
        ? contact.tags
        : "-"

    // Réinitialiser le formulaire avec les données du contact actuel
    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      stage: contact.stage || "LEAD",
      tags: initialTags,
      adresse: contact.adresse || "",
      record: contact.record || "",
      logo: contact.logo || "",
      status_contact: contact.status_contact || "PEOPLE",
    })
  }, [contact]) // Dépendance à contact pour que l'effet s'exécute quand contact change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleStageChange = (value: string) => {
    setFormData({
      ...formData,
      stage: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Convertir les tags en tableau
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      // Appeler la fonction de mise à jour
      await updateContact(contact.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        stage: formData.stage as "LEAD" | "WON" | "QUALIFIED",
        tags: tagsArray.join(),
        adresse: formData.adresse,
        record: formData.record,
        logo: formData.logo,
        status_contact: formData.status_contact,
      })

      toast({
        title: "Contact mis à jour",
        description: "Le contact a été mis à jour avec succès.",
        variant: "default",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contact:", error)
      setError(error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du contact.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formValid = formData.name && formData.email

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Modifier le contact</SheetTitle>
        </SheetHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="status_contact">Status</Label>
            <Select
              value={formData.status_contact}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status_contact: value as string,
                })
              }
              disabled
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEOPLE">Personne</SelectItem>
                <SelectItem value="COMPAGNIE">Compagnie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrez le nom"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez l'email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Entrez le numéro de téléphone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Stage</Label>
            <Select value={formData.stage} onValueChange={handleStageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEAD">Prospect</SelectItem>
                <SelectItem value="WON">Client</SelectItem>
                <SelectItem value="QUALIFIED">Prospect potentiel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="tag1, tag2, tag3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Entrez l'adresse"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="record">Record</Label>
            <Input
              id="record"
              name="record"
              value={formData.record}
              onChange={handleChange}
              placeholder="Entrez le record"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <UploadButton
              endpoint="imageUploader"
              className="ut-button:bg-[#F65F57] ut-button:ut-readying:bg-[#F65F57]/50"
              onClientUploadComplete={(res: any) => {
                if (res && res[0]) {
                  setFormData({
                    ...formData,
                    logo: res[0].ufsUrl,
                  })
                  toast({
                    title: "Succès",
                    description: "Upload du logo terminé !",
                    variant: "default",
                  })
                }
              }}
              onUploadError={(error: Error) => {
                toast({
                  title: "Erreur",
                  description: `Erreur lors de l'upload: ${error.message}`,
                  variant: "destructive",
                })
              }}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-black hover:bg-black/70 text-white"
            disabled={isSubmitting || !formValid}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Mise à jour en cours...
              </span>
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, variant }: ToastProps) => {
  // Dans un environnement réel, cela afficherait une notification toast
  console.log(`Toast: ${title} - ${description}`)
}
