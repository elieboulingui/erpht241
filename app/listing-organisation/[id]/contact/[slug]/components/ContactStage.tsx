import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactStageProps {
  niveau: string;
}

export function ContactStage({ niveau }: ContactStageProps) {
  return (
    <div className="space-y-2 p-5">
      <h3 className="font-medium">Niveau</h3>
      <Select value={niveau || ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un niveau" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PROSPECT_POTENTIAL">Prospect potentiel</SelectItem>
          <SelectItem value="PROSPECT">Prospect</SelectItem>
          <SelectItem value="CLIENT">Client</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
