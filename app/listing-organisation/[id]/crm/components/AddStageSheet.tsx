import { useState, useEffect } from "react";
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
  });

  useEffect(() => {
    if (!stage) {
      setFormData({
        id: "",
        title: "",
        color: "bg-gray-500",
      });
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
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              type="submit">Enregistrer</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}