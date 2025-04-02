"use client"
import { Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { ALL_TAXES, ALL_STATUSES, getStatusClass } from "./devis-interface"

interface DevisFiltersProps {
  idFilter: string
  setIdFilter: (value: string) => void
  taxesFilter: string[]
  setTaxesFilter: (value: string[]) => void
  statusFilter: string[]
  setStatusFilter: (value: string[]) => void
  dateFilter: { start?: Date; end?: Date }
  setDateFilter: (value: { start?: Date; end?: Date }) => void
  addFilter: (type: string, value: string) => void
  removeFilter: (filter: string) => void
  toggleTaxesFilter: (tax: string) => void
  toggleStatusFilter: (status: string) => void
  applyIdFilter: () => void
}

export default function DevisFilters({
  idFilter,
  setIdFilter,
  taxesFilter,
  statusFilter,
  dateFilter,
  setDateFilter,
  addFilter,
  removeFilter,
  toggleTaxesFilter,
  toggleStatusFilter,
  applyIdFilter,
}: DevisFiltersProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#e6e7eb] border-gray-300 text-gray-700 flex items-center gap-1 hover:bg-gray-200 transition-colors"
        >
          <Filter className="h-4 w-4" /> Filtres avancés
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-xl">
        <div className="p-2">
          <p className="text-sm font-medium mb-2">ID Devis</p>
          <div className="flex gap-2">
            <Input
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
              placeholder="Filtrer par ID"
              className="h-8 text-sm"
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 hover:bg-gray-100 transition-colors"
              onClick={applyIdFilter}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-sm font-medium mb-2">Taxes</p>
          {ALL_TAXES.map((tax) => (
            <DropdownMenuCheckboxItem
              key={tax}
              checked={taxesFilter.includes(tax)}
              onCheckedChange={() => toggleTaxesFilter(tax)}
              className="hover:bg-gray-50 transition-colors"
            >
              {tax}
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-sm font-medium mb-2">Statut</p>
          {ALL_STATUSES.map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={statusFilter.includes(status)}
              onCheckedChange={() => toggleStatusFilter(status)}
              className="hover:bg-gray-50 transition-colors"
            >
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(status)}`}></span>
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-sm font-medium mb-2">Date d'échéance</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-8 text-sm hover:bg-gray-50 transition-colors"
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateFilter.start ? (
                  dateFilter.end ? (
                    <>
                      {dateFilter.start.toLocaleDateString()} - {dateFilter.end.toLocaleDateString()}
                    </>
                  ) : (
                    dateFilter.start.toLocaleDateString()
                  )
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-lg" align="start">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateFilter.start,
                  to: dateFilter.end,
                }}
                onSelect={(range) => {
                  if (range?.from) {
                    setDateFilter({
                      start: range.from,
                      end: range.to,
                    })
                    addFilter("date", `${range.from.toISOString()}${range.to ? `-${range.to.toISOString()}` : ""}`)
                  } else {
                    setDateFilter({})
                    removeFilter("date")
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

