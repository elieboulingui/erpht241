"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Deal } from "./types";

interface EditDealSheetProps {
  deal: Deal | null;
  onSave: (deal: Deal) => void;
  onOpenChange: (open: boolean) => void;
  isAddingNew?: boolean;
}

const tagOptions = [
  { value: "Design", label: "Design", color: "bg-purple-100 text-purple-800" },
  { value: "Product", label: "Product", color: "bg-blue-100 text-blue-800" },
  { value: "Services", label: "Services", color: "bg-orange-100 text-orange-800" },
];

export function EditDealSheet({
  deal,
  onSave,
  onOpenChange,
  isAddingNew = false,
}: EditDealSheetProps) {
  const [formData, setFormData] = useState<Deal>({
    id: `new-${Date.now()}`,
    label: "",
    description: "",
    amount: 0,
    merchantId: "",
    tags: [],
    tagColors: [],
    avatar: "",
    deadline: "",
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        id: deal.id,
        label: deal.label,
        description: deal.description || "",
        amount: deal.amount,
        merchantId: deal.merchantId || "",
        tags: deal.tags || [],
        tagColors: deal.tagColors || [],
        avatar: deal.avatar || "",
        deadline: deal.deadline || "",
      });
    } else {
      setFormData({
        id: `new-${Date.now()}`,
        label: "",
        description: "",
        amount: 0,
        merchantId: "",
        tags: [],
        tagColors: [],
        avatar: "",
        deadline: "",
      });
    }
  }, [deal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddTag = (tagValue: string) => {
    if (tagValue && !formData.tags.includes(tagValue)) {
      const selectedTag = tagOptions.find((opt) => opt.value === tagValue);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagValue],
        tagColors: [...prev.tagColors, selectedTag?.color || "bg-gray-100 text-gray-800"],
      }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
      tagColors: prev.tagColors.filter((_, i) => i !== index),
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
            <SheetTitle>
              {isAddingNew ? "Créer une nouvelle opportunité" : "Modifier l'opportunité"}
            </SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            {/* Title Section */}
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
                autoFocus
                className="focus:ring focus:ring-blue-500"
              />
            </div>

            {/* Description Section */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Amount Section */}
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

            {/* Tags Section */}
            <div className="grid gap-2">
              <Label htmlFor="newTag">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="newTag"
                  placeholder="Ajouter un tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(e.currentTarget.value.trim());
                    }
                  }}
                />
                <Button
                  className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
                  type="button"
                  onClick={() => handleAddTag('')}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="relative">
                    <span className={`text-xs px-2 py-1 rounded-full ${formData.tagColors[index]}`}>
                      {tag}
                    </span>
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 text-xs"
                      onClick={() => handleRemoveTag(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline Section */}
            <div className="grid gap-2">
              <Label htmlFor="deadline">Échéance</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <SheetFooter>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              type="submit"
            >
              Enregistrer
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
