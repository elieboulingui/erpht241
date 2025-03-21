"use client"

import type React from "react"

import { useState } from "react"
import { Clock, MapPin } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface ReminderMenuProps {
  trigger: React.ReactNode
  onSelect?: (time: string) => void
  onClose?: () => void
}

export function ReminderMenu({ trigger, onSelect, onClose }: ReminderMenuProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (time: string) => {
    if (onSelect) onSelect(time)
    setOpen(false)
    if (onClose) onClose()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="py-2">
          <div className="px-3 pb-2">
            <p className="text-sm font-medium">Me le rappeler plus tard</p>
            <p className="text-xs text-muted-foreground">Enregistré dans les rappels Google</p>
          </div>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
              onClick={() => handleSelect("today")}
            >
              <span>Plus tard dans la journée</span>
              <span className="text-muted-foreground">20:00</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
              onClick={() => handleSelect("tomorrow")}
            >
              <span>Demain</span>
              <span className="text-muted-foreground">08:00</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
              onClick={() => handleSelect("next-week")}
            >
              <span>Semaine prochaine</span>
              <span className="text-muted-foreground">lun., 08:00</span>
            </Button>
          </div>

          <Separator className="my-1" />

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 gap-2 rounded-none"
            onClick={() => handleSelect("custom-time")}
          >
            <Clock className="h-4 w-4" />
            <span>Sélectionner la date et l'heure</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal h-9 px-3 gap-2 rounded-none"
            onClick={() => handleSelect("custom-location")}
          >
            <MapPin className="h-4 w-4" />
            <span>Sélectionner le lieu</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

