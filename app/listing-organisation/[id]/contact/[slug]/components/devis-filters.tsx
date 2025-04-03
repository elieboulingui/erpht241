"use client"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ALL_TAXES, ALL_STATUSES, getStatusClass } from "./devis-interface"

interface DevisFiltersProps {
  idFilter: string
  setIdFilter: (value: string) => void
  taxesFilter: string[]
  setTaxesFilter: (value: string[]) => void
  statusFilter: string[]
  setStatusFilter: (value: string[]) => void
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}