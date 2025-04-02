"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Filter, MoreHorizontal, SlidersHorizontal } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { selectionColumn } from "@/components/SelectionColumn"
import { type Devis, ALL_STATUSES, getStatusClass } from "./devis-interface"

export function getDevisTableColumns({
  handleBulkDelete,
  handleStatusChange,
  handleViewDetails,
  handleEditDevis,
  handleDeleteDevis,
  dateFilter,
  setDateFilter,
  addFilter,
  removeFilter,
  taxesFilter,
  toggleTaxesFilter,
  statusFilter,
  toggleStatusFilter,
  ALL_TAXES,
}: any): ColumnDef<Devis>[] {
  return [
    selectionColumn<Devis>({ onBulkDelete: handleBulkDelete }),
    {
      accessorKey: "id",
      header: () => (
        <div className="flex items-center gap-1">
          ID Devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "dateFacturation",
      header: () => (
        <div className="flex items-center gap-1">
          Date de facturation
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
                {dateFilter.start && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => {
                      setDateFilter({})
                      removeFilter("date")
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
      accessorKey: "dateEcheance",
      header: () => (
        <div className="flex items-center gap-1">
          Date d'échéance
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
                {dateFilter.start && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => {
                      setDateFilter({})
                      removeFilter("date")
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
      cell: ({ row }) => {
        const dateEcheance = row.getValue<string>("dateEcheance")
        return dateEcheance === "sans" ? row.getValue<string>("dateFacturation") : dateEcheance
      },
    },
    {
      accessorKey: "taxes",
      header: () => (
        <div className="flex items-center gap-1">
          Taxes
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {ALL_TAXES.map((tax:any) => (
                <DropdownMenuCheckboxItem
                  key={tax}
                  checked={taxesFilter.includes(tax)}
                  onCheckedChange={() => toggleTaxesFilter(tax)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {tax}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      accessorKey: "statut",
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
        const status = row.getValue<string>("statut")
        const devisId = row.original.id

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                  status,
                )} cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {status}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="shadow-lg">
              {ALL_STATUSES.map((newStatus) => (
                <DropdownMenuItem
                  key={newStatus}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    status === newStatus ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleStatusChange(devisId, newStatus)}
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
        const devisId = row.original.id
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
                  onClick={() => handleViewDetails(devisId)}
                >
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleEditDevis(devisId)}
                >
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteDevis(devisId)}
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
}

