"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
}

export default function DateRangePicker({ className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 22),
    to: new Date(2025, 1, 21),
  })

  const [activeFilter, setActiveFilter] = React.useState<string>("30d")

  const handleFilterClick = (days: number, filter: string) => {
    const today = new Date()
    setDate({
      from: addDays(today, -days),
      to: today,
    })
    setActiveFilter(filter)
  }

  return (
    <div className={cn("flex items-center gap-2 border-b border-gray-200 pb-1.5 px-3 relative mt-2", className)}>
      <div className="flex gap-1">
        {[
          { label: "1d", days: 1 },
          { label: "3d", days: 3 },
          { label: "7d", days: 7 },
          { label: "30d", days: 30 },
          { label: "Custom", days: 0 },
        ].map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="sm"
            onClick={() => handleFilterClick(item.days, item.label)}
            className={cn(
              "relative hover:bg-transparent",
              activeFilter === item.label &&
                "font-bold text-[#591112] after:absolute after:bottom-[-5.5px] after:left-0 after:w-full after:h-[1px] after:bg-[#591112]",
              activeFilter !== item.label && "text-gray-500 font-bold",
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "justify-start text-left font-normal relative hover:bg-transparent border border-gray-200",
              !date && "text-muted-foreground",
              activeFilter === "Custom" &&
                "font-medium after:absolute after:bottom-[-16px] after:left-0 after:w-full after:h-[2px] after:bg-[#591112]",
            )}
            onClick={() => setActiveFilter("Custom")}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#591112]" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, yyyy")} - {format(date.to, "LLL dd, yyyy")}
                </>
              ) : (
                format(date.from, "LLL dd, yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
