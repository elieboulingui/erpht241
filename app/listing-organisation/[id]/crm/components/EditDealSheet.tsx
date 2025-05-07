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
import { createDeal } from "@/app/listing-organisation/[id]/crm/action/createDeal";
import { updateDeal } from "../action/updateDeal";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contact {
  id: string;
  email: string;
  name: string;
}

interface EditDealSheetProps {
  deal: Deal | null;
  cardId: string | undefined;
  onSave: (deal: Deal) => void;
  onOpenChange: (open: boolean) => void;
  stepId: any;
  isAddingNew?: boolean;
}

interface FormData {
  label: string;
  description: string;
  amount: number;
  merchantId: string;
  tags: string[];
  tagColors: string[];
  avatar: string;
  deadline: string;
  stepId: any;
  id?: string;
}

const tagOptions = [
  { value: "Design", label: "Design", color: "bg-purple-100 text-purple-800" },
  { value: "Product", label: "Product", color: "bg-blue-100 text-blue-800" },
  { value: "Services", label: "Services", color: "bg-orange-100 text-orange-800" },
];

export function EditDealSheet({
  deal,
  cardId,
  onSave,
  onOpenChange,
  stepId,
  isAddingNew = false,
}: EditDealSheetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    label: "",
    description: "",
    amount: 0,
    merchantId: "cma9v5qkq0004vme8bkht88q4",
    tags: [],
    tagColors: [],
    avatar: "",
    deadline: "",
    stepId: stepId,
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        id: stepId,
        label: deal.label,
        description: deal.description || "",
        amount: deal.amount,
        merchantId: "cma9v5qkq0004vme8bkht88q4",
        tags: deal.tags || [],
        tagColors: deal.tagColors || [],
        avatar: deal.avatar || "",
        deadline: deal.deadline || "",
        stepId: stepId,
      });
      setSelectedContact(deal.avatar || null);
    }
  }, [deal, stepId]);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const organisationId = window.location.pathname.split("/")[2];
        if (!organisationId) {
          console.warn("ID de l'organisation introuvable dans l'URL");
          return;
        }

        const response = await fetch(`/api/contact?organisationId=${organisationId}`);
        if (!response.ok) throw new Error("Erreur réseau");

        const data = await response.json();
        console.log(data)
        setContacts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
        tagColors: [
          ...prev.tagColors,
          selectedTag?.color || "bg-gray-100 text-gray-800",
        ],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dealData = {
      label: formData.label,
      description: formData.description,
      amount: formData.amount,
      merchantId: formData.merchantId!,
      tags: formData.tags,
      tagColors: formData.tagColors,
      avatar: selectedContact ?? undefined,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      stepId: formData.stepId,
      contactId: selectedContact || "", // Default to empty string if null
    };
    

    const dealId = cardId || "";
    const response = isAddingNew
      ? await createDeal(dealData)
      : await updateDeal({ ...dealData, id: dealId });

    if (response.success && response.deal) {
      toast.message(
        isAddingNew
          ? "Opportunité créée avec succès"
          : "Opportunité mise à jour avec succès"
      );
      onOpenChange(false);
      onSave(response.deal as any);
    } else {
      console.error(
        `Erreur lors de la ${isAddingNew ? "création" : "mise à jour"} de l'opportunité:`,
        response.error
      );
    }
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
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="label"
                value={formData.label}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
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
              <Label>Contact associé</Label>
              <Select
                onValueChange={setSelectedContact}
                value={selectedContact || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un contact" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Chargement...</div>
                  ) : (
                    contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

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
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white"
                  type="button"
                  onClick={() => handleAddTag("")}
                >
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
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white"
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
