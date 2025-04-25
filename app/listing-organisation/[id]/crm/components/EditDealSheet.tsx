// EditDealSheet.tsx
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Deal, merchantsData } from "./types";

const tagOptions = [
  { value: "Design", label: "Design", color: "bg-purple-100 text-purple-800" },
  { value: "Product", label: "Product", color: "bg-blue-100 text-blue-800" },
  { value: "Services", label: "Services", color: "bg-orange-100 text-orange-800" },
  { value: "Information", label: "Information", color: "bg-green-100 text-green-800" },
  { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
  { value: "Important", label: "Important", color: "bg-yellow-100 text-yellow-800" },
];

interface EditDealSheetProps {
  deal: Deal | null;
  onSave: (deal: Deal) => void;
  onOpenChange: (open: boolean) => void;
  isAddingNew?: boolean;
}

export function EditDealSheet({ deal, onSave, onOpenChange, isAddingNew = false }: EditDealSheetProps) {
  const [formData, setFormData] = useState<Deal>(() => ({
    id: deal?.id || `new-${Date.now()}`,
    title: deal?.title || "",
    description: deal?.description || "",
    amount: deal?.amount || 0,
    merchantId: deal?.merchantId || "",
    tags: deal?.tags || [],
    tagColors: deal?.tagColors || [],
    icons: deal?.icons || [],
    iconColors: deal?.iconColors || [],
    avatar: deal?.avatar || "",
    deadline: deal?.deadline || "",
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Sheet open={!!deal} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{isAddingNew ? "Créer une nouvelle opportunité" : "Modifier l'opportunité"}</SheetTitle>
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="merchant">Commerçant</Label>
              <Select
                value={formData.merchantId || ""}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    merchantId: value || undefined,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un commerçant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun commerçant</SelectItem>
                  {merchantsData.map((merchant) => (
                    <SelectItem key={merchant.id} value={merchant.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={merchant.photo} alt={merchant.name} />
                        </Avatar>
                        {merchant.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Tags</Label>
              <Select
                value={undefined}
                onValueChange={(value) => {
                  if (value && !formData.tags.includes(value)) {
                    const selectedTag = tagOptions.find(opt => opt.value === value);
                    setFormData(prev => ({
                      ...prev,
                      tags: [...prev.tags, value],
                      tagColors: [...prev.tagColors, selectedTag?.color || ""],
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter un tag" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="relative">
                    <span className={`text-xs px-2 py-1 rounded-full ${formData.tagColors[index]}`}>
                      {tag}
                    </span>
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 text-xs"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index),
                          tagColors: prev.tagColors.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Échéance</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar">URL de l'avatar</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar || ""}
                onChange={handleChange}
              />
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