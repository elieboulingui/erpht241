"use client"
import { PageHeader } from "@/components/PageHeader";
import { FilterModal } from "./FilterModal";
import { Merchant, Deal, Contact } from "./types";

// interface HeaderCRMProps {
//   onAddClick?: () => void;
//   onAddColumn?: () => void;
//   merchants: Merchant[];
//   contacts: Contact[];
//   deals: Deal[];
//   onFilterChange: (filterType: string, value: string | string[] | null) => void;
//   onSearch: (searchTerm: string) => void;
//   currentFilters: {
//     merchant: string[];
//     contact: string[];
//     tag: string[];
//   };
// }

export function HeaderCRM(
  // { 
//   onAddClick = () => {}, 
//   onAddColumn = () => {},
//   merchants,
//   contacts,
//   deals,
//   onFilterChange,
//   onSearch,
//   currentFilters
// }: HeaderCRMProps
) {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <PageHeader
          title="CRM"
          searchPlaceholder="Rechercher..."
          showDropdownButton={false}
          // dropdownItems={[
          //   { label: "Carte", onClick: onAddClick },
          //   { label: "Colonne", onClick: onAddColumn }
          // ]}
       
        />
      </div>
      
      {/* <div className="px-6 mt-3">
        <FilterModal 
          merchants={merchants}
          contacts={contacts}
          deals={deals}
          onFilterChange={onFilterChange}
          currentFilters={currentFilters}
        />
      </div> */}
    </div>
  );
}