"use client"
import { PageHeader } from "@/components/PageHeader";

export function HeaderCRM(
) {
  return (
      <div className="flex justify-between items-center">
        <PageHeader
          title="CRM"
          searchPlaceholder="Rechercher..."
          showDropdownButton={false}   
        />
      </div>
  );
}