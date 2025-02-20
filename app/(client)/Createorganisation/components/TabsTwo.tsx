"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

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

      <Button className="w-full bg-black hover:bg-black/90">Terminer</Button>
    </div>
  )
}