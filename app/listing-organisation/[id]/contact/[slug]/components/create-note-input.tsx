"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, PenLine } from "lucide-react"

interface CreateNoteInputProps {
  onCreateClick: () => void
}

export function CreateNoteInput({ onCreateClick }: CreateNoteInputProps) {
  return (
    <div className="relative">
      <Input
        placeholder="Créer une note..."
        className="pr-20 py-6 text-base shadow-sm cursor-pointer"
        onClick={onCreateClick}
        readOnly
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Check className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <PenLine className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

