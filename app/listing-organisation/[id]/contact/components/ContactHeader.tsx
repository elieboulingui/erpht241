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
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sparkles, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Add this declaration at the top of the file, after imports
declare global {
  interface Window {
    createdContact: any
  }
}

type Niveau = "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  niveau: Niveau
  tags: string
  logo?: string | null
  adresse: string
  status_contact: string
}

interface ContactData {
  name: string
  description?: string
  email?: string
  phone?: string
  adresse?: string
  logo?: string
}

interface ExistingContact {
  name: string
  email?: string
}

// Sample data structure for data.json
interface CompanyData {
  sector: string
  companies: {
    Nom: string
    Email: string
    Telephone: string
    Telephone2?: string
    Telephone3?: string
    Description: string
    Adresse: string
    website: string
  }[]
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
  const [niveau, setNiveau] = useState<Niveau>("PROSPECT_POTENTIAL")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [adresse, setAdresse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formValid, setFormValid] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [status_contact, setStatus_contact] = useState("PERSONNE")

  // AI Dialog states
  const [prompt, setPrompt] = useState("")
  const [isAILoading, setIsAILoading] = useState(false)
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false)
  const [generatedContacts, setGeneratedContacts] = useState<ContactData[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set())
  const [step, setStep] = useState<"input" | "selection">("input")
  const [companyData, setCompanyData] = useState<CompanyData[]>([])

  // Load the local data.json file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json")
        const data = await response.json()
        setCompanyData(data)
      } catch (error) {
        console.error("Error loading data.json:", error)
        toast.error("Erreur lors du chargement des données")
      }
    }

    fetchData()
  }, [])

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
    setFormValid(!!name && !!phone && !!organisationId && !!adresse && !!status_contact)
  }, [name, phone, organisationId, adresse, status_contact])

  const saveContactToDatabase = async (contactData: {
    name: string
    email: string
    phone: string
    niveau: Niveau
    tags: string
    organisationIds: string[]
    logo: string | null
    adresse: string
    status_contact: string
  }) => {
    if (!organisationId) {
      console.error("Organisation ID is missing")
      throw new Error("L'ID de l'organisation est manquant")
    }

    console.log("Données envoyées à l'API :", contactData)

    // Show loading toast
    const loadingToast = toast.loading("Création du contact en cours...")

    try {
      const response = await fetch("/api/createcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
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

        if (responseData?.contact) {
          window.createdContact = responseData.contact
          window.dispatchEvent(new Event("newContactAdded"))
          console.log("Contact created and event dispatched:", responseData.contact)
        }

        // Trigger a custom event to notify the contacts table to refresh
        const event = new CustomEvent("contactCreated", {
          detail: { organisationId },
        })
        window.dispatchEvent(event)

        return responseData.contact
      } else {
        throw new Error("Réponse du serveur invalide, message manquant.")
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du contact", error)
      throw error
    }
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
    }

    setLoading(true)
    setError(null)

    try {
      await saveContactToDatabase(newContact)

      // Reset form fields after successful submission
      setName("")
      setEmail("")
      setPhone("")
      setNiveau("PROSPECT_POTENTIAL")
      setTags([])
      setTagInput("")
      setLogo(null)
      setAdresse("")
      setStatus_contact("PERSONNE")

      // Close the sheet
      setIsSheetOpen(false)
    } catch (error: any) {
      console.error("Erreur lors de la création du contact", error)
      setError(`Une erreur est survenue : ${error.message || "inconnue"}`)
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
    } finally {
      setLoading(false)
    }
  }

  // AI Contact Generation Functions - Modified to use local data.json
  const generateContacts = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description du contact")
      return
    }

    setIsAILoading(true)

    try {
      const contacts = await generateCompanyContactsFromLocalData(prompt)
      setGeneratedContacts(contacts)
      setStep("selection")
    } catch (error) {
      console.error("Erreur lors de la génération des contacts:", error)
      toast.error("Erreur lors de la génération des contacts")
    } finally {
      setIsAILoading(false)
    }
  }

  const handleContactSelection = async () => {
    if (selectedContactIds.size === 0) {
      toast.error("Veuillez sélectionner au moins un contact")
      return
    }

    const selectedContacts = Array.from(selectedContactIds).map((index) => generatedContacts[index])
    const existingContacts: ExistingContact[] = [] // This would be populated from your database in a real app

    // Check for duplicates
    const duplicates = selectedContacts.filter((contact) => isDuplicateContact(contact, existingContacts))

    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} contact(s) existe(nt) déjà et ne sera(ont) pas ajouté(s)`)
      // Filter out duplicates
      const validContacts = selectedContacts.filter((contact) => !isDuplicateContact(contact, existingContacts))

      if (validContacts.length === 0) {
        return
      }

      // Save each valid contact to database
      await saveSelectedContacts(validContacts)
    } else {
      // Save all contacts to database
      await saveSelectedContacts(selectedContacts)
    }

    resetAIDialog()
  }

  const saveSelectedContacts = async (contacts: ContactData[]) => {
    setLoading(true)

    try {
      const savedContacts = []

      for (const contact of contacts) {
        const contactToSave = {
          name: contact.name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          niveau: "PROSPECT_POTENTIAL" as Niveau,
          tags: "",
          organisationIds: [organisationId!],
          logo: contact.logo || null,
          adresse: contact.adresse || "",
          status_contact: "PERSONNE",
        }

        const savedContact = await saveContactToDatabase(contactToSave)
        savedContacts.push(savedContact)
      }

      toast.success(`${contacts.length} contact(s) ajouté(s) avec succès !`)
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des contacts:", error)
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
    } finally {
      setLoading(false)
    }
  }

  const resetAIDialog = () => {
    setIsAIDialogOpen(false)
    setPrompt("")
    setGeneratedContacts([])
    setSelectedContactIds(new Set())
    setStep("input")
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
            {/* AI Contact Generator Dialog */}
            <Dialog
              open={isAIDialogOpen}
              onOpenChange={(open) => {
                setIsAIDialogOpen(open)
                if (!open) resetAIDialog()
              }}
            >
              <DialogTrigger asChild className="mr-6">
                <Button variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Générer via IA
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`py-20 px-10 ${step === "input" ? "sm:max-w-[500px]" : "sm:max-w-[800px] md:max-w-[1600px]"}`}
              >
                <DialogHeader>
                  <DialogTitle className="text-center">Générer un contact avec l'IA</DialogTitle>
                  <DialogDescription className="text-center">
                    {step === "input"
                      ? "Saisissez le secteur ou type d'entreprise au Gabon pour générer des contacts."
                      : "Sélectionnez l'entreprise gabonaise que vous souhaitez ajouter à vos contacts."}
                  </DialogDescription>
                </DialogHeader>
                {step === "input" ? (
                  <>
                    <div className="gap-4 py-4">
                      <Input
                        type="text"
                        id="contact"
                        placeholder="Ex: entreprises tech, agences marketing, cabinets d'avocats au Gabon..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-3 border rounded-md col-span-5"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={generateContacts}
                        disabled={isAILoading || !prompt.trim()}
                        className="gap-2 bg-black text-white hover:bg-black"
                      >
                        {isAILoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Générer des contacts
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-4">
                      <div className="flex justify-between mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContactIds(new Set())}
                          disabled={selectedContactIds.size === 0}
                        >
                          Tout désélectionner
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContactIds(new Set(generatedContacts.map((_, i) => i)))}
                          disabled={selectedContactIds.size === generatedContacts.length}
                        >
                          Tout sélectionner
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-5">
                        {generatedContacts.map((contact, index) => (
                          <div key={index} className="flex-1">
                            <Card
                              className={`border h-full cursor-pointer ${
                                selectedContactIds.has(index) ? "border-black" : "border-gray-200"
                              } hover:border-gray-400 transition-colors`}
                              onClick={() => {
                                const newSelected = new Set(selectedContactIds)
                                if (newSelected.has(index)) {
                                  newSelected.delete(index)
                                } else {
                                  newSelected.add(index)
                                }
                                setSelectedContactIds(newSelected)
                              }}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                                  <div
                                    className={`w-5 h-5 rounded-full border ${
                                      selectedContactIds.has(index)
                                        ? "bg-black text-white flex items-center justify-center"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selectedContactIds.has(index) && <Check className="h-3 w-3" />}
                                  </div>
                                </div>
                                {contact.description && (
                                  <CardDescription className="line-clamp-2">{contact.description}</CardDescription>
                                )}
                              </CardHeader>
                              <CardContent className="pb-2 pt-0">
                                <div className="grid gap-1 text-sm">
                                  {contact.email && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Email:</span>{" "}
                                      <span className="truncate">{contact.email}</span>
                                    </div>
                                  )}
                                  {contact.phone && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Téléphone:</span> {contact.phone}
                                    </div>
                                  )}
                                  {contact.adresse && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">Adresse:</span>{" "}
                                      <span className="truncate">{contact.adresse}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep("input")}>
                        Retour
                      </Button>
                      <Button
                        onClick={handleContactSelection}
                        disabled={selectedContactIds.size === 0 || loading}
                        className="gap-2 bg-black text-white hover:bg-black"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sauvegarde en cours...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Sélectionner {selectedContactIds.size} contact
                            {selectedContactIds.size > 1 ? "s" : ""}
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Manual Contact Creation Sheet */}
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
                      <RadioGroup value={status_contact} onValueChange={setStatus_contact}>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <RadioGroupItem value="PERSONNE" />
                            Personne
                          </label>
                          <label className="flex items-center gap-2">
                            <RadioGroupItem value="COMPAGNIE" />
                            Compagnie
                          </label>
                        </div>
                      </RadioGroup>
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

