"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Sparkles, Loader2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContactData, ExistingContact, Niveau } from "./types"
import { isDuplicateContact } from "./utils"

interface AIContactGeneratorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  organisationId: string | null
  saveContactToDatabase: (contactData: any) => Promise<any>
  generateContacts: (prompt: string) => Promise<ContactData[]>
  onManualFallback: () => void
}

export default function AIContactGenerator({
  isOpen,
  onOpenChange,
  organisationId,
  saveContactToDatabase,
  generateContacts,
  onManualFallback,
}: AIContactGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isAILoading, setIsAILoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatedContacts, setGeneratedContacts] = useState<ContactData[]>([])
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set())
  const [step, setStep] = useState<"input" | "selection">("input")

  const handleGenerateContacts = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description du contact")
      return
    }

    setIsAILoading(true)

    try {
      const contacts = await generateContacts(prompt)
      setGeneratedContacts(contacts)
      setStep("selection")
    } catch (error: any) {
      console.error("Erreur lors de la génération des contacts:", error)

      // Show specific message based on the error
      if (error.message.includes("Secteur non trouvé") || error.message.includes("Aucune entreprise trouvée")) {
        toast.error(
          `${error.message}. Veuillez créer le contact manuellement en utilisant le bouton "Ajouter un contact".`,
        )
        // Close AI dialog after a delay
        setTimeout(() => {
          onManualFallback()
        }, 3000)
      } else {
        toast.error("Erreur lors de la génération des contacts")
      }
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

    resetDialog()
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

  const resetDialog = () => {
    onOpenChange(false)
    setPrompt("")
    setGeneratedContacts([])
    setSelectedContactIds(new Set())
    setStep("input")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetDialog()
      }}
    >
      <DialogContent className={`  ${step === "input" ? "w-full" : "sm:max-w-[800px] md:max-w-[1600px]"}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Générer un contact avec l'IA</DialogTitle>
          <DialogDescription className="text-sm text-black">
            {step === "input"
              ? "Saisissez le secteur ou type d'entreprise au Gabon pour générer des contacts."
              : "Sélectionnez l'entreprise gabonaise que vous souhaitez ajouter à vos contacts."}
          </DialogDescription>
        </DialogHeader>
        {step === "input" ? (
          <div className="flex w-full gap-2 items-center">
            <Input
              type="text"
              id="contact"
              placeholder="Ex: entreprises tech, agences marketing, cabinets d'avocats au Gabon..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 p-3 border rounded-md"
            />
            <Button
              onClick={handleGenerateContacts}
              disabled={isAILoading || !prompt.trim()}
              className="gap-2 bg-[#7f1d1c] text-white hover:bg-[#7f1d1c] whitespace-nowrap"
            >
              {isAILoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Générer
                </>
              )}
            </Button>
          </div>
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
  )
}

