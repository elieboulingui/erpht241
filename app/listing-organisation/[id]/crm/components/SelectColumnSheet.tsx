import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DealStage } from "./types";

interface SelectColumnSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: DealStage[];
  onSelect: (columnId: string) => void;
}

export function SelectColumnSheet({ open, onOpenChange, columns, onSelect }: SelectColumnSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Sélectionner une colonne</SheetTitle>
        </SheetHeader>

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
              {column.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}