"use client";

import { useState, useCallback, memo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Merchant, Contact, Deal } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchIcon, CheckIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Constantes de design
const PRIMARY_COLOR = "#7f1d1c";
const PRIMARY_COLOR_HOVER = "#7f1d1c/90";
const TRANSITION = "transition-all duration-200 ease-in-out";

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
  isLoading?: boolean;
}

// Composant Checkbox personnalisé
const ElegantCheckbox = memo(({
  id,
  checked,
  onCheckedChange
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="relative flex items-center">
    <div className={`
      h-5 w-5 rounded-[4px] border-2 flex items-center justify-center
      ${TRANSITION}
      ${checked 
        ? `bg-[${PRIMARY_COLOR}] border-[${PRIMARY_COLOR}]` 
        : 'border-gray-300 hover:border-gray-400 bg-white'
      }
    `}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="absolute opacity-0"
      />
      {checked && (
        <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      )}
    </div>
  </div>
));

ElegantCheckbox.displayName = "ElegantCheckbox";

// Composant Item de filtre avec design premium
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
  <label
    htmlFor={`${type}-${id}`}
    className={`
      flex items-center gap-3 p-3 rounded-lg cursor-pointer select-none
      ${TRANSITION}
      ${checked 
        ? 'bg-gray-50 border border-gray-100' 
        : 'hover:bg-gray-50'
      }
    `}
  >
    <ElegantCheckbox
      id={`${type}-${id}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
    <span className={`
      text-sm font-medium
      ${checked ? 'text-gray-900' : 'text-gray-700'}
    `}>
      {name}
    </span>
  </label>
));

FilterItem.displayName = "FilterItem";

export function FilterModal({
  merchants,
  contacts,
  deals,
  onFilterChange,
  currentFilters,
  isLoading = false
}: FilterModalProps) {
  const allTags = Array.from(new Set(deals.flatMap(deal => deal.tags || [])));
  
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>(currentFilters.merchant);
  const [selectedContacts, setSelectedContacts] = useState<string[]>(currentFilters.contact);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tag);

  const [isMerchantOpen, setIsMerchantOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  const [merchantSearch, setMerchantSearch] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Handlers mémoïsés
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
    closeModal?: () => void,
    setSearchTerm?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSelectedItems([]);
    if (setSearchTerm) setSearchTerm("");
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
    setIsOpen,
    searchTerm,
    setSearchTerm
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
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const isStringArray = typeof items[0] === 'string';
    
    const filteredItems = items.filter(item => {
      const name = isStringArray ? item as string : (item as { name: string }).name;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="relative group"
            aria-label={`Filtrer par ${labelPlural.toLowerCase()}`}
          >
            <span className={`${TRANSITION} ${currentFilterCount ? 'font-medium' : ''}`}>
              {currentFilterCount
                ? `${labelPlural} (${currentFilterCount})`
                : `Tous les ${labelPlural.toLowerCase()}`}
            </span>
            {currentFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7f1d1c] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-[#7f1d1c]/90 transition-colors">
                {currentFilterCount}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto p-6 data-[state=open]:animate-fadeIn">
          <div className="space-y-6">
            <div className="flex justify-between items-center py-5">
              <h3 className="text-lg font-semibold text-gray-900">Filtrer par {labelSingular.toLowerCase()}</h3>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => handleReset(type, setSelectedItems, () => setIsOpen(false), setSearchTerm)}
                className="text-gray-500 hover:text-gray-700"
              >
                Réinitialiser
              </Button>
            </div>

            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Rechercher un ${labelSingular.toLowerCase()}...`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500">Aucun {labelSingular.toLowerCase()} trouvé</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700">Sélection multiple</Label>
                  <button
                    onClick={() => {
                      if (selectedItems.length === filteredItems.length) {
                        setSelectedItems([]);
                      } else {
                        setSelectedItems(filteredItems.map(item => 
                          isStringArray ? item as string : (item as { id: string }).id
                        ));
                      }
                    }}
                    className="text-xs font-medium text-[#7f1d1c] hover:text-[#7f1d1c]/80"
                  >
                    {selectedItems.length === filteredItems.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </button>
                </div>

                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {filteredItems.map(item => {
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
              </>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button 
                className={`flex-1 bg-[${PRIMARY_COLOR}] hover:bg-[${PRIMARY_COLOR_HOVER}] text-white`}
                onClick={() => handleFilterAction(type, selectedItems, () => setIsOpen(false))}
                disabled={isLoading}
              >
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [handleFilterAction, handleReset, handleSelectionChange, isLoading]);

  return (
    <div className="flex gap-3 flex-wrap">
      <FilterSection
        type="merchant"
        items={merchants}
        selectedItems={selectedMerchants}
        setSelectedItems={setSelectedMerchants}
        currentFilterCount={currentFilters.merchant.length}
        labelPlural="Commerçants"
        labelSingular="commerçant"
        isOpen={isMerchantOpen}
        setIsOpen={setIsMerchantOpen}
        searchTerm={merchantSearch}
        setSearchTerm={setMerchantSearch}
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
        searchTerm={contactSearch}
        setSearchTerm={setContactSearch}
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
        searchTerm={tagSearch}
        setSearchTerm={setTagSearch}
      />
    </div>
  );
}