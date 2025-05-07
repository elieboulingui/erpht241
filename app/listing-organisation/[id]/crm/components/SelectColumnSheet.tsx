import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DealStag } from "./types";
import { PlusCircle } from 'lucide-react';

interface SelectColumnSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: DealStag[];
  onSelect: (columnId: string) => void;
  onAddColumn: () => void; // Nouvelle prop pour gérer l'ajout d'une colonne
}

export function SelectColumnSheet({
  open,
  onOpenChange,
  columns,
  onSelect,
  onAddColumn,
}: SelectColumnSheetProps) {
  // Vérifier si la liste des colonnes est vide
  const isEmpty = !columns || !Array.isArray(columns) || columns.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {isEmpty ? "Aucune colonne disponible" : "Sélectionner une colonne"}
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
            <div className="text-center space-y-2">
              <p className="text-gray-500">Vous n'avez pas encore de colonne.</p>
              <p className="text-gray-500">
                Créez une colonne pour pouvoir ajouter des opportunités.
              </p>
            </div>
            <Button
              onClick={() => {
                onAddColumn();
                onOpenChange(false);
              }}
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une colonne
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {columns.map((column) => (
              <Button
                key={column.id}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  onSelect(column.id);
                  onOpenChange(false);
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${column.color} mr-2`}
                ></span>
                {column.label}
              </Button>
            ))}
          </div>
        )}

        {!isEmpty && (
          <SheetFooter className="mt-4">
            <Button
              onClick={() => {
                onAddColumn();
                onOpenChange(false);
              }}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une nouvelle colonne
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
