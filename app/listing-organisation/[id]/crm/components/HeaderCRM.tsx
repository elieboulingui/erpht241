import { PageHeader } from "@/components/PageHeader";

export function HeaderCRM() {
    return (
        <div className="">
            <PageHeader
              title="CRM"
              searchPlaceholder="Rechercher..."
              showAddButton
              addButtonText="Nouveau"
          
            />
        </div>
    );
}
