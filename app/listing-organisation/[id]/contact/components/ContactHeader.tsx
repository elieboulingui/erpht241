"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { UploadButton } from "@/utils/uploadthing"
import { Input } from "@/components/ui/input"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { IoMdInformationCircleOutline } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AIContactDialog } from "./AIContactGeneratorModal"
import { ScrollArea } from "@/components/ui/scroll-area"

// Add this declaration at the top of the file, after imports
declare global {
  interface Window {
    createdContact: any
  }
}

type Stage = "LEAD" | "WON" | "QUALIFIED"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  stage: Stage
  tags: string
  logo?: string | null
  adresse: string
  record: string
  status_contact: string
}

const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listing-organisation\/([^/]+)\/contact/)
  return match ? match[1] : null
}

export default function ContactHeader() {
  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [stage, setStage] = useState<Stage>("LEAD")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [adresse, setAdresse] = useState("")
  const [record, setRecord] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formValid, setFormValid] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [status_contact, setStatus_contact] = useState("PERSONNE")
  // Remove this line:
  // const [contacts, setContacts] = useState<Contact[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.pathname
      const id = extractIdFromUrl(url)
      if (id) {
        setOrganisationId(id)
      } else {
        console.error("Aucun ID d'organisation trouvé dans l'URL")
      }
    }
  }, [])

  useEffect(() => {
    setFormValid(
      !!name && !!email && !!phone && !!logo && !!organisationId && !!adresse && !!record && !!status_contact,
    )
  }, [name, email, phone, logo, organisationId, adresse, record, status_contact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!organisationId) {
      console.error("Organisation ID is missing")
      setError("L'ID de l'organisation est manquant")
      return
    }

    const tagsString = tags.join(",")

    const newContact = {
      name,
      email,
      phone,
      stage,
      tags: tagsString,
      organisationIds: [organisationId],
      logo,
      adresse,
      record,
      status_contact,
    }

    console.log("Données envoyées à l'API :", newContact)

    setLoading(true)
    setError(null)

    // Show loading toast
    const loadingToast = toast.loading("Création du contact en cours...")

    try {
      const response = await fetch("/api/createcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      })

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Vérifier si la réponse est correcte
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erreur serveur : ${errorText || response.statusText}`)
      }

      // Vérifier si la réponse contient du JSON
      const responseData = await response.json()
      if (responseData?.message) {
        toast.success(responseData.message)

        // Reset form fields after successful submission
        setName("")
        setEmail("")
        setPhone("")
        setStage("LEAD")
        setTags([])
        setTagInput("")
        setLogo(null)
        setAdresse("")
        setRecord("")
        setStatus_contact("PERSONNE")

        // Close the sheet
        setIsSheetOpen(false)

        // Trigger a custom event to notify the contacts table to refresh
        const event = new CustomEvent("contactCreated", {
          detail: { organisationId },
        })
        window.dispatchEvent(event)
      } else {
        throw new Error("Réponse du serveur invalide, message manquant.")
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du contact", error)
      setError(`Une erreur est survenue : ${error.message || "inconnue"}`)
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-black font-bold" href="#">
                    Contacts
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center">
            <AIContactDialog
              onContactGenerated={(contactData) => {
                const newContact = {
                  id: crypto.randomUUID(),
                  name: contactData.name,
                  email: contactData.email || "",
                  phone: contactData.phone || "",
                  stage: "LEAD" as Stage,
                  tags: "",
                  logo: "",
                  adresse: contactData.adresse || "",
                  record: contactData.description || "",
                  status_contact: "PERSONNE",
                  link: "#",
                }

                window.createdContact = newContact

                window.dispatchEvent(new Event("newContactAdded"))

                toast.success("Contact généré avec succès!")
              }}
            />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black text-white ml-2">Ajouter un contact</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Ajouter un nouveau contact</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-80px)] overflow-y-auto">
                  <form className="space-y-4 mt-4 pr-4" onSubmit={handleSubmit}>
                    <div>
                      <Label htmlFor="status_contact">Statut</Label>
                      <Select value={status_contact} onValueChange={(value) => setStatus_contact(value as string)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERSONNE">Personne</SelectItem>
                          <SelectItem value="COMPAGNIE">Compagnie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        placeholder="Entrez le nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
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
                      <Label htmlFor="stage">Niveau</Label>
                      <Select value={stage} onValueChange={(value) => setStage(value as Stage)}>
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

                    {/* <div className="space-y-2">
                      <Label htmlFor="Record">Record</Label>
                      <Input
                        id="Record"
                        placeholder="Entrez le record"
                        value={record}
                        onChange={(e) => setRecord(e.target.value)}
                      />
                    </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
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
                      className="w-full bg-black hover:bg-black/70 text-white"
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
          </div>
        </div>

        <Separator className="mt-2" />
      </header>
    </div>
  )
}

