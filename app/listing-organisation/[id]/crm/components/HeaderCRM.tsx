import { PageHeader } from "@/components/PageHeader";

interface HeaderCRMProps {
  onAddClick?: () => void;
}

export function HeaderCRM({ onAddClick }: HeaderCRMProps) {
  return (
    <div className="">
      <PageHeader
        title="CRM"
        searchPlaceholder="Rechercher..."
        showAddButton
        addButtonText="Nouveau"
        onAddClick={onAddClick}
      />
    </div>
  );
}