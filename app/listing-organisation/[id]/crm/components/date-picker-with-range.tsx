"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerDemoProps {
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
}

export function DatePickerDemo({ selected, onSelect }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected)

  // Update internal state when selected prop changes
  React.useEffect(() => {
    setDate(selected)
  }, [selected])

  // Handle date selection and propagate to parent if onSelect is provided
  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (onSelect) {
      onSelect(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn("w-[240px] justify-start text-left font-normal  bg-[#7f1d1c] hover:bg-[#7f1d1c]/80", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Choisir une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar selected={date} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