// New function that uses local data.json instead of Google AI API
async function generateCompanyContactsFromLocalData(prompt: string): Promise<ContactData[]> {
  // Normalize the prompt for better matching
  const normalizedPrompt = prompt.toLowerCase().trim()

  try {
    // Fetch the data.json file
    const response = await fetch("/data.json")
    if (!response.ok) {
      throw new Error("Impossible de charger les données")
    }

    const data: CompanyData[] = await response.json()

    // Find the most relevant sector based on the prompt
    let relevantSector = data.find((sector) => normalizedPrompt.includes(sector.sector.toLowerCase()))

    // If no exact match, use a fallback sector or the first one
    if (!relevantSector && data.length > 0) {
      // Try to find partial matches
      relevantSector =
        data.find(
          (sector) =>
            sector.sector.toLowerCase().includes(normalizedPrompt) ||
            normalizedPrompt.includes(sector.sector.toLowerCase().split(" ")[0]),
        ) || data[0]
    }

    if (!relevantSector) {
      throw new Error("Aucune donnée correspondante trouvée")
    }

    // Get up to 6 companies from the relevant sector
    const companies = relevantSector.companies.slice(0, 6)

    // Transform the data to match the expected format
    const companiesWithLogos = await Promise.all(
      companies.map(async (company) => {
        // Generate a placeholder logo based on company name
        const logo = await generateLogoPlaceholder(company.Nom)

        return {
          name: company.Nom || "",
          description: company.Description || "",
          email: company.Email || "",
          phone: company.Telephone || "",
          phone2: company.Telephone2 || "",
          phone3: company.Telephone3 || "",
          adresse: company.Adresse || "",
          website: company.website || "",
          logo: logo,
        }
      }),
    )

    return companiesWithLogos
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error)
    throw new Error("Impossible de générer les contacts")
  }
}

// Keep the existing logo placeholder generator
async function generateLogoPlaceholder(companyName: string): Promise<string> {
  // Get initials from company name
  const initials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  // Generate random color
  const colors = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#F97316",
    "#14B8A6",
    "#6366F1",
  ]
  const bgColor = colors[Math.floor(Math.random() * colors.length)]

  // Create SVG logo
  const svgLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="${bgColor}" rx="20" />
      <text x="100" y="115" fontFamily="Arial" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle">${initials}</text>
    </svg>
  `

  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgLogo)}`
  return dataUrl
}

function isDuplicateContact(newContact: ContactData, existingContacts: ExistingContact[]): boolean {
  return existingContacts.some(
    (contact) =>
      contact.name.toLowerCase() === newContact.name.toLowerCase() ||
      (newContact.email && contact.email && contact.email.toLowerCase() === newContact.email.toLowerCase()),
  )
}

