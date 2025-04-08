"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { ContactPrincipal } from "@/contactPrincipal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { selectionColumn } from "@/components/SelectionColumn"

interface ContactsTableColumnsProps {
  contactId: string | null
  onEdit: (contact: ContactPrincipal) => void
  onDelete: (id: string) => void
  onBulkDelete: (ids: string[]) => void
}

export const ContactsTableColumns = ({
  contactId,
  onEdit,
  onDelete,
  onBulkDelete,
}: ContactsTableColumnsProps): ColumnDef<ContactPrincipal>[] => [
    selectionColumn<ContactPrincipal>({ onBulkDelete }),
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="rounded overflow-hidden">
            {row.original.logo ? (
              <img
                src={row.original.logo || "/placeholder.svg"}
                alt={`${row.original.name} logo`}
                width={100}
                height={100}
                className="object-contain h-8 w-8"
              />
            ) : (
              row.original.icon
            )}
          </div>
          <Link href={`/listing-organisation/${contactId}/contact/${row.original.id}`} className="hover:underline">
            {row.original.name}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "sector",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Secteur
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Téléphone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "niveau",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Niveau
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const niveau = row.getValue("niveau")
        const stageValue = typeof niveau === "string" ? niveau.toUpperCase() : niveau

        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${stageValue === "CLIENT" || stageValue === "Client"
                  ? "bg-green-500"
                  : stageValue === "PROSPECT" || stageValue === "Prospect"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
            />
            <span>{typeof niveau === "string" ? niveau : "Unknown"}</span>
          </div>
        )
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true
        const rowValue = row.getValue(id)
        return rowValue === filterValue
      },
    },
    {
      accessorKey: "tags",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tags
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const tags = row.original.tags || []
        const tagsArray = Array.isArray(tags)
          ? tags
          : tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)

        return (
          <div className="flex flex-wrap gap-1">
            {tagsArray.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-sm bg-gray-100 hover:bg-gray-100">
                {tag}
              </Badge>
            ))}
          </div>
        )
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true

        const rowTags = row.original.tags || []
        const tagsArray = Array.isArray(rowTags)
          ? rowTags
          : rowTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)

        return filterValue.some((tag: string) => tagsArray.includes(tag))
      },
    },
    {
      id: "actions",
      header: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      ),
      cell: ({ row }) => {
        const contactId = row.original.id
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>Editer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(contactId)}>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]