"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getContactsByOrganisationId } from "../action/getContactsByOrganisationId"
import { useEffect, useState } from "react"
import Chargement from "@/components/Chargement"
import { toast } from "sonner"
import { Deletecontact } from "../action/Deletcontact"

import { extractIdFromUrl } from "@/lib/utils"
import { ContactPrincipal } from "@/contactPrincipal"
import { ContactsTableColumns } from "./ContactsTableColumnsProps"
import { ContactsTableFilters } from "./ContactsTableFiltersProps"
import { ContactsTablePagination } from "./ContactsTablePagination"
import { DeleteContactDialog } from "./DeleteContactDialog"
import { EditContactModal } from "./EditContactModal"


interface Contact {
  id: string
  name: string
  logo?: string
  icon?: string | React.JSX.Element
  email: string
  phone: string
  link: string
  stage: "Won" | "Lead" | "Qualified" | string
  adresse: string
  record: string
  tags: string
  status_contact: string
}

const ContactsTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [contactId, setContactId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [tagsFilter, setTagsFilter] = useState<string[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const url = window.location.href
      const id = extractIdFromUrl(url)
      setContactId(id)

      if (id) {
        fetchContacts(id)
      }
    }
  }, [isClient])

  // Listen for contact creation events
  useEffect(() => {
    const handleContactCreated = async (event: CustomEvent) => {
      if (event.detail?.organisationId) {
        fetchContacts(event.detail.organisationId)
      }
    }

    window.addEventListener("contactCreated", handleContactCreated as any)
    return () => {
      window.removeEventListener("contactCreated", handleContactCreated as any)
    }
  }, [])

  const fetchContacts = async (id: string) => {
    setIsLoading(true)
    try {
      const data = await getContactsByOrganisationId(id)
      const formattedContacts = data.map((contact: any) => ({
        ...contact,
        link: contact.link || "",
        tags: contact.tags || [],
      }))
      setContacts(formattedContacts)
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteContact = async (contactId: string) => {
    try {
      setIsLoading(true)
      await Deletecontact(contactId)
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId))
      toast.success("Le contact a été supprimé avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error)
      toast.error("Erreur lors de la suppression du contact")
    } finally {
      setIsLoading(false)
    }
  }

  // Extract unique stages and tags from contacts
  const getUniqueStages = () => {
    const stages = contacts.map((contact) => contact.stage)
    return Array.from(new Set(stages)).filter(Boolean)
  }

  const getUniqueTags = () => {
    const allTags: string[] = []
    contacts.forEach((contact) => {
      const contactTags = Array.isArray(contact.tags)
        ? contact.tags
        : contact.tags
            .split(",")
            .map((tag : string) => tag.trim())
            .filter(Boolean)
      allTags.push(...contactTags)
    })
    return Array.from(new Set(allTags)).filter(Boolean)
  }

  const columns = ContactsTableColumns({
    contactId,
    onEdit: (contact) => {
      setSelectedContact(contact as Contact)
      setIsEditModalOpen(true)
    },
    onDelete: (id) => {
      setContactToDelete(id)
      setIsDeleteDialogOpen(true)
    },
  })

  // Initialize table
  const table = useReactTable({
    data: contacts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Apply filters when they change
  useEffect(() => {
    if (searchQuery && table) {
      table.getColumn("name")?.setFilterValue(searchQuery)
    }

    if (stageFilter !== "all" && table) {
      table.getColumn("stage")?.setFilterValue(stageFilter)
    } else if (table) {
      table.getColumn("stage")?.setFilterValue("")
    }

    if (tagsFilter.length > 0 && table) {
      table.getColumn("tags")?.setFilterValue(tagsFilter)
    } else if (table) {
      table.getColumn("tags")?.setFilterValue("")
    }
  }, [searchQuery, stageFilter, tagsFilter, table])

  return (
    <div className="w-full">
      <ContactsTableFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        tagsFilter={tagsFilter}
        setTagsFilter={setTagsFilter}
        uniqueStages={getUniqueStages()}
        uniqueTags={getUniqueTags()}
        table={table}
      />

      {/* Table */}
      <div className="flex-1 overflow-auto border-t py-2 border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Chargement />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun contact trouvé. Utilisez le bouton "Ajouter un contact" pour créer un nouveau contact.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ContactsTablePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />

      {selectedContact && (
            <EditContactModal
              contact={selectedContact}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={() => {
                // Rafraîchir les contacts après la mise à jour
                if (contactId) {
                  setIsLoading(true)
                  getContactsByOrganisationId(contactId)
                    .then((data) => {
                      const formattedContacts = data.map((contact: any) => ({
                        ...contact,
                        link: contact.link || "",
                        tags: contact.tags || [],
                      }))
                      setContacts(formattedContacts)
                    })
                    .catch((error) => {
                      console.error("Erreur lors de la récupération des contacts:", error)
                    })
                    .finally(() => {
                      setIsLoading(false)
                    })
                }
              }}
            />
          )}

      <DeleteContactDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (contactToDelete) {
            deleteContact(contactToDelete)
            setIsDeleteDialogOpen(false)
          }
        }}
      />
    </div>
  )
}

export default ContactsTable

