"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  X,
  SlidersHorizontal,
  Plus,
  PenIcon as UserPen,
  Sparkles,
} from "lucide-react"
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
import { useRouter, usePathname } from "next/navigation"
import PaginationGlobal from "@/components/paginationGlobal"
import { selectionColumn } from "@/components/SelectionColumn"
import { toast } from "sonner"
import FactureAIGenerator from "@/app/agents/facture/component/ai-contact-facture-generator"
import FacureDetailsModal from "../ajout-facture/facture-details-modal"
import EditFactureModal from "../ajout-facture/edit-devis-modal"
import { DeleteFactureDialog } from "../ajout-facture/archive-facture-dialog"

interface Facture {
  id: string
  devisNumber: string
  creationDate: string
  dueDate: string | null
  taxAmount: number
  status: string
  selected?: boolean
}

const extractUrlParams = (path: string) => {
  const regex = /\/listing-organisation\/([^/]+)\/contact\/([^/]+)/
  const match = path.match(regex)

  if (!match) {
    console.error("URL format invalide:", path)
    return { organisationId: "", contactSlug: "" }
  }

  return {
    organisationId: match[1],
    contactSlug: match[2],
  }
}

const ALL_STATUSES = ["ATTENTE", "VALIDÉ", "FACTURE", "ARCHIVÉ"]
const ALL_TAXES = ["TVA", "Hors Taxe"]

const FactureTable = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { organisationId, contactSlug } = extractUrlParams(pathname)
  const [isSaving, setIsSaving] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [idFilter, setIdFilter] = useState("")
  const [taxesFilter, setTaxesFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({})
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFactureId, setSelectedFactureId] = useState("")

  const [data, setData] = useState<Facture[]>([])

  useEffect(() => {
    if (!organisationId || !contactSlug) {
      return;
    }

    fetch(`/api/facture?id=${contactSlug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((apiData) => {
        const formattedData = apiData.map((item: any) => ({
          id: item.id,
          devisNumber: item.devisNumber,
          creationDate: new Date(item.creationDate).toLocaleDateString("fr-FR"),
          dueDate: item.dueDate ? new Date(item.dueDate).toLocaleDateString("fr-FR") : "sans",
          taxAmount: item.taxAmount,
          status: item.status || "FACTURE"
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, [organisationId, contactSlug, pathname]);

  const handleStatusChange = (factureId: string, newStatus: string) => {
    setData(data.map(facture => 
      facture.id === factureId 
        ? { ...facture, status: newStatus } 
        : facture
    ))
    
    toast.success("Statut de la facture mis à jour", {
      position: "bottom-right",
      duration: 3000,
    })
  }

  const filteredData = data.filter((facture) => {
    const matchesSearch = searchTerm === "" || 
      facture.devisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facture.taxAmount.toString().includes(searchTerm)

    const matchesId = idFilter === "" || facture.devisNumber.includes(idFilter)

    const matchesTaxes = taxesFilter.length === 0 || 
      (taxesFilter.includes("TVA") && facture.taxAmount > 0) ||
      (taxesFilter.includes("Hors Taxe") && facture.taxAmount === 0)

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(facture.status)

    const matchesDate = !dateFilter.start || (
      new Date(facture.creationDate.split('/').reverse().join('-')) >= new Date(dateFilter.start) &&
      (!dateFilter.end || new Date(facture.creationDate.split('/').reverse().join('-')) <= new Date(dateFilter.end))
    )

    return matchesSearch && matchesId && matchesTaxes && matchesStatus && matchesDate
  })

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

  const handleBulkDelete = (ids: string[]) => {
    setData(data.filter((item) => !ids.includes(item.id)))
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "VALIDÉ":
        return "bg-amber-100 text-amber-800"
      case "FACTURE":
        return "bg-green-100 text-green-800"
      case "ATTENTE":
        return "bg-pink-200 text-pink-800"
      case "ARCHIVÉ":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddFacture = (type: "manual" | "ai") => {
    if (!organisationId || !contactSlug) {
      toast.error(
        `Paramètres manquants:
        Organisation: ${organisationId || "Non trouvé"}
        Contact: ${contactSlug || "Non trouvé"}`,
        { position: "bottom-right" },
      )
      return
    }

    if (type === "manual") {
      router.push(`/listing-organisation/${organisationId}/contact/${contactSlug}/ajout-facture`)
    } else {
      setIsAIGeneratorOpen(true)
    }
  }

  const handleSaveNewFacture = (factureData: any) => {
    const newId = `HT${Math.floor(1000 + Math.random() * 9000)}${new Date().getFullYear().toString().slice(-2)}`

    const newFacture: Facture = {
      id: `cmbs${Math.random().toString(36).substring(2, 15)}`,
      devisNumber: newId,
      creationDate: new Date().toLocaleDateString("fr-FR"),
      dueDate: factureData.dueDate ? new Date(factureData.dueDate).toLocaleDateString("fr-FR") : "sans",
      taxAmount: factureData.products.some((p: any) => p.tax > 0) ? 20000 : 0,
      status: "ATTENTE",
    }

    setData((prev) => [...prev, newFacture])
    setIsAIGeneratorOpen(false)
  }

  const handleViewDetails = (factureId: string) => {
    setSelectedFactureId(factureId)
    setIsDetailsModalOpen(true)
  }

  const handleEditFacture = (factureId: string) => {
    if (!organisationId || !contactSlug) {
      toast.error("Impossible de modifier - paramètres d'URL manquants", { position: "bottom-right" })
      return
    }

    setSelectedFactureId(factureId)
    setIsEditModalOpen(true)
  }

  const handleUpdateFacture = (updatedData: any) => {
    setData(
      data.map((facture) =>
        facture.id === updatedData.id
          ? {
              id: updatedData.id,
              devisNumber: updatedData.devisNumber,
              creationDate: updatedData.creationDate
                ? new Date(updatedData.creationDate).toLocaleDateString("fr-FR")
                : facture.creationDate,
              dueDate: updatedData.dueDate ? new Date(updatedData.dueDate).toLocaleDateString("fr-FR") : "sans",
              taxAmount: updatedData.taxAmount || 0,
              status: facture.status,
            }
          : facture,
      ),
    )

    toast.success("Facture mis à jour avec succès", {
      position: "bottom-right",
      duration: 3000,
    })
  }

  const handleDeleteFacture = (factureId: string) => {
    setSelectedFactureId(factureId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteFacture = () => {
    setData(data.filter((facture) => facture.id !== selectedFactureId))
    setIsDeleteDialogOpen(false)

    toast.success("Facture supprimée avec succès", {
      position: "bottom-right",
      duration: 3000,
    })
  }

  const addFilter = (type: string, value: string) => {
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters([...activeFilters, `${type}:${value}`])
    }
    setCurrentPage(1)
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
    const [type, value] = filter.split(":")
    if (type === "taxes") setTaxesFilter(taxesFilter.filter((t) => t !== value))
    else if (type === "statut") setStatusFilter(statusFilter.filter((s) => s !== value))
    else if (type === "id") setIdFilter("")
    else if (type === "date") setDateFilter({})
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setIdFilter("")
    setTaxesFilter([])
    setStatusFilter([])
    setDateFilter({})
    setCurrentPage(1)
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
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("id:")))
      addFilter("id", idFilter)
    }
  }

  const columns: ColumnDef<Facture>[] = [
    selectionColumn<Facture>({ onBulkDelete: handleBulkDelete }),
    {
      accessorKey: "devisNumber",
      header: () => (
        <div className="flex items-center gap-1">
          Numéro de devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="p-2">
                <Input
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                  placeholder="Filtrer par numéro"
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={applyIdFilter}
                >
                  Appliquer
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("devisNumber")}</div>,
    },
    {
      accessorKey: "creationDate",
      header: () => (
        <div className="flex items-center gap-1">
          Date de création
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
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
                    if (range?.from) {
                      setDateFilter({
                        start: range.from,
                        end: range.to
                      })
                      addFilter('date', `${range.from.toISOString()}${range.to ? `-${range.to.toISOString()}` : ''}`)
                    } else {
                      setDateFilter({})
                      removeFilter('date')
                    }
                  }}
                  initialFocus
                />
                {dateFilter.start && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full mt-2"
                    onClick={() => {
                      setDateFilter({})
                      removeFilter('date')
                    }}
                  >
                    Effacer
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Date d'échéance",
      cell: ({ row }) => {
        const dueDate = row.getValue<string>("dueDate")
        return dueDate === "sans" ? "Non spécifiée" : dueDate
      },
    },
    {
      accessorKey: "taxAmount",
      header: "Montant des taxes",
      cell: ({ row }) => {
        const amount = row.getValue<number>("taxAmount")
        return `${amount.toLocaleString()} xfa`
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-1">
          Statut
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue<string>("status")
        const factureId = row.original.id
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(status)} cursor-pointer hover:opacity-80 transition-opacity`}>
                {status}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="shadow-lg">
              {ALL_STATUSES.map((newStatus) => (
                <DropdownMenuItem
                  key={newStatus}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${status === newStatus ? "bg-gray-100" : ""}`}
                  onClick={() => handleStatusChange(factureId, newStatus)}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(newStatus)}`}></span>
                  {newStatus}
                  {status === newStatus && <span className="ml-2 text-xs text-gray-500">(actuel)</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      id: "actions",
      header: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors">
          <SlidersHorizontal className="h-4 w-4 ml-20" />
          <span className="sr-only">Filter</span>
        </Button>
      ),
      cell: ({ row }) => {
        const factureId = row.original.id
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors">
                  <MoreHorizontal className="h-4 w-4 mr-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="shadow-lg">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewDetails(factureId)}
                >
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleEditFacture(factureId)}
                >
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteFacture(factureId)}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: rowsPerPage,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage - 1,
          pageSize: rowsPerPage,
        })
        setCurrentPage(newState.pageIndex + 1)
        setRowsPerPage(newState.pageSize)
      }
    },
  })

  const totalItems = table.getFilteredRowModel().rows.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  return (
    <div className="relative pb-16">
      {(!organisationId || !contactSlug) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 animate-fade-in">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Attention: Problème de détection des paramètres dans l'URL
                <br />
                Format attendu: /listing-organisation/[id]/contact/[slug]
                <br />
                URL actuelle: {pathname}
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="facture">
        <TabsContent value="facture" className="p-0">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-2 flex-1">
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
                    placeholder="Rechercher une facture"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-10 bg-[#e6e7eb] border-gray-300 focus:ring-2 focus:ring-red-500/50 transition-all"
                  />
                </div>

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
                      <p className="text-sm font-medium mb-2">Numéro de devis</p>
                      <div className="flex gap-2">
                        <Input
                          value={idFilter}
                          onChange={(e) => setIdFilter(e.target.value)}
                          placeholder="Filtrer par numéro"
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
                      <p className="text-sm font-medium mb-2">Date de création</p>
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
                                  end: range.to
                                })
                                addFilter('date', `${range.from.toISOString()}${range.to ? `-${range.to.toISOString()}` : ''}`)
                              } else {
                                setDateFilter({})
                                removeFilter('date')
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4" /> Ajouter une facture
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[185px] shadow-xl">
                  <DropdownMenuItem
                    onClick={() => handleAddFacture("manual")}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <UserPen className="h-4 w-4 mr-2" />
                    <span>Manuellement</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddFacture("ai")}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Via IA</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center animate-fade-in">
                <span className="text-sm text-gray-500 flex items-center">
                  <SlidersHorizontal className="h-3 w-3 mr-1" /> Filtres actifs:
                </span>
                {activeFilters.map((filter) => {
                  const [type, value] = filter.split(":")
                  return (
                    <Badge
                      key={filter}
                      variant="outline"
                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-xs">
                        {type === "taxes" ? "Taxes: " : 
                         type === "statut" ? "Statut: " : 
                         type === "id" ? "Numéro: " : 
                         type === "date" ? "Date: " : ""}
                        {type === "date" ? 
                          `${new Date(value.split('-')[0]).toLocaleDateString()}${value.includes('-') ? ` - ${new Date(value.split('-')[1]).toLocaleDateString()}` : ''}` : 
                          value}
                      </span>
                      <button
                        onClick={() => removeFilter(filter)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={clearAllFilters}
                >
                  Effacer tout
                </Button>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Table>
              <TableHeader className="bg-[#e6e7eb]">
                <TableRow className="border-b border-gray-300">
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-gray-900 font-medium">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                      Aucune facture ne correspond à vos critères de recherche
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />

      <FactureAIGenerator
        open={isAIGeneratorOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAIGeneratorOpen(false)
          } else {
            setIsAIGeneratorOpen(true)
          }
        }}
        organisationId={organisationId}
        contactSlug={contactSlug}
        onSaveFacture={handleSaveNewFacture}
      />

      <FacureDetailsModal open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} factureId={selectedFactureId} />

      <EditFactureModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        factureId={selectedFactureId}
        organisationId={organisationId}
        contactSlug={contactSlug}
        onSaveFacture={handleUpdateFacture}
      />

      <DeleteFactureDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteFacture}
        factureId={selectedFactureId}
      />
    </div>
  )
}

export default FactureTable