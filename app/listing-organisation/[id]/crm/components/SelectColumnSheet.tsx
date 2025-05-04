import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Importation des composants de la feuille
import { Button } from "@/components/ui/button"; // Importation du bouton
import { DealStage } from "./types"; // Importation du type DealStage

// Définition des props attendues par le composant SelectColumnSheet
interface SelectColumnSheetProps {
  open: boolean; // L'état d'ouverture de la feuille
  onOpenChange: (open: boolean) => void; // Fonction pour gérer l'ouverture/fermeture de la feuille
  columns: DealStage[]; // Les colonnes à afficher, ici des DealStages
  onSelect: (columnId: string) => void; // Fonction appelée lors de la sélection d'une colonne
}

// Composant SelectColumnSheet
export function SelectColumnSheet({
  open,
  onOpenChange,
  columns,
  onSelect,
}: SelectColumnSheetProps) {
  // Vérification que columns est défini et est un tableau avant de l'utiliser
  if (!columns || !Array.isArray(columns)) {
    return null; // Ou un message d'erreur ou autre, selon votre choix
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}> {/* Contrôle l'ouverture de la feuille */}
      <SheetContent className="w-full sm:max-w-md"> {/* Contenu de la feuille, avec une largeur maximale pour les grands écrans */}
        <SheetHeader>
          <SheetTitle>Sélectionner une colonne</SheetTitle> {/* Titre de la feuille */}
        </SheetHeader>

        <div className="grid gap-4 py-4"> {/* Utilisation d'une grille avec des espacements */}
          {columns.map((column) => ( // Boucle sur chaque colonne pour générer un bouton
            <Button
              key={column.id} // Identifiant unique pour chaque bouton
              variant="outline" // Type de bouton "outline"
              className="justify-start" // Alignement du texte du bouton à gauche
              onClick={() => { // Gestion du clic sur le bouton
                onSelect(column.id); // Appel de la fonction onSelect avec l'ID de la colonne
                onOpenChange(false); // Fermeture de la feuille après la sélection
              }}
            >
              {column.label} {/* Affichage de l'étiquette de la colonne */}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
