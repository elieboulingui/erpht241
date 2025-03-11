"use client"

import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AIContactDialogProps {
  onContactGenerated: (contactData: ContactData) => void
  existingContacts?: ExistingContact[]
}

export interface ContactData {
  name: string
  description?: string
  email?: string
  phone?: string
  adresse?: string
  logo?: string
}

export interface ExistingContact {
  name: string
  email?: string
}

export function AIContactDialog({ onContactGenerated, existingContacts = [] }: AIContactDialogProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [generatedContacts, setGeneratedContacts] = useState<ContactData[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set())
  const [step, setStep] = useState<"input" | "selection">("input")

  const generateContacts = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description du contact")
      return
    }

    setIsLoading(true)

    try {
      const contacts = await generateCompanyContactsWithAI(prompt)
      setGeneratedContacts(contacts)
      setStep("selection")
    } catch (error) {
      console.error("Erreur lors de la génération des contacts:", error)
      toast.error("Erreur lors de la génération des contacts")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactSelection = () => {
    if (selectedContactIds.size === 0) {
      toast.error("Veuillez sélectionner au moins un contact")
      return
    }

    const selectedContacts = Array.from(selectedContactIds).map((index) => generatedContacts[index])

    // Check for duplicates
    const duplicates = selectedContacts.filter((contact) => isDuplicateContact(contact, existingContacts))

    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} contact(s) existe(nt) déjà et ne sera(ont) pas ajouté(s)`)
      // Filter out duplicates
      const validContacts = selectedContacts.filter((contact) => !isDuplicateContact(contact, existingContacts))

      if (validContacts.length === 0) {
        return
      }

      // Add valid contacts
      validContacts.forEach((contact) => onContactGenerated(contact))
      toast.success(`${validContacts.length} contact(s) ajouté(s) avec succès !`)
    } else {
      // Add all contacts
      selectedContacts.forEach((contact) => onContactGenerated(contact))
      toast.success(`${selectedContacts.length} contact(s) ajouté(s) avec succès !`)
    }

    resetDialog()
  }

  const resetDialog = () => {
    setIsOpen(false)
    setPrompt("")
    setGeneratedContacts([])
    setSelectedContactIds(new Set())
    setStep("input")
  }

  return (
    <div className="w-full">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetDialog()
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
          {" "}
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
              <div className=" gap-4 py-4">
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
                  disabled={isLoading || !prompt.trim()}
                  className="gap-2 bg-black text-white hover:bg-black"
                >
                  {isLoading ? (
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
                          {/* {contact.logo && (
                            <div className="mb-3 flex justify-center">
                              <img
                                src={contact.logo || "/placeholder.svg"}
                                alt={`Logo ${contact.name}`}
                                className="h-16 w-16 object-contain rounded-md"
                              />
                            </div>
                          )} */}
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
                  disabled={selectedContactIds.size === 0}
                  className="gap-2 bg-black text-white hover:bg-black"
                >
                  <Check className="h-4 w-4" />
                  Sélectionner {selectedContactIds.size} contact{selectedContactIds.size > 1 ? "s" : ""}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

async function generateCompanyContactsWithAI(prompt: string): Promise<ContactData[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const cx = process.env.NEXT_PUBLIC_GOOGLE_CX

  if (!apiKey || !cx) {
    throw new Error("Clé API Google manquante !")
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const structuredPrompt = `
    Vous êtes un assistant IA expert en structuration de données d'entreprises.
    Génère un tableau JSON contenant 6 entreprises différentes basées au GABON et correspondant à la description suivante :
    "${prompt}"

    Chaque entreprise doit avoir un nom réaliste d'entreprise gabonaise, une description, un email de contact, un numéro de téléphone gabonais et une adresse au Gabon.
    Les entreprises doivent être variées et représentatives du secteur demandé, mais toutes doivent être situées au Gabon.

    Format attendu :
    [
      {
        "Nom": "Nom de l'entreprise gabonaise 1",
        "Email": "contact@entreprise1.ga",
        "Telephone": "Numéro de téléphone gabonais",
        "Description": "Description de l'entreprise gabonaise",
        "Adresse": "Adresse de l'entreprise au Gabon"
      },
      {
        "Nom": "Nom de l'entreprise gabonaise 2",
        "Email": "contact@entreprise2.com",
        "Telephone": "Numéro de téléphone gabonais",
        "Description": "Description de l'entreprise gabonaise",
        "Adresse": "Adresse de l'entreprise au Gabon"
      },
      ...et ainsi de suite pour 6 entreprises
    ]
  `

  const result = await model.generateContent(structuredPrompt)
  const response = await result.response
  const text = response.text()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error("Impossible d'extraire les données des entreprises")
  }

  try {
    const companiesData = JSON.parse(jsonMatch[0])
    const companiesWithLogos = await Promise.all(
      companiesData.map(async (company: any) => {
        // Generate a placeholder logo based on company name
        const logo = await generateLogoPlaceholder(company.Nom)

        return {
          name: company.Nom || "",
          description: company.Description || "",
          email: company.Email || "",
          phone: company.Telephone || "",
          adresse: company.Adresse || "",
          logo: logo,
        }
      }),
    )

    return companiesWithLogos
  } catch (error) {
    console.error("Erreur lors du parsing JSON:", error)
    throw new Error("Format de données invalide")
  }
}

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

