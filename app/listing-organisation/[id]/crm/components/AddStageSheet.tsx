// AddStageSheet.tsx
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DealStage } from "./types";

const colorOptions = [
  { value: "bg-gray-500", label: "Gris" },
  { value: "bg-blue-500", label: "Bleu" },
  { value: "bg-red-500", label: "Rouge" },
  { value: "bg-green-500", label: "Vert" },
  { value: "bg-yellow-500", label: "Jaune" },
  { value: "bg-purple-500", label: "Violet" },
  { value: "bg-pink-500", label: "Rose" },
  { value: "bg-orange-500", label: "Orange" },
];

interface AddStageSheetProps {
  stage: DealStage | null;
  onSave: (stage: DealStage) => void;
  onOpenChange: (open: boolean) => void;
}

export function AddStageSheet({ stage, onSave, onOpenChange }: AddStageSheetProps) {
  const [formData, setFormData] = useState<DealStage>({
    id: "",
    title: "",
    color: "bg-gray-500",
    ...stage,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || formData.title.toLowerCase().replace(/\s+/g, '-'),
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={!!stage} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Ajouter une nouvelle colonne</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Couleur</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    color: value,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une couleur" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${option.value}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">Enregistrer</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}