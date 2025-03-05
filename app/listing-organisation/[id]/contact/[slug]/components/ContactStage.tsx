import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactStageProps {
  stage: string
}

export function ContactStage({ stage }: ContactStageProps) {
  return (
    <div className="space-y-2 p-5">
      <h3 className="font-medium">Étape</h3>
      <Select value={stage || ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner une étape" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LEAD">Prospect</SelectItem>
          <SelectItem value="WON">Client</SelectItem>
          <SelectItem value="QUALIFIED">Prospect potentiel</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

