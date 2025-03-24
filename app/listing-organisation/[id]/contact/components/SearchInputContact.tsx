"use client"

import type { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps<TData> {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  table?: Table<TData>
  columnId?: string
  className?: string
}

export function SearchInputContact<TData>({
  placeholder = "Rechercher par nom",
  value,
  onChange,
  table,
  columnId = "name",
  className = "",
}: SearchInputProps<TData>) {
  return (
    <div className={`relative w-full md:w-60 ${className}`}>
      <Search className="absolute left-3 top-2.5 h-4 w-4  text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          if (table && columnId) {
            table.getColumn(columnId)?.setFilterValue(e.target.value)
          }
        }}
      />
    </div>
  )
}

