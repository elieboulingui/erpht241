"use client";

import { useState, useCallback, memo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Merchant, Contact, Deal } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterModalProps {
  merchants: Merchant[];
  contacts: Contact[];
  deals: Deal[];
  onFilterChange: (filterType: string, value: string | string[] | null) => void;
  currentFilters: {
    merchant: string[];
    contact: string[];
    tag: string[];
  };
}

// Composant mémoïsé pour les items de filtre
const FilterItem = memo(({
  id,
  type,
  name,
  checked,
  onCheckedChange
}: {
  id: string;
  type: string;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center gap-2">
    <Checkbox
      id={`${type}-${id}`}
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
    />
    <Label htmlFor={`${type}-${id}`}>{name}</Label>
  </div>
));

FilterItem.displayName = "FilterItem";

export function FilterModal({
  merchants,
  contacts,
  deals,
  onFilterChange,
  currentFilters
}: FilterModalProps) {
  const allTags = Array.from(new Set(deals.flatMap(deal => deal.tags || [])));
  
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>(currentFilters.merchant);
  const [selectedContacts, setSelectedContacts] = useState<string[]>(currentFilters.contact);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tag);

  const [isMerchantOpen, setIsMerchantOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  // Mémoïsation des handlers
  const handleSelectionChange = useCallback((
    item: string,
    checked: boolean,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedItems(prev =>
      checked ? [...prev, item] : prev.filter(i => i !== item)
    );
  }, []);

  const handleFilterAction = useCallback((
    type: string, 
    selectedItems: string[],
    closeModal: () => void
  ) => {
    onFilterChange(type, selectedItems.length ? selectedItems : null);
    closeModal();
  }, [onFilterChange]);

  const handleReset = useCallback((
    type: string,
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
    closeModal?: () => void
  ) => {
    setSelectedItems([]);
    onFilterChange(type, null);
    if (closeModal) closeModal();
  }, [onFilterChange]);

  const FilterSection = useCallback(({
    type,
    items,
    selectedItems,
    setSelectedItems,
    currentFilterCount,
    labelPlural,
    labelSingular,
    isOpen,
    setIsOpen
  }: {
    type: string;
    items: { id: string; name: string }[] | string[];
    selectedItems: string[];
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
    currentFilterCount: number;
    labelPlural: string;
    labelSingular: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }) => {
    const isStringArray = typeof items[0] === 'string';
    
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {currentFilterCount
              ? `${labelPlural} (${currentFilterCount})`
              : `Tous les ${labelPlural.toLowerCase()}`}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-medium">Filtrer par {labelSingular.toLowerCase()}</h3>
              <Button 
                className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white hover:text-white font-bold"
                variant="ghost"
                size="sm"
                onClick={() => handleReset(type, setSelectedItems, () => setIsOpen(false))}
              >
                Réinitialiser
              </Button>
            </div>
            <div className="space-y-2">
              {items.map(item => {
                const id = isStringArray ? item as string : (item as { id: string }).id;
                const name = isStringArray ? item as string : (item as { name: string }).name;
                
                return (
                  <FilterItem
                    key={id}
                    id={id}
                    type={type}
                    name={name}
                    checked={selectedItems.includes(id)}
                    onCheckedChange={(checked) => 
                      handleSelectionChange(id, checked, selectedItems, setSelectedItems)
                    }
                  />
                );
              })}
            </div>
            <Button 
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              onClick={() => handleFilterAction(type, selectedItems, () => setIsOpen(false))}
            >
              Appliquer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [handleFilterAction, handleReset, handleSelectionChange]);

  return (
    <div className="flex gap-4">
      <FilterSection
        type="merchant"
        items={merchants}
        selectedItems={selectedMerchants}
        setSelectedItems={setSelectedMerchants}
        currentFilterCount={currentFilters.merchant.length}
        labelPlural="Marchands"
        labelSingular="marchand"
        isOpen={isMerchantOpen}
        setIsOpen={setIsMerchantOpen}
      />

      <FilterSection
        type="contact"
        items={contacts}
        selectedItems={selectedContacts}
        setSelectedItems={setSelectedContacts}
        currentFilterCount={currentFilters.contact.length}
        labelPlural="Contacts"
        labelSingular="contact"
        isOpen={isContactOpen}
        setIsOpen={setIsContactOpen}
      />

      <FilterSection
        type="tag"
        items={allTags}
        selectedItems={selectedTags}
        setSelectedItems={setSelectedTags}
        currentFilterCount={currentFilters.tag.length}
        labelPlural="Tags"
        labelSingular="tag"
        isOpen={isTagOpen}
        setIsOpen={setIsTagOpen}
      />
    </div>
  );
}