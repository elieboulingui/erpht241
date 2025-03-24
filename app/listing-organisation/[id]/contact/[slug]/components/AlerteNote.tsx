"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"

interface ReminderMenuProps {
  position: { top: number; left: number }
  onSelectReminder: (time: string) => void
  onClose: () => void
}

export function AlerteNote({ position, onSelectReminder, onClose }: ReminderMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border rounded-md shadow-md w-64"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="py-2">
        <div className="px-3 pb-2">
          <p className="text-sm font-medium">Me le rappeler plus tard</p>
          <p className="text-xs text-muted-foreground">Enregistré dans les rappels Google</p>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => onSelectReminder("today")}
          >
            <span>Plus tard dans la journée</span>
            <span className="text-muted-foreground">20:00</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => onSelectReminder("tomorrow")}
          >
            <span>Demain</span>
            <span className="text-muted-foreground">08:00</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between text-sm font-normal h-9 px-3 rounded-none"
            onClick={() => onSelectReminder("next-week")}
          >
            <span>Semaine prochaine</span>
            <span className="text-muted-foreground">lun., 08:00</span>
          </Button>
        </div>

        <hr className="my-1" />

        <Button
          variant="ghost"
          className="w-full justify-start text-sm font-normal h-9 px-3 gap-2 rounded-none"
          onClick={() => onSelectReminder("custom-time")}
        >
          <Clock className="h-4 w-4" />
          <span>Sélectionner la date et l'heure</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-sm font-normal h-9 px-3 gap-2 rounded-none"
          onClick={() => onSelectReminder("custom-location")}
        >
          <MapPin className="h-4 w-4" />
          <span>Sélectionner le lieu</span>
        </Button>
      </div>
    </div>
  )
}

