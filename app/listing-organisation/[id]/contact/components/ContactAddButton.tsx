"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Sparkles, UserPen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactAddButtonProps {
  onOpenManual: () => void;
  onOpenAI: () => void;
}

export default function ContactAddButton({
  onOpenManual,
  onOpenAI,
}: ContactAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
          <Plus className="h-4 w-4 " /> Ajouter un contact
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[175px]">
        <DropdownMenuItem onClick={onOpenManual} className="cursor-pointer  ">
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
