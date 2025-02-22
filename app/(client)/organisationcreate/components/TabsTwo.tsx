"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Importer le toast de sonner

interface TeamMember {
  email: string
  role: string
}

interface TeamStepProps {
  formData: {
    team: TeamMember[]
  }
  setFormData: (data: any) => void
}

export function TeamStep({ formData, setFormData }: TeamStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [...formData.team, { email: "", role: "Membre" }],
    })
  }

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newTeam = [...formData.team]
    newTeam[index] = { ...newTeam[index], [field]: value }
    setFormData({ ...formData, team: newTeam })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    // Vérification si un champ d'email est vide
    const emptyEmailIndex = formData.team.findIndex((member) => !member.email.trim());
    if (emptyEmailIndex !== -1) {
      // Rediriger vers la page 'listingorg' si un champ email est vide
      router.push("/listingorg");
      return; // Arrêter l'exécution du reste du code
    }

    try {
      // Convertir le rôle de chaque membre de l'équipe en majuscules
      const updatedTeam = formData.team.map((member) => ({
        ...member,
        role: member.role.toUpperCase(),
      }));

      // Envoi des invitations à l'API
      const response = await fetch("/api/auth/sendinvitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitations: updatedTeam }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Une erreur est survenue lors de l'envoi des invitations.");
      }

      // Succès - afficher un toast de succès
      toast.success("Invitations envoyées avec succès.");

      // Réinitialiser les champs de l'équipe après l'envoi
      setFormData({
        ...formData,
        team: [], // Vider la liste des membres
      });

    } catch (error: any) {
      console.error(error);
      setError(error.message);
      toast.error(error.message || "Une erreur est survenue."); // Afficher un toast d'erreur
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Inviter l&apos;equipe</h2>
        <p className="text-sm text-gray-500">
          Ajoutez des membres à votre équipe pour commencer. Vous pourrez toujours inviter d&apos;autres personnes plus
          tard.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Adresse email</Label>
          <button onClick={addTeamMember} className="text-sm text-primary hover:text-primary/90">
            + Ajouter un membre
          </button>
        </div>

        <div className="space-y-4">
          {formData.team.map((member, index) => (
            <div key={index} className="flex gap-4">
              <Input
                placeholder="exemple@mail.com"
                value={member.email}
                onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                className="flex-1"
              />
              <Select value={member.role} onValueChange={(value: string) => updateTeamMember(index, "role", value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Membre">Membre</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>


      <Button
        className="w-full bg-black hover:bg-black/90"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Envoi en cours..." : "Terminer"}
      </Button>
    </div>
  )
}
