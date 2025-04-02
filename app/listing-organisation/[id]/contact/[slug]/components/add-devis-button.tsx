"use client"

import { Plus, PenIcon as UserPen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ChatModal from "@/app/agents/devis/component/chat"

interface AddDevisButtonProps {
  organisationId: string
  contactSlug: string
  handleAddDevis: (type: "manual" | "ai") => void
}

export default function AddDevisButton({ organisationId, contactSlug, handleAddDevis }: AddDevisButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg">
          <Plus className="h-4 w-4" /> Ajouter un devis
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[163px] shadow-xl">
        <DropdownMenuItem
          onClick={() => handleAddDevis("manual")}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <UserPen className="h-4 w-4 mr-2" />
          <span>Manuellement</span>
        </DropdownMenuItem>

        <ChatModal>
          <Button className="w-full flex justify-start" variant="ghost">
            <Sparkles className="h-4 w-4 mr-2" />
            Via IA
          </Button>
        </ChatModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

