"use client";

import { useState } from "react";
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

  const handleMerchantChange = (merchantId: string, checked: boolean) => {
    setSelectedMerchants(prev =>
      checked
        ? [...prev, merchantId]
        : prev.filter(id => id !== merchantId)
    );
  };

  const handleContactChange = (contactId: string, checked: boolean) => {
    setSelectedContacts(prev =>
      checked
        ? [...prev, contactId]
        : prev.filter(id => id !== contactId)
    );
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setSelectedTags(prev =>
      checked
        ? [...prev, tag]
        : prev.filter(t => t !== tag)
    );
  };

  const applyFilters = (type: string) => {
    switch (type) {
      case "merchant":
        onFilterChange("merchant", selectedMerchants.length ? selectedMerchants : null);
        break;
      case "contact":
        onFilterChange("contact", selectedContacts.length ? selectedContacts : null);
        break;
      case "tag":
        onFilterChange("tag", selectedTags.length ? selectedTags : null);
        break;
    }
  };

  const resetFilters = (type: string) => {
    switch (type) {
      case "merchant":
        setSelectedMerchants([]);
        onFilterChange("merchant", null);
        break;
      case "contact":
        setSelectedContacts([]);
        onFilterChange("contact", null);
        break;
      case "tag":
        setSelectedTags([]);
        onFilterChange("tag", null);
        break;
    }
  };

  return (
    <div className="flex gap-4">
      {/* Modal pour les marchands */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {currentFilters.merchant.length
              ? `Marchands (${currentFilters.merchant.length})`
              : "Tous les marchands"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-medium">Filtrer par marchand</h3>
              <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white hover:text-white font-bold"
                variant="ghost"
                size="sm"
                onClick={() => resetFilters("merchant")}
              >
                Réinitialiser
              </Button>
            </div>
            <div className="space-y-2">
              {merchants.map(merchant => (
                <div key={merchant.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`merchant-${merchant.id}`}
                    checked={selectedMerchants.includes(merchant.id)}
                    onCheckedChange={(checked) =>
                      handleMerchantChange(merchant.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`merchant-${merchant.id}`}>{merchant.name}</Label>
                </div>
              ))}
            </div>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              onClick={() => applyFilters("merchant")}>Appliquer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal pour les contacts */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {currentFilters.contact.length
              ? `Contacts (${currentFilters.contact.length})`
              : "Tous les contacts"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-medium">Filtrer par contact</h3>
              <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white hover:text-white font-bold"
                variant="ghost"
                size="sm"
                onClick={() => resetFilters("contact")}
              >
                Réinitialiser
              </Button>
            </div>
            <div className="space-y-2">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`contact-${contact.id}`}
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={(checked) =>
                      handleContactChange(contact.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`contact-${contact.id}`}>{contact.name}</Label>
                </div>
              ))}
            </div>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              onClick={() => applyFilters("contact")}>Appliquer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal pour les tags */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {currentFilters.tag.length
              ? `Tags (${currentFilters.tag.length})`
              : "Tous les tags"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center mt-6">
              <h3 className="text-lg font-medium">Filtrer par tag</h3>
              <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white hover:text-white font-bold"
                variant="ghost"
                size="sm"
                onClick={() => resetFilters("tag")}
              >
                Réinitialiser
              </Button>
            </div>
            <div className="space-y-2">
              {allTags.map(tag => (
                <div key={tag} className="flex items-center gap-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) =>
                      handleTagChange(tag, checked as boolean)
                    }
                  />
                  <Label htmlFor={`tag-${tag}`}>{tag}</Label>
                </div>
              ))}
            </div>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
              onClick={() => applyFilters("tag")}>Appliquer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}