import { Merchant, Contact, Deal } from "./types";

interface FilterModalProps {
  merchants: Merchant[];
  contacts: Contact[];
  deals: Deal[];
  onFilterChange: (filterType: string, value: string | null) => void;
}

export function FilterModal({ merchants, contacts, deals, onFilterChange }: FilterModalProps) {
  const allTags = Array.from(new Set(deals.flatMap(deal => deal.tags || [])));

  return (
    <div className="flex gap-4">
      <select 
        className="border rounded p-2"
        onChange={(e) => onFilterChange("merchant", e.target.value || null)}
      >
        <option value="">Tous les marchands</option>
        {merchants.map(merchant => (
          <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
        ))}
      </select>

      <select 
        className="border rounded p-2"
        onChange={(e) => onFilterChange("contact", e.target.value || null)}
      >
        <option value="">Tous les contacts</option>
        {contacts.map(contact => (
          <option key={contact.id} value={contact.id}>{contact.name}</option>
        ))}
      </select>

      <select 
        className="border rounded p-2"
        onChange={(e) => onFilterChange("tag", e.target.value || null)}
      >
        <option value="">Tous les tags</option>
        {allTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </div>
  );
}