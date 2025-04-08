"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadButton } from "@/utils/uploadthing"
import { UpdateContact } from "../action/updateContact"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Définir l'interface UpdatedContact pour être compatible avec celle de ContactsTables
interface UpdatedContact {
  id: string
  name: string
  logo?: string
  icon?: string | React.JSX.Element
  email: string
  phone: string
  link: string
  niveau: string
  adresse?: string
  tags: string
  status_contact: string
  sector: string
}

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  niveau: string
  tags: string
  adresse?: string
  logo?: string
  status_contact: string
  sector: string
  link?: string
}

interface EditContactModalProps {
  contact: Contact
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedContact: UpdatedContact) => void // Modifié pour utiliser UpdatedContact
}

export function EditContactModal({ contact, isOpen, onClose, onSuccess }: EditContactModalProps) {
  const [formData, setFormData] = useState({
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || "",
    niveau: contact.niveau || "CLIENT",
    tags: contact.tags,
    adresse: contact.adresse || "",
    logo: contact.logo || "",
    status_contact: "",
    sector: contact.sector,
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
      niveau: contact.niveau || "CLIENT",
      tags: initialTags,
      adresse: contact.adresse || "",
      logo: contact.logo || "",
      status_contact: contact.status_contact || "COMPAGNIE",
      sector: contact.sector ,
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
      niveau: value,
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

      // Créer l'objet contact mis à jour
      const updatedContactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        niveau: formData.niveau as "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT",
        tags: tagsArray.join(),
        adresse: formData.adresse,
        logo: formData.logo,
        status_contact: formData.status_contact as "PERSONNE" | "COMPAGNIE" | "GROSSISTE",
        sector: formData.sector,
      }

      // Appeler la fonction de mise à jour
      await UpdateContact(contact.id, updatedContactData)

      // Créer l'objet contact complet avec l'ID pour le passer au parent
      // S'assurer que link est défini pour correspondre à l'interface UpdatedContact
      const updatedContact: UpdatedContact = {
        id: contact.id,
        ...updatedContactData,
        link: contact.link || `/contacts/${contact.id}`,
      }

      toast({
        title: "Contact mis à jour",
        description: "Le contact a été mis à jour avec succès.",
        variant: "default",
      })

      // Passer le contact mis à jour au parent
      onSuccess(updatedContact)
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
        <ScrollArea className="h-[calc(100vh-80px)] overflow-y-auto">

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="status_contact">Statut</Label>
              <RadioGroup
                value={formData.status_contact}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status_contact: value as string,
                  })
                }
              >
                <div className="flex gap-2">
                  {/* Radio Personne */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="PERSONNE"
                      className="peer hidden"
                    />
                    <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${formData.status_contact === "PERSONNE" ? "bg-black" : "bg-transparent"}`}></div>
                    </div>
                    Personne
                  </label>

                  {/* Radio Compagnie */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="COMPAGNIE"
                      className="peer hidden"
                    />
                    <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${formData.status_contact === "COMPAGNIE" ? "bg-black" : "bg-transparent"}`}></div>
                    </div>
                    Compagnie
                  </label>

                  {/* Radio Grossiste */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="GROSSISTE"
                      className="peer hidden"
                    />
                    <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${formData.status_contact === "GROSSISTE" ? "bg-black" : "bg-transparent"}`}></div>
                    </div>
                    Grossiste
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="sector">Secteur</Label>
              <Input id="sector" name="sector" value={formData.sector} onChange={handleChange} className="col-span-3" />
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
              <Label htmlFor="niveau">Niveau</Label>
              <Select value={formData.niveau} onValueChange={handleStageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROSPECT_POTENTIAL">Prospect potentiel</SelectItem>
                  <SelectItem value="PROSPECT">Prospect</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
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
              <Label htmlFor="logo">Logo</Label>
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-black ut-button:ut-readying:bg-black"
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
              {/* Prévisualisation de l'image téléchargée */}
              {formData.logo && (
                <div className="mt-2">
                  <img
                    src={formData.logo}
                    alt="Logo"
                    className="w-32 h-32 object-cover rounded"
                  />
                </div>
              )}
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
        </ScrollArea>
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