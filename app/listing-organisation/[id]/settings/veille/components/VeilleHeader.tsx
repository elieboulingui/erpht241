import { PageHeader } from "@/components/PageHeader";

export function VeilleHeader() {
    return (
        <div className="">
            <PageHeader
              title="Veille Concurentielle"
              searchPlaceholder="Rechercher une entreprise"
              showAddButton
              addButtonText="Ajouter une entreprise"
          
            />
        </div>
    );
}
