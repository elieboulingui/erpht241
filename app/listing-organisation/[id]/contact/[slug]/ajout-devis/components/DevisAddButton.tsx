"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon as UserPen, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface DevisAddButtonProps {
  organisationId: string
  contactSlug: string
}

export default function DevisAddButton({ organisationId, contactSlug }: DevisAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
        <Plus className="h-4 w-4 " /> Ajouter un devis
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-[163px]">
      <DropdownMenuItem
        onClick={() =>
          router.push(
            `/listing-organisation/${organisationId}/contact/${contactSlug}/ajout-devis`
          )
        }
        className="cursor-pointer"
      >
        <UserPen className="h-4 w-4 mr-2" />
        <span>Manuellement</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => setIsAIGeneratorOpen(true)}
        className="cursor-pointer"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        <span>Via IA</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  )
}

