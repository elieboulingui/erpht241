"use client";

import { Plus, UserPen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FactureAddButtonProps {
  onOpenManual: () => void;
  onOpenAI: () => void;
}

export function FactureAddButton({ onOpenManual, onOpenAI }: FactureAddButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
          <Plus className="h-4 w-4" /> Ajouter une facture
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[175px]">
        <DropdownMenuItem onClick={onOpenManual} className="cursor-pointer">
          <UserPen className="h-4 w-4 mr-2" />
          <span>Manuellement</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenAI} className="cursor-pointer">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Via IA</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}