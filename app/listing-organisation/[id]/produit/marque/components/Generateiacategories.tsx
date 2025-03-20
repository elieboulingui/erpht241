"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { creatcategory } from "../action/createmarque"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"

// Composant pour l'icône Apple
function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.3-.9 3.69-.76 1.57.18 2.76.9 3.54 2.29-3.19 1.88-2.38 6.41.72 7.72-.63 1.32-1.44 2.62-3.03 3.92zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.66 4.23-3.74 4.25z"
        fill="currentColor"
      />
    </svg>
  )
}

// Composant Principal
export function CategoryGenerator() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [domain, setDomain] = useState("") // Domaine d'activité
  const [selectAll, setSelectAll] = useState(false)
  const [organisationId, setOrganisationId] = useState<string | null>(null) // ID de l'organisation
  const [isOpen, setIsOpen] = useState(false)  // Pour contrôler l'ouverture du dialogue

  // Fonction pour extraire l'ID de l'organisation à partir de l'URL
  const extractOrganisationId = () => {
    const pathname = window.location.pathname; // Utilisation de window.location.pathname pour obtenir l'URL actuelle
    const regex = /listing-organisation\/([a-zA-Z0-9]+)/;
    const match = pathname.match(regex);

    if (match) {
      return match[1]; // L'ID de l'organisation
    }
    return null; // Retourne null si aucun ID n'est trouvé
  };

  useEffect(() => {
    const id = extractOrganisationId();
    setOrganisationId(id); // Met à jour l'ID de l'organisation dès que l'URL est disponible
  }, []); // On n'a besoin d'appeler cette fonction qu'une seule fois au montage du composant

  // Appel à l'IA pour générer les marques liées à un domaine donné
  const fetchCategories = async (domain: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    if (!apiKey) {
      toast.error("❌ API key is missing!")
      return
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const structuredPrompt = `
    Vous êtes un assistant IA qui génère une liste de marques liées à un domaine donné.
    Si le domaine est "vêtements", répondez avec une liste complète de marques de vêtements du monde entier.

    Exemple de réponse attendue : 
    {
      "categories": ["Nike", "Adidas", "Puma", "Zara", "H&M"]
    }

    marque: "${domain}"

    Réponse attendue :
    {
      "categories": ["Marque 1", "Marque 2", "Marque 3"]
    }
  `

    try {
      setIsGenerating(true)

      const response = await model.generateContent(structuredPrompt)

      if (!response) {
        toast.error("❌ Aucune réponse de l'IA.")
        return
      }

      const textResponse = await response.response.text()
      const cleanedText = textResponse.replace(/```json|```/g, "").trim()

      let jsonResponse
      try {
        jsonResponse = JSON.parse(cleanedText)
      } catch (error) {
        toast.error("❌ Format JSON invalide.")
        return
      }

      if (!jsonResponse?.categories || !Array.isArray(jsonResponse.categories)) {
        toast.error("❌ Réponse invalide : La réponse n'inclut pas un tableau de marques.")
        return
      }

      // Limiter à 7 catégories
      const limitedCategories = jsonResponse.categories.slice(0, 7)

      setCategories(limitedCategories.map((cat: string) => ({ name: cat, checked: false })))
    } catch (error) {
      toast.error("⚠️ Erreur lors de la requête AI:")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCheckboxChange = (index: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, i) =>
        i === index ? { ...category, checked: !category.checked } : category
      )
    )
  }

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll)
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({ ...category, checked: !selectAll }))
    )
  }

  const handleSubmitCategories = async () => {
    if (!organisationId) {
      toast.error("Impossible de récupérer l'ID de l'organisation.")
      return
    }

    const selectedCategories = categories.filter((cat) => cat.checked)

    if (selectedCategories.length === 0) {
      toast.error("Aucune catégorie sélectionnée !")
      return
    }

    setIsAdding(true)

    try {
      const promises = selectedCategories.map((category) =>
        creatcategory({
          name: category.name,
          organisationId,
        })
      )

      await Promise.all(promises)

      toast.success("Catégories créées avec succès !")
      setCategories([])
      setIsOpen(false)
    } catch (error) {
      toast.error("Erreur lors de la création des marques !")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full  bg-black hover:bg-black/80 text-white">
            Ouvrir le générateur de marque
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <h2 className="text-xl font-bold">Générer des marques</h2>
            <p className="text-sm text-gray-500">Entrez un domaine pour générer des marques</p>
          </DialogHeader>

          <Card className="w-full bg-gray-200/80">
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  className="pr-10 focus:outline-none focus:ring-0 border-0"
                  placeholder="Entrez un domaine"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <Button
                onClick={() => fetchCategories(domain)}
                className="w-full mt-4 bg-black hover:bg-black/80 text-white"
                disabled={isGenerating}
              >
                {isGenerating ? "Génération en cours..." : "Générer des marques"}
              </Button>

              {/* Afficher le bouton "Tout sélectionner" uniquement si des catégories sont générées */}
              {categories.length > 0 && (
                <Button
                  onClick={handleSelectAllChange}
                  className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-black"
                >
                  {selectAll ? "Désélectionner tout" : "Tout sélectionner"}
                </Button>
              )}

              {/* Afficher les catégories uniquement si des résultats ont été générés */}
              {categories.length > 0 && (
                <div className="flex gap-4 flex-wrap mt-6">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white p-3 rounded-md border border-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={category.checked}
                        onChange={() => handleCheckboxChange(index)}
                        className="mr-3"
                      />
                      <span>{category.name}</span>
                      <span className="ml-auto">
                        <AppleIcon />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {/* Afficher ou masquer le bouton en fonction des catégories générées */}
            {categories.length > 0 && categories.some((cat) => cat.checked) && (
              <CardFooter className="flex justify-start pt-2">
                <Button
                  onClick={handleSubmitCategories}
                  className="w-full bg-black hover:bg-black/80 text-white"
                  disabled={isAdding || categories.every((cat) => !cat.checked)}
                >
                  {isAdding ? "Ajout en cours..." : "Ajouter les marques"}
                </Button>
              </CardFooter>
            )}
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
