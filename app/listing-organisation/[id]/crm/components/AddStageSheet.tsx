import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DealStag } from "./types";
import { addStep } from "../action/createcolum";

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
];

interface AddStageSheetProps {
  stage: DealStag | null;
  onSave: (stage: DealStag) => void;
  onOpenChange: (open: boolean) => void;
}

export function AddStageSheet({ stage, onSave, onOpenChange }: AddStageSheetProps) {
  const [formData, setFormData] = useState<DealStag>({
    id: "",
    label: "",
    color: "bg-gray-500",
  });
  const [organisationId, setOrganisationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const url = window.location.pathname;
    const regex = /listing-organisation\/([a-zA-Z0-9\-]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      setOrganisationId(match[1]);
    }

    if (!stage) {
      setFormData({
        id: "",
        label: "",
        color: "bg-gray-500",
      });
    }
  }, [stage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const { label, color } = formData;
      const response = await addStep(label, organisationId, color);
  
      if (!response.success) {
        console.error("Erreur lors de la création de l'étape:", response.error);
        return;
      }
  
      onSave({
        ...formData,
        id: formData.id || formData.label.toLowerCase().replace(/\s+/g, "-"),
      });
  
      // Fermer le modal uniquement si la création a réussi
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
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
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
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
          </div>

          <SheetFooter>
            <Button 
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </div>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
