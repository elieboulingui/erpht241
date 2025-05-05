"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { DealStage } from "./types"
import { updateStep } from "../action/updateStep"

const colorOptions = [
  { value: "bg-gray-500", label: "Gris" },
  { value: "bg-blue-500", label: "Bleu" },
  { value: "bg-red-500", label: "Rouge" },
  { value: "bg-green-500", label: "Vert" },
  { value: "bg-yellow-500", label: "Jaune" },
  { value: "bg-purple-500", label: "Violet" },
  { value: "bg-pink-500", label: "Rose" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-teal-500", label: "Sarcelle" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-amber-500", label: "Ambre" },
  { value: "bg-lime-500", label: "Lime" },
  { value: "bg-emerald-500", label: "Émeraude" },
  { value: "bg-cyan-500", label: "Cyan" },
  { value: "bg-sky-500", label: "Bleu ciel" },
  { value: "bg-violet-500", label: "Violet foncé" },
  { value: "bg-fuchsia-500", label: "Fuchsia" },
  { value: "bg-rose-500", label: "Rose vif" },
  { value: "bg-stone-500", label: "Pierre" },
  { value: "bg-slate-500", label: "Ardoise" },
  { value: "bg-zinc-500", label: "Zinc" },
  { value: "bg-neutral-500", label: "Neutre" },
]

interface EditStageSheetProps {
  stage: DealStage | null
  onSave: (stage: DealStage) => void
  onOpenChange: (open: boolean) => void
}

export function EditStageSheet({ stage, onSave, onOpenChange }: EditStageSheetProps) {
  const [formData, setFormData] = useState<DealStage>({
    id: "",
    label: "",
    color: "bg-gray-500",
  })
  const [originalTitle, setOriginalTitle] = useState("")
  const [organisationId, setOrganisationId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Extract organisation ID from URL
  useEffect(() => {
    const url = window.location.pathname
    const regex = /listing-organisation\/([a-zA-Z0-9-]+)/
    const match = url.match(regex)

    if (match && match[1]) {
      setOrganisationId(match[1])
    }
  }, [])

  // Update formData when stage changes
  useEffect(() => {
    if (stage) {
      console.log("Stage reçu pour modification:", stage)
      setFormData({
        id: stage.id,
        label: stage.label,
        color: stage.color,
      })
      setOriginalTitle(stage.label)
      setError(null) // Reset error when opening with a new stage
    }
  }, [stage])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name === "title" ? "label" : name]: value,
    }))
  }

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!formData.id) {
        console.error("ID de l'étape manquant")
        setError("ID de l'étape manquant")
        setIsLoading(false)
        return
      }

      // Log pour déboguer
      console.log("Tentative de mise à jour de l'étape:", {
        id: formData.id,
        label: formData.label,
        color: formData.color,
        organisationId,
      })

      const response = await updateStep(formData.id, formData.label, formData.color, organisationId)

      if (!response.success) {
        console.error("Erreur de mise à jour:", response.error)
        setError(response.error || "Une erreur est survenue lors de la modification")
        return
      }

      console.log("Mise à jour réussie:", response.updatedStep)

      // Passons l'étape mise à jour avec sa couleur spécifique
      onSave({
        id: formData.id,
        label: formData.label,
        color: formData.color,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      setError("Une erreur inattendue est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={!!stage} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Modifier la colonne "{originalTitle}"</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            {/* Champ caché pour l'ID */}
            <input type="hidden" name="id" value={formData.id} />

            <div className="grid gap-2">
              <Label htmlFor="title">Nouveau nom</Label>
              <Input
                id="title"
                name="title"
                value={formData.label}
                onChange={handleChange}
                required
                placeholder={`Ancien nom: ${originalTitle}`}
              />
            </div>

            <div className="grid gap-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-8 h-8 rounded-full ${option.value} ${formData.color === option.value ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}
                    onClick={() => handleColorSelect(option.value)}
                    aria-label={option.label}
                  />
                ))}
              </div>

              <div className="mt-2">
                <Label htmlFor="color">Ou saisir une classe Tailwind:</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="ex: bg-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded border border-red-200">
                Erreur: {error}
              </div>
            )}
          </div>

          <SheetFooter>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
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
                  Enregistrement...
                </div>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
