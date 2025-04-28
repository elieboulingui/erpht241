import { PageHeader } from "@/components/PageHeader";
import { FilterModal } from "./FilterModal";
import { Merchant, Deal, Contact } from "./types";

interface HeaderCRMProps {
  onAddClick?: () => void;
  onAddColumn?: () => void;
  merchants: Merchant[];
  contacts: Contact[];
  deals: Deal[];
  onFilterChange: (filterType: string, value: string | null) => void;
  onSearch: (searchTerm: string) => void;
}

export function HeaderCRM({ 
  onAddClick = () => {}, 
  onAddColumn = () => {},
  merchants,
  contacts,
  deals,
  onFilterChange,
  onSearch
}: HeaderCRMProps) {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <PageHeader
          title="CRM"
          searchPlaceholder="Rechercher..."
          showDropdownButton={true}
          dropdownItems={[
            { label: "Carte", onClick: onAddClick },
            { label: "Colonne", onClick: onAddColumn }
          ]}
        />
      </div>
      
      <div className="mt-4 px-6">
        <FilterModal 
          merchants={merchants}
          contacts={contacts}
          deals={deals}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}