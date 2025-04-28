"use client"

import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { FilterModal } from "./FilterModal";

interface HeaderCRMProps {
  onAddClick?: () => void;
  onAddColumn?: () => void;
  onFilterChange: (type: "contact" | "commercial" | "tag", values: string[]) => void;
}

export function HeaderCRM({ 
  onAddClick = () => {}, 
  onAddColumn = () => {},
  onFilterChange 
}: HeaderCRMProps) {
  const [filterType, setFilterType] = useState<"contact" | "commercial" | "tag" | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    contact: [] as string[],
    commercial: [] as string[],
    tag: [] as string[]
  });

  const handleFilterClick = (type: "contact" | "commercial" | "tag") => {
    setFilterType(type);
    setFilterOpen(true);
  };

  const handleApplyFilter = (selectedItems: string[]) => {
    if (filterType) {
      const newFilters = { ...activeFilters, [filterType]: selectedItems };
      setActiveFilters(newFilters);
      onFilterChange(filterType, selectedItems);
    }
  };

  const getFilterLabel = (type: "contact" | "commercial" | "tag") => {
    const count = activeFilters[type].length;
    return count > 0 ? (
      <span className="text-blue-600">{`${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`}</span>
    ) : (
      <span className="text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
    );
  };

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

      <div className="flex justify-between items-center border-b px-6 py-3">
        <nav className="flex space-x-6 text-sm">
          <button 
            className="font-medium flex items-center focus:outline-none"
            onClick={() => handleFilterClick("contact")}
          >
            {getFilterLabel("contact")}
          </button>

          <button 
            className="font-medium flex items-center focus:outline-none"
            onClick={() => handleFilterClick("commercial")}
          >
            {getFilterLabel("commercial")}
          </button>

          <button 
            className="font-medium flex items-center focus:outline-none"
            onClick={() => handleFilterClick("tag")}
          >
            {getFilterLabel("tag")}
          </button>
        </nav>
      </div>

      <FilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        type={filterType}
        onApply={handleApplyFilter}
        initialSelected={filterType ? activeFilters[filterType] : []}
      />
    </div>
  );
}