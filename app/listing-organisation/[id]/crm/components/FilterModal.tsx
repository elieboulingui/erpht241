"use client"


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { merchantsData } from "./types";
import { useEffect, useState } from "react";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "contact" | "commercial" | "tag" | null;
  onApply: (selectedItems: string[]) => void;
  initialSelected: string[];
}

const tagOptions = [
  { value: "Design", label: "Design" },
  { value: "Product", label: "Product" },
  { value: "Services", label: "Services" },
];

const commercialOptions = [
  { value: "user1", label: "Jean Dupont" },
  { value: "user2", label: "Marie Martin" },
  { value: "user3", label: "Pierre Durand" },
];

export function FilterModal({ open, onOpenChange, type, onApply, initialSelected }: FilterModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedItems(initialSelected);
  }, [initialSelected]);

  const handleToggleItem = (itemValue: string) => {
    setSelectedItems(prev =>
      prev.includes(itemValue)
        ? prev.filter(v => v !== itemValue)
        : [...prev, itemValue]
    );
  };

  const handleApply = () => {
    onApply(selectedItems);
  };

  const getOptions = () => {
    switch (type) {
      case "contact":
        return merchantsData
          .filter(merchant => 
            merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            merchant.role.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(merchant => ({
            value: merchant.id,
            label: `${merchant.name} - ${merchant.role}`,
          }));
      case "commercial":
        return commercialOptions
          .filter(commercial => 
            commercial.label.toLowerCase().includes(searchTerm.toLowerCase()));
      case "tag":
        return tagOptions
          .filter(tag => 
            tag.label.toLowerCase().includes(searchTerm.toLowerCase()));
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (type) {
      case "contact": return "Filtrer par contact";
      case "commercial": return "Filtrer par commercial";
      case "tag": return "Filtrer par tag";
      default: return "Filtrer";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-2 max-h-[300px] overflow-y-auto">
            {getOptions().map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedItems.includes(option.value)}
                  onCheckedChange={() => handleToggleItem(option.value)}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleApply}>
            Appliquer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}