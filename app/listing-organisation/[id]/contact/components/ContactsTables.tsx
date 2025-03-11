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
import { useEffect, useState } from "react"
import Chargement from "@/components/Chargement"
import { toast } from "sonner"

import { ContactsTableColumns } from "./ContactsTableColumnsProps"
import { ContactsTableFilters } from "./ContactsTableFiltersProps"
import { ContactsTablePagination } from "./ContactsTablePagination"
import { DeleteContactDialog } from "./DeleteContactDialog"
import { EditContactModal } from "./EditContactModal"
import { DeleteContact } from "../action/deleteContact"

// Ajouter cette déclaration au début du fichier, juste après les imports
declare global {
  interface Window {
    createdContact: any
  }
}

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

// Interface pour le contact mis à jour qui peut avoir des champs optionnels
interface UpdatedContact {
  id: string
  name: string
  logo?: string
  icon?: string | React.JSX.Element
  email: string
  phone: string
  link: string
  stage: string
  adresse?: string
  record?: string
  tags: string
  status_contact: string
}

interface ContactsTableWithServerDataProps {
  initialContacts: Contact[]
  organisationId: string
}

const ContactsTables = ({ initialContacts, organisationId }: ContactsTableWithServerDataProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
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

  // Fonction pour extraire l'ID de l'URL
  const getOrganisationIdFromUrl = () => {
    const urlPath = window.location.pathname
    const regex = /\/listing-organisation\/([a-zA-Z0-9_-]+)\/contact/
    const match = urlPath.match(regex)

    return match ? match[1] : null
  }

  // Récupérer les contacts à partir de l'ID d'organisation
  const fetchContacts = async (organisationId: string) => {
    setIsLoading(true)
    try {
      const data = await fetch(`/api/getContactsByOrganisationId?organisationId=${organisationId}`)
      const formattedContacts = await data.json()
      console.log("Données des contacts : ", formattedContacts)
      setContacts(formattedContacts)
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Effet pour récupérer l'ID d'organisation de l'URL et charger les contacts
  useEffect(() => {
    const organisationId = getOrganisationIdFromUrl()
    const fetchData = async () => {
      if (organisationId) {
        await fetchContacts(organisationId)
      }
    }

    fetchData()
  }, []) // L'effet se déclenche une fois au montage du composant

  // Remplacer l'effet qui écoute les événements par celui-ci:
  useEffect(() => {
    const handleNewContactAdded = () => {
      if (window.createdContact) {
        // Formater le contact si nécessaire pour correspondre à la structure attendue
        const newContact = {
          id: window.createdContact.id,
          name: window.createdContact.name,
          email: window.createdContact.email,
          phone: window.createdContact.phone || "",
          stage: window.createdContact.stage || "LEAD",
          tags: window.createdContact.tags || "",
          logo: window.createdContact.logo,
          adresse: window.createdContact.adresse,
          record: window.createdContact.record,
          status_contact: window.createdContact.status_contact,
          link: `/contacts/${window.createdContact.id}`,
        }

        // Ajouter le contact au début de la liste
        setContacts((prevContacts) => [newContact, ...prevContacts])

        // Réinitialiser la variable globale
        window.createdContact = null

        // Afficher une notification
        toast.success("Contact ajouté avec succès!")
      }
    }

    // Écouter l'événement personnalisé
    window.addEventListener("newContactAdded", handleNewContactAdded)

    return () => {
      window.removeEventListener("newContactAdded", handleNewContactAdded)
    }
  }, [])

  const deleteContact = async (contactId: string) => {
    try {
      setIsLoading(true)
      await DeleteContact(contactId)
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId))
      toast.success("Le contact a été supprimé avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error)
      toast.error("Erreur lors de la suppression du contact")
    } finally {
      setIsLoading(false)
    }
  }

  // Extraire les étapes uniques et les tags des contacts
  const getUniqueStages = () => {
    // Vérifier si contacts est un tableau avant de l'itérer
    const stages = Array.isArray(contacts) ? contacts.map((contact) => contact.stage) : []
    return Array.from(new Set(stages)).filter(Boolean)
  }

  const getUniqueTags = () => {
    const allTags: string[] = []

    // Vérifier si contacts est un tableau avant de l'itérer
    if (Array.isArray(contacts)) {
      contacts.forEach((contact) => {
        const contactTags = Array.isArray(contact.tags)
          ? contact.tags
          : contact.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean)
        allTags.push(...contactTags)
      })
    }

    return Array.from(new Set(allTags)).filter(Boolean)
  }

  const columns = ContactsTableColumns({
    contactId: organisationId,
    onEdit: (contact) => {
      setSelectedContact(contact as Contact)
      setIsEditModalOpen(true)
    },
    onDelete: (id) => {
      setContactToDelete(id)
      setIsDeleteDialogOpen(true)
    },
    onBulkDelete: (ids) => {
      // Implement bulk delete functionality here
      // For example:
      ids.forEach((id) => deleteContact(id))
      toast.success(`${ids.length} contacts ont été supprimés avec succès`)
    },
  })

  // Initialiser la table
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

  // Appliquer les filtres lorsque ces derniers changent
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
            ) : table.getRowModel() && table.getRowModel().rows && Array.isArray(table.getRowModel().rows) ? (
              table.getRowModel().rows.length > 0 ? (
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
              )
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
          onSuccess={(updatedContact: UpdatedContact) => {
            // Compléter les champs manquants avec les valeurs existantes
            const completeContact: Contact = {
              ...selectedContact,
              name: updatedContact.name,
              email: updatedContact.email,
              phone: updatedContact.phone,
              stage: updatedContact.stage,
              tags: updatedContact.tags,
              adresse: updatedContact.adresse || selectedContact.adresse,
              record: updatedContact.record || selectedContact.record,
              logo: updatedContact.logo || selectedContact.logo,
              status_contact: updatedContact.status_contact,
              link: updatedContact.link || selectedContact.link,
            }

            // Mettre à jour le contact dans l'état local sans refetch
            setContacts((prevContacts) =>
              prevContacts.map((contact) => (contact.id === completeContact.id ? completeContact : contact)),
            )

            toast.success("Contact mis à jour avec succès!")
            setIsEditModalOpen(false)
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

export default ContactsTables

