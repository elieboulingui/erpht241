"use client"

import type React from "react"

import { useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DevisSearchBarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  setCurrentPage: (page: number) => void
}

export default function DevisSearchBar({ searchTerm, setSearchTerm, setCurrentPage }: DevisSearchBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Input
        ref={searchInputRef}
        type="text"
        placeholder="Rechercher un devis"
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 pr-10 bg-[#e6e7eb] border-gray-300 focus:ring-2 focus:ring-red-500/50 transition-all"
      />
    </div>
  )
}

