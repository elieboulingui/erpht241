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
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
}

export interface ExistingContact {
  name: string
  email?: string
}



export function AIContactDialog({ onContactGenerated, existingContacts = [] }: AIContactDialogProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const generateContact = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez entrer une description du contact")
      return
    }

    setIsLoading(true)

    try {
      const contactData = await generateContactWithAI(prompt)

      if (isDuplicateContact(contactData, existingContacts)) {
        toast.error("Un contact avec ce nom ou cet email existe déjà")
        return
      }

      onContactGenerated(contactData)
      toast.success("Contact généré avec succès !")
      setIsOpen(false)
      setPrompt("")
    } catch (error) {
      console.error("Erreur lors de la génération du contact:", error)
      toast.error("Erreur lors de la génération du contact")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="mr-6">
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Générer via IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Générer un contact avec l'IA</DialogTitle>
          <DialogDescription>
            Saisissez la description du contact que vous souhaitez créer et l'IA générera les informations pour vous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Ex: Jean Dupont, directeur marketing chez ABC Corp..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button onClick={generateContact} disabled={isLoading || !prompt.trim()} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Générer le contact
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function generateContactWithAI(prompt: string): Promise<ContactData> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const cx = process.env.NEXT_PUBLIC_GOOGLE_CX

  if (!apiKey || !cx) {
    throw new Error("Clé API Google manquante !")
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const structuredPrompt = `
    Vous êtes un assistant IA expert en structuration de données personnelles.
    Génère un objet JSON représentant un contact basé sur la description suivante :
    "${prompt}"

    Format attendu :
    {
      "Nom": "Nom complet du contact",
      "Email": "email@exemple.com",
      "Telephone": "Numéro de téléphone",
      "Description": "Description du contact",
      "Adresse": "Adresse du contact"
    }
  `

  const result = await model.generateContent(structuredPrompt)
  const response = await result.response
  const text = response.text()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Impossible d'extraire les données du contact")
  }

  const contactData = JSON.parse(jsonMatch[0])
  return {
    name: contactData.Nom || "",
    description: contactData.Description || "",
    email: contactData.Email || "",
    phone: contactData.Telephone || "",
    adresse: contactData.Adresse || "",
  }
}

function isDuplicateContact(newContact: ContactData, existingContacts: ExistingContact[]): boolean {
  return existingContacts.some(
    (contact) =>
      contact.name.toLowerCase() === newContact.name.toLowerCase() ||
      (newContact.email && contact.email && contact.email.toLowerCase() === newContact.email.toLowerCase()),
  )
}

