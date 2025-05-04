"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import { type Devis, getStatusClass } from "./devis-interface";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Définition des constantes pour les statuts et taxes
export const ALL_STATUSES = ["Validé", "Facturé", "ATTENTE", "Annulé"] as const;
export const ALL_TAXES = ["TVA 20%", "TVA 10%", "TVA 5.5%", "Exonéré"] as const;

interface DevisTableColumnsProps {
  handleBulkDelete: (ids: string[]) => void;
  handleViewDetails: (devisId: string) => void;
  handleEditDevis: (devisId: string) => void;
  handleDeleteDevis: (devisId: string) => void;
  // dateFilter: DateRange | undefined
  // setDateFilter: (value: DateRange | undefined) => void
  addFilter: (type: string, value: string) => void;
  removeFilter: (filter: string) => void;
  taxesFilter: string[];
  toggleTaxesFilter: (tax: string) => void;
  statusFilter: string[];
  toggleStatusFilter: (status: string) => void;
  ALL_TAXES: readonly string[]; // Add this line
}

export const getDevisTableColumns = ({

  handleViewDetails,
  handleEditDevis,
  handleDeleteDevis,
  // dateFilter,
  // setDateFilter,
  addFilter,
  removeFilter,
  taxesFilter,
  toggleTaxesFilter,
  statusFilter,
  toggleStatusFilter,
}: DevisTableColumnsProps): ColumnDef<Devis>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "devisNumber",
      header: () => (
        <div className="flex items-center gap-1">
          ID Devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filtrer par ID</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1">
                <input
                  type="text"
                  placeholder="Rechercher ID..."
                  onChange={(e) => addFilter("id", e.target.value)}
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.devisNumber || "-"}</div>
      ),
    },
    {
      accessorKey: "createdAt", // Replace with the correct field name in your model, like "creationDate"
      header: () => (
        <div className="flex items-center gap-1">
          Date de création
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filtrer par date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Filter UI for date can be added here */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        const creationDate = row.original.creationDate; // Assuming it's stored as createdAt
        return (
          <div>
            {creationDate
              ? format(new Date(creationDate), "PP", { locale: fr })
              : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: () => (
        <div className="flex items-center gap-1">
          Montant total
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filtrer par montant</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 space-y-2">
                <input
                  type="number"
                  placeholder="Montant minimum"
                  onChange={(e) => addFilter("minAmount", e.target.value)}
                  className="w-full p-1 text-sm border rounded"
                />
                <input
                  type="number"
                  placeholder="Montant maximum"
                  onChange={(e) => addFilter("maxAmount", e.target.value)}
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div>
          {(row.original.totalAmount ?? 0).toLocaleString("fr-FR")} FCFA
        </div>
      ),
    },
    {
      accessorKey: "totalWithTax",
      header: () => (
        <div className="flex items-center gap-1">
          Total avec taxe
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filtrer par total</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1 space-y-2">
                <input
                  type="number"
                  placeholder="Total minimum"
                  onChange={(e) => addFilter("minTotal", e.target.value)}
                  className="w-full p-1 text-sm border rounded"
                />
                <input
                  type="number"
                  placeholder="Total maximum"
                  onChange={(e) => addFilter("maxTotal", e.target.value)}
                  className="w-full p-1 text-sm border rounded"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div>
          {(row.original.totalWithTax ?? 0).toLocaleString("fr-FR")} %
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-1">
          Statut
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ALL_STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => toggleStatusFilter(status)}
                >
                  <Checkbox
                    checked={statusFilter.includes(status)}
                    className="mr-2"
                  />
                  {status}
                </DropdownMenuItem>
              ))}
              {statusFilter.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      ALL_STATUSES.forEach(
                        (status) =>
                          statusFilter.includes(status) &&
                          toggleStatusFilter(status)
                      )
                    }
                    className="text-red-500"
                  >
                    Effacer les filtres
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status || "Inconnu";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(status)}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <SlidersHorizontal className="h-4 w-4 ml-20" />
          <span className="sr-only">Filter</span>
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 mr-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(row.original.id)}
                >
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleEditDevis(row.original.id)}
                >
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDeleteDevis(row.original.id)}
                >
                  Archiver
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
