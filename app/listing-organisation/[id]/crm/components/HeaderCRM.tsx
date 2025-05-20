"use client";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";

interface HeaderCRMProps {
  onSearchChange: (value: string) => void; // Définir le type de la prop
}

export function HeaderCRM({ onSearchChange }: HeaderCRMProps) {
  const [data, setData] = useState("");

  return (
    <div className="flex flex-col gap-2 w-full">
      <PageHeader
        title="CRM"
        searchPlaceholder="Rechercher..."
        showDropdownButton={false}
        onSearchChange={(value) => {
          setData(value);
          onSearchChange(value); // Remonter la donnée au parent
        }}
      />
    </div>
  );
}
