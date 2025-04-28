import { PageHeader } from "@/components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderCRMProps {
  onAddClick?: () => void;
  onAddColumn?: () => void;
}

export function HeaderCRM({ onAddClick = () => {}, onAddColumn = () => {} }: HeaderCRMProps) {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <PageHeader
          title="CRM"
          searchPlaceholder="Rechercher..."
          showDropdownButton={true}
          dropdownItems={[
            {
              label: "Carte",
              onClick: onAddClick,
            },
            {
              label: "Colonne",
              onClick: onAddColumn,
            }
          ]}
        />
      </div>

      <div className="flex justify-between items-center border-b px-6 py-3">
        <nav className="flex space-x-6 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-medium flex items-center focus:outline-none">
                Contact
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {/* Contenu du menu déroulant Contact */}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 flex items-center focus:outline-none">
                Commerciaux
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {/* Contenu du menu déroulant Commerciaux */}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 flex items-center focus:outline-none">
                Tags
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {/* Contenu du menu déroulant Tags */}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </div>
  );
}