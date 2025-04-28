// EditStageSheet.tsx
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  { value: "bg-indigo-500", label: "Indigo" },
];

interface EditStageSheetProps {
  stage: DealStage | null;
  onSave: (stage: DealStage) => void;
  onOpenChange: (open: boolean) => void;
}

export function EditStageSheet({ stage, onSave, onOpenChange }: EditStageSheetProps) {
  const [formData, setFormData] = useState<DealStage>({
    id: "",
    title: "",
    color: "bg-gray-500",
  });
  const [originalTitle, setOriginalTitle] = useState("");

  // Mettre à jour le formData quand le stage change
  useEffect(() => {
    if (stage) {
      setFormData({
        id: stage.id,
        title: stage.title,
        color: stage.color,
      });
      setOriginalTitle(stage.title);
    }
  }, [stage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={!!stage} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Modifier la colonne "{originalTitle}"</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Nouveau nom</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={`Ancien nom: ${originalTitle}`}
              />
            </div>

            <div className="grid gap-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-8 h-8 rounded-full ${option.value} ${formData.color === option.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
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
          </div>

          <SheetFooter>
            <Button type="submit">Enregistrer les modifications</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}