"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { UploadButton } from "@/utils/uploadthing"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Niveau } from "@/app/agents/contact/composant/types"

interface ManualContactFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  organisationId: string | null
  saveContactToDatabase: (contactData: any) => Promise<any>
}

export default function ManualContactForm({
  isOpen,
  onOpenChange,
  organisationId,
  saveContactToDatabase,
}: ManualContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [niveau, setNiveau] = useState<Niveau>("CLIENT")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [adresse, setAdresse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formValid, setFormValid] = useState(true)
  const [status_contact, setStatus_contact] = useState("COMPAGNIE")
  const [sector, setSector] = useState("")

  useEffect(() => {
    setFormValid(!!name && !!phone && !!organisationId && !!adresse && !!status_contact && !!sector)
  }, [name, phone, organisationId, adresse, status_contact])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const tagsString = tags.join(",")

    const newContact = {
      name,
      email,
      phone,
      niveau,
      tags: tagsString,
      organisationIds: [organisationId!],
      logo,
      adresse,
      status_contact,
      sector,
    }

    setLoading(true)
    setError(null)

    try {
      await saveContactToDatabase(newContact)

      // Reset form fields after successful submission
      setName("")
      setEmail("")
      setPhone("")
      setNiveau("CLIENT")
      setTags([])
      setTagInput("")
      setLogo(null)
      setAdresse("")
      setStatus_contact("COMPAGNIE")
      setSector("")

      // Close the sheet
      onOpenChange(false)
    } catch (error: any) {
      console.error("Erreur lors de la création du contact", error)
      setError(`Une erreur est survenue : ${error.message || "inconnue"}`)
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Ajouter un nouveau contact</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] overflow-y-auto">
          <form className="space-y-4 mt-4 pr-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="status_contact" className="font-medium">
                Statut
              </label>
              <div className="flex gap-4 mt-2">
                {/* Radio Personne */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_contact"
                    value="PERSONNE"
                    checked={status_contact === "PERSONNE"}
                    onChange={() => setStatus_contact("PERSONNE")}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center peer-checked:bg-black">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${status_contact === "PERSONNE" ? "bg-black" : "bg-transparent"}`}
                    ></div>
                  </div>
                  Personne
                </label>

                {/* Radio Compagnie */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_contact"
                    value="COMPAGNIE"
                    checked={status_contact === "COMPAGNIE"}
                    onChange={() => setStatus_contact("COMPAGNIE")}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center peer-checked:bg-black">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${status_contact === "COMPAGNIE" ? "bg-black" : "bg-transparent"}`}
                    ></div>
                  </div>
                  Compagnie
                </label>

                {/* Radio Grossiste */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_contact"
                    value="GROSSISTE"
                    checked={status_contact === "GROSSISTE"}
                    onChange={() => setStatus_contact("GROSSISTE")}
                    className="hidden peer"
                  />
                  <div className="w-4 h-4 border-2 border-black rounded-full flex items-center justify-center peer-checked:bg-black">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${status_contact === "GROSSISTE" ? "bg-black" : "bg-transparent"}`}
                    ></div>
                  </div>
                  Grossiste
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Secteur d&apos;activité</Label>
              <Input
                id="sector"
                placeholder="Entrez le secteur d'activité"  
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" placeholder="Entrez le nom" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez l'email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                placeholder="Entrez le numéro de téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niveau">Niveau</Label>
              <Select value={niveau} onValueChange={(value) => setNiveau(value as Niveau)}>
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
              <Label htmlFor="tags">Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="tagInput"
                  placeholder="Ajouter un tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} className="shrink-0">
                  Ajouter
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="mt-2 border rounded-md p-2">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Tag</th>
                        <th className="text-right py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.map((tag, index) => (
                        <tr key={index} className={index < tags.length - 1 ? "border-b" : ""}>
                          <td className="py-2 px-2">{tag}</td>
                          <td className="text-right py-2 px-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTag(tag)}
                              className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              Supprimer
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="Adresse">Adresse</Label>
              <Input
                id="Adresse"
                placeholder="Entrez l'adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-[#7f1d1c] text-white ut-button:ut-readying:bg-[#7f1d1c]"
                onClientUploadComplete={(res: any) => {
                  if (res && res[0]) {
                    setLogo(res[0].ufsUrl)
                    toast.success("Upload du logo terminé !")
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Erreur lors de l'upload: ${error.message}`)
                }}
              />

              {logo && (
                <div className="mt-2">
                  <img src={logo || "/placeholder.svg"} alt="Logo" className="w-32 h-32 object-cover rounded" />
                </div>
              )}
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white"
              disabled={loading || !formValid}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sauvegarde en cours...
                </span>
              ) : (
                "Enregistrer le contact"
              )}
            </Button>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

