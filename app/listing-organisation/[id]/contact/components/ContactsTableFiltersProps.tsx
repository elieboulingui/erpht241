"use client"

import type { Table } from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CirclePlus, LayoutGrid, Users, Building2, Search } from "lucide-react"
import { ContactPrincipal } from "@/contactPrincipal"

interface ContactsTableFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  stageFilter: string
  setStageFilter: (value: string) => void
  tagsFilter: string[]
  setTagsFilter: (value: string[]) => void
  uniqueStages: string[]
  uniqueTags: string[]
  table: Table<ContactPrincipal>
}

export function ContactsTableFilters({
  searchQuery,
  setSearchQuery,
  stageFilter,
  setStageFilter,
  tagsFilter,
  setTagsFilter,
  uniqueStages,
  uniqueTags,
  table,
}: ContactsTableFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Tabs defaultValue="all">
          <TabsList className="w-full justify-start rounded-none h-14 px-4 space-x-5 bg-transparent">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 py-4 gap-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
            >
              <LayoutGrid className="h-4 w-4" />
              Tous
            </TabsTrigger>
            <TabsTrigger
              value="personne"
              className="data-[state=active]:border-b-2 py-4 gap-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
            >
              <Users className="h-4 w-4" />
              Personnes
            </TabsTrigger>
            <TabsTrigger
              value="compagnie"
              className="data-[state=active]:border-b-2 py-4 gap-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
            >
              <Building2 className="h-4 w-4" />
              Compagnies
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 ml-4">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous stages</SelectItem>
              {uniqueStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              value="default"
              className="flex items-center gap-2 bg-transparent hover:bg-transparent text-black border border-gray-200"
            >
              <CirclePlus className="h-4 w-4" />
              Tags {tagsFilter.length > 0 && `(${tagsFilter.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {uniqueTags.map((tag) => (
              <DropdownMenuItem key={tag} className="flex items-center gap-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={tagsFilter.includes(tag)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTagsFilter([...tagsFilter, tag])
                    } else {
                      setTagsFilter(tagsFilter.filter((t) => t !== tag))
                    }
                  }}
                />
                <label htmlFor={`tag-${tag}`} className="flex-1 cursor-pointer">
                  {tag}
                </label>
              </DropdownMenuItem>
            ))}
            {tagsFilter.length > 0 && (
              <DropdownMenuItem className="justify-center text-red-500 font-medium" onClick={() => setTagsFilter([])}>
                Réinitialiser les filtres
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative w-full md:w-60 px-5">
        <Search className="absolute left-7 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom etc"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            table.getColumn("name")?.setFilterValue(e.target.value)
          }}
        />
      </div>
    </div>
  )
}

