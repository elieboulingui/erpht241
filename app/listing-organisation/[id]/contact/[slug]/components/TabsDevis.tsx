"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Search, Filter, Calendar, X, SlidersHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const TabsDevis = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const router = useRouter()

  // Filter states
  const [idFilter, setIdFilter] = useState("")
  const [taxesFilter, setTaxesFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({})

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [devis, setDevis] = useState([
    {
      id: "HT241062025",
      dateFacturation: "05/03/2025",
      dateEcheance: "05/04/2025",
      taxes: "Hors Taxe",
      statut: "Validé",
      selected: false,
    },
    {
      id: "HT241002025",
      dateFacturation: "03/03/2025",
      dateEcheance: "05/04/2025",
      taxes: "TVA",
      statut: "Facturé",
      selected: false,
    },
    {
      id: "HT243302025",
      dateFacturation: "11/03/2025",
      dateEcheance: "sans",
      taxes: "TVA",
      statut: "Validé",
      selected: false,
    },
    {
      id: "HT241132025",
      dateFacturation: "07/03/2025",
      dateEcheance: "sans",
      taxes: "TVA",
      statut: "Attente",
      selected: false,
    },
  ])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const filteredDevis = devis.filter((devis) => {
    let matches = devis.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply ID filter
    if (idFilter && !devis.id.toLowerCase().includes(idFilter.toLowerCase())) {
      matches = false
    }

    // Apply taxes filter
    if (taxesFilter.length > 0 && !taxesFilter.includes(devis.taxes)) {
      matches = false
    }

    // Apply status filter
    if (statusFilter.length > 0 && !statusFilter.includes(devis.statut)) {
      matches = false
    }

    return matches
  })

  const toggleSelection = (id: string) => {
    setDevis(devis.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)))
  }

  const selectAll = (checked: boolean) => {
    setDevis(devis.map((item) => ({ ...item, selected: checked })))
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Validé":
        return "bg-amber-100 text-amber-800"
      case "Facturé":
        return "bg-green-100 text-green-800"
      case "Attente":
        return "bg-pink-200 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const addFilter = (type: string, value: string) => {
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters([...activeFilters, `${type}:${value}`])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    // Reset the corresponding filter state
    const [type, value] = filter.split(":")
    if (type === "taxes") {
      setTaxesFilter(taxesFilter.filter((t) => t !== value))
    } else if (type === "statut") {
      setStatusFilter(statusFilter.filter((s) => s !== value))
    } else if (type === "id") {
      setIdFilter("")
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setIdFilter("")
    setTaxesFilter([])
    setStatusFilter([])
    setDateFilter({})
  }

  const toggleTaxesFilter = (tax: string) => {
    if (taxesFilter.includes(tax)) {
      setTaxesFilter(taxesFilter.filter((t) => t !== tax))
      removeFilter(`taxes:${tax}`)
    } else {
      setTaxesFilter([...taxesFilter, tax])
      addFilter("taxes", tax)
    }
  }

  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status))
      removeFilter(`statut:${status}`)
    } else {
      setStatusFilter([...statusFilter, status])
      addFilter("statut", status)
    }
  }

  const applyIdFilter = () => {
    if (idFilter) {
      // Remove any existing ID filter
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("id:")))
      // Add the new one
      addFilter("id", idFilter)
    }
  }

  // Get unique values for filters
  const uniqueTaxes = Array.from(new Set(devis.map((d) => d.taxes)))
  const uniqueStatuses = Array.from(new Set(devis.map((d) => d.statut)))

  const organisationId = "someOrgId"
  const contactSlug = "someContactSlug"

  return (
    <Tabs defaultValue="devis">
      <TabsContent value="devis" className="p-0">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex gap-2 flex-1">
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  className="pl-10 pr-10 bg-gray-100 border-gray-300"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-gray-100 border-gray-300 text-gray-700 flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" /> Filtres avancés
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">ID Facture</p>
                    <div className="flex gap-2">
                      <Input
                        value={idFilter}
                        onChange={(e) => setIdFilter(e.target.value)}
                        placeholder="Filtrer par ID"
                        className="h-8 text-sm"
                      />
                      <Button size="sm" variant="ghost" className="h-8 px-2" onClick={applyIdFilter}>
                        <Filter className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Taxes</p>
                    {uniqueTaxes.map((tax) => (
                      <DropdownMenuCheckboxItem
                        key={tax}
                        checked={taxesFilter.includes(tax)}
                        onCheckedChange={() => toggleTaxesFilter(tax)}
                      >
                        {tax}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>

                  <DropdownMenuSeparator />

                  <div className="p-2">
                    <p className="text-sm font-medium mb-2">Statut</p>
                    {uniqueStatuses.map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
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
                          className="w-full justify-start text-left font-normal h-8 text-sm"
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="range"
                          selected={{
                            from: dateFilter.start,
                            to: dateFilter.end,
                          }}
                          onSelect={(range) => {
                            setDateFilter({
                              start: range?.from,
                              end: range?.to,
                            })
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button
              className="bg-black text-white hover:bg-black flex items-center gap-1"
              onClick={() => router.push(`/listing-organisation/${organisationId}/contact/${contactSlug}/ajout-devis`)}
            >
              Ajouter un devis
            </Button>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-500 flex items-center">
                <SlidersHorizontal className="h-3 w-3 mr-1" /> Filtres actifs:
              </span>
              {activeFilters.map((filter) => {
                const [type, value] = filter.split(":")
                return (
                  <Badge key={filter} variant="outline" className="flex items-center gap-1 bg-gray-100">
                    <span className="text-xs">
                      {type === "taxes" ? "Taxes: " : type === "statut" ? "Statut: " : type === "id" ? "ID: " : ""}
                      {value}
                    </span>
                    <button onClick={() => removeFilter(filter)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
              <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500" onClick={clearAllFilters}>
                Effacer tout
              </Button>
            </div>
          )}
        </div>

        {/* Devis Table */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow className="border-b border-gray-300">
                <TableHead className="w-12 text-gray-900 font-medium">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={filteredDevis.length > 0 && filteredDevis.every((d) => d.selected)}
                      onCheckedChange={(checked) => selectAll(!!checked)}
                      className="border-gray-400"
                    />
                  </div>
                </TableHead>
                <TableHead className="text-gray-900 font-medium">
                  <div className="flex items-center gap-1">
                    ID Facture
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                          <Filter className="h-3 w-3 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <div className="p-2">
                          <Input
                            value={idFilter}
                            onChange={(e) => setIdFilter(e.target.value)}
                            placeholder="Filtrer par ID"
                            className="h-8 text-sm"
                          />
                          <div className="flex justify-end mt-2 ">
                            <Button size="sm" className="h-7 text-xs bg-black hover:bg-black" onClick={applyIdFilter}>
                              Appliquer
                            </Button>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead className="text-gray-900 font-medium">
                  <div className="flex items-center gap-1">
                    Date de facturation
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                          <Filter className="h-3 w-3 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-auto">
                        <div className="p-2">
                          <CalendarComponent
                            mode="range"
                            selected={{
                              from: dateFilter.start,
                              to: dateFilter.end,
                            }}
                            onSelect={(range) => {
                              setDateFilter({
                                start: range?.from,
                                end: range?.to,
                              })
                            }}
                            initialFocus
                          />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead className="text-gray-900 font-medium">
                  <div className="flex items-center gap-1">
                    Date d'échéance
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                          <Filter className="h-3 w-3 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-auto">
                        <div className="p-2">
                          <CalendarComponent
                            mode="range"
                            selected={{
                              from: dateFilter.start,
                              to: dateFilter.end,
                            }}
                            onSelect={(range) => {
                              setDateFilter({
                                start: range?.from,
                                end: range?.to,
                              })
                            }}
                            initialFocus
                          />
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead className="text-gray-900 font-medium">
                  <div className="flex items-center gap-1">
                    Taxes
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                          <Filter className="h-3 w-3 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <div className="p-2">
                          {uniqueTaxes.map((tax) => (
                            <DropdownMenuCheckboxItem
                              key={tax}
                              checked={taxesFilter.includes(tax)}
                              onCheckedChange={() => toggleTaxesFilter(tax)}
                            >
                              {tax}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead className="text-gray-900 font-medium">
                  <div className="flex items-center gap-1">
                    Statut
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                          <Filter className="h-3 w-3 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <div className="p-2">
                          {uniqueStatuses.map((status) => (
                            <DropdownMenuCheckboxItem
                              key={status}
                              checked={statusFilter.includes(status)}
                              onCheckedChange={() => toggleStatusFilter(status)}
                            >
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(status)}`}
                              ></span>
                              {status}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
                <TableHead className="text-gray-900 font-medium">
                  <div className="flex items-center justify-center">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevis.length > 0 ? (
                filteredDevis.map((devis, index) => (
                  <TableRow key={devis.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                    <TableCell className="py-4">
                      <Checkbox
                        checked={devis.selected}
                        onCheckedChange={() => toggleSelection(devis.id)}
                        className="border-gray-400"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{devis.id}</TableCell>
                    <TableCell>{devis.dateFacturation}</TableCell>
                    <TableCell>{devis.dateEcheance === "sans" ? devis.dateFacturation : devis.dateEcheance}</TableCell>
                    <TableCell>{devis.taxes}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(devis.statut)}`}>
                        {devis.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4 mr-6" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">Voir les détails</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Modifier</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 cursor-pointer">Archiver</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    Aucun devis ne correspond à vos critères de recherche
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default TabsDevis

