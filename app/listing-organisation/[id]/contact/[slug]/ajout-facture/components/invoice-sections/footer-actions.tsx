import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function FooterActions() {
  return (
    <footer className="bg-black flex items-center justify-between p-4 w-full">
      <div>
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">Annuler</button>
      </div>
      <div className="flex items-center gap-4">
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">
          prévisualiser et Imprimer
        </button>
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">Rendre récurrent</button>
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">Enregistrer</button>
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white px-6 py-2 rounded-full text-sm flex items-center gap-1">
                Enregistrer et envoyer
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <span>Par Email</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Par WhatsApp</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Par SMS</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Copier le lien</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  )
}