"use client";

import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TermsSectionProps {
  terms: string;
  setTerms: (value: string) => void;
}

export default function TermsSection({ terms, setTerms }: TermsSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Label className="text-gray-500 text-sm">Termes</Label>
        <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
      </div>
      <Select value={terms} onValueChange={(value) => setTerms(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionnez" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hebdo">Hebdomadaire</SelectItem>
          <SelectItem value="mensuel">Mensuelle</SelectItem>
          <SelectItem value="bimes">Bimestriel</SelectItem>
          <SelectItem value="trimes">Trimestrielle</SelectItem>
          <SelectItem value="semes">Semestrielle</SelectItem>
          <SelectItem value="an">Annuelle</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
