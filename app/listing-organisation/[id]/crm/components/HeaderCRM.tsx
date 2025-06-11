"use client";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface HeaderCRMProps {
  onSearchChange: (value: string, searchType: 'card' | 'list') => void;
}

export function HeaderCRM({ onSearchChange }: HeaderCRMProps) {
  const [data, setData] = useState("");
  const [searchType, setSearchType] = useState<'card' | 'list'>('card');

  return (
    <div className="flex flex-col gap-2 w-full">

      <PageHeader
        title="CRM"
        searchPlaceholder="Rechercher..."
        showDropdownButton={false}
        onSearchChange={(value) => {
          setData(value);
          onSearchChange(value, searchType); // Remonter la donnée et le type de recherche au parent
        }}
      />

      <div className="flex items-center justify-end gap-4 px-5">
        <div className="flex items-center space-x-2">
          <Label 
            htmlFor="searchCard" 
            className={`
              px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-300
              ${searchType === 'card' 
                ? 'bg-[#7f1d1c] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            <Input
              type="radio"
              id="searchCard"
              name="searchType"
              className="hidden"
              checked={searchType === 'card'}
              onChange={() => setSearchType('card')}
            />
            Recherche par carte
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label 
            htmlFor="searchList" 
            className={`
              px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-300
              ${searchType === 'list' 
                ? 'bg-[#7f1d1c] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            <Input
              type="radio"
              id="searchList"
              name="searchType"
              className="hidden"
              checked={searchType === 'list'}
              onChange={() => setSearchType('list')}
            />
            Recherche par liste
          </Label>
        </div>
      </div>
    </div>
  );
}
