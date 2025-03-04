"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
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
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, SlidersHorizontal } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CirclePlus, LayoutGrid, Users, Building2 } from "lucide-react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getContactsByOrganisationId } from "../action/getContactsByOrganisationId"
import Link from "next/link"
import { Deletecontact } from "../action/Deletcontact" // Assuming Deletecontact is the delete action.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditContactModal } from "./EditContactModal"

// Helper function to extract the ID from the URL
const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listingorg\/([^/]+)\/contact/)
  return match ? match[1] : null
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

const ContactsTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [contactId, setContactId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false) // Loading state for fetching contacts
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [tagsFilter, setTagsFilter] = useState<string[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
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
        const fetchContacts = async () => {
          setIsLoading(true) // Set loading state to true before fetching
          try {
            const data = await getContactsByOrganisationId(id) // Assuming this returns data
            const formattedContacts = data.map((contact: any) => ({
              ...contact,
              link: contact.link || "", // Default empty link if it's missing
              tags: contact.tags || [], // Default empty array for tags if it's missing
            }))
            setContacts(formattedContacts)
          } catch (error) {
            console.error("Erreur lors de la récupération des contacts:", error)
          } finally {
            setIsLoading(false) // Set loading state to false after fetch
          }
        }

        fetchContacts()
      }
    }
  }, [isClient])
  // Fetch contacts when we are on the client and an ID is available
  useEffect(() => {
    if (isClient) {
      const url = window.location.href
      const id = extractIdFromUrl(url)
      setContactId(id)

      if (id) {
        const fetchContacts = async () => {
          setIsLoading(true) // Set loading state to true before fetching
          try {
            const data = await getContactsByOrganisationId(id) // Assuming this returns data
            const formattedContacts = data.map((contact: any) => ({
              ...contact,
              link: contact.link || "", // Default empty link if it's missing
              tags: contact.tags || [], // Default empty array for tags if it's missing
            }))
            setContacts(formattedContacts)
          } catch (error) {
            console.error("Erreur lors de la récupération des contacts:", error)
          } finally {
            setIsLoading(false) // Set loading state to false after fetch
          }
        }

        fetchContacts()
      }
    }
  }, [isClient])

  // Listen for contact creation events
  useEffect(() => {
    const handleContactCreated = async (event: CustomEvent) => {
      if (event.detail?.organisationId) {
        setIsLoading(true)
        try {
          const data = await getContactsByOrganisationId(event.detail.organisationId)
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
    }

    // Add event listener
    window.addEventListener("contactCreated", handleContactCreated as any)

    // Clean up
    return () => {
      window.removeEventListener("contactCreated", handleContactCreated as any)
    }
  }, [])

  // Define table columns
  const columns: ColumnDef<Contact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="ml-5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="ml-5 "
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
          <Link href={`/listingorg/${contactId}/contact/${row.original.id}`} className="hover:underline">
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
      accessorKey: "stage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stage = row.getValue("stage")
        const stageValue = typeof stage === "string" ? stage.toUpperCase() : stage

        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                stageValue === "WON" || stageValue === "Won"
                  ? "bg-green-500"
                  : stageValue === "LEAD" || stageValue === "Lead"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
              }`}
            />
            <span>{typeof stage === "string" ? stage : "Unknown"}</span>
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
          className="pl-0 font-bold"
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

        return filterValue.some((tag : string) => tagsArray.includes(tag))
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedContact(row.original)
                  setIsEditModalOpen(true)
                }}
              >
                Editer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteContact(contactId)}>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Function to delete a contact
  const deleteContact = async (contactId: string) => {
    try {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")
      if (confirmDelete) {
        setIsLoading(true) // Set loading state to true during delete
        // Make API request to delete contact
        await Deletecontact(contactId)

        // Update local state to remove the deleted contact
        setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId))

        alert("Le contact a été supprimé.")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error)
    } finally {
      setIsLoading(false) // Set loading state to false after delete
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
            .map((tag) => tag.trim())
            .filter(Boolean)
      allTags.push(...contactTags)
    })
    return Array.from(new Set(allTags)).filter(Boolean)
  }

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
    // Apply name filter
    if (searchQuery && table) {
      table.getColumn("name")?.setFilterValue(searchQuery)
    }

    // Apply stage filter
    if (stageFilter !== "all" && table) {
      table.getColumn("stage")?.setFilterValue(stageFilter)
    } else if (table) {
      table.getColumn("stage")?.setFilterValue("")
    }

    // Apply tags filter
    if (tagsFilter.length > 0 && table) {
      table.getColumn("tags")?.setFilterValue(tagsFilter)
    } else if (table) {
      table.getColumn("tags")?.setFilterValue("")
    }
  }, [searchQuery, stageFilter, tagsFilter, table])

  return (
    <div className="w-full">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Tabs defaultValue="all">
            <TabsList className="w-full justify-start rounded-none h-14 px-4 space-x-5 bg-transparent">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-b-2 py-4 gap-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
              >
                {" "}
                <LayoutGrid className="h-4 w-4" />
                Tous
              </TabsTrigger>
              <TabsTrigger
                value="people"
                className="data-[state=active]:border-b-2 py-4 gap-2 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
              >
                {" "}
                <Users className="h-4 w-4" />
                Personnes
              </TabsTrigger>
              <TabsTrigger
                value="companies"
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
                {getUniqueStages().map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter Button - Replace the existing Tags button */}
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
              {getUniqueTags().map((tag) => (
                <DropdownMenuItem key={tag} className="flex items-center gap-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={tagsFilter.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTagsFilter((prev) => [...prev, tag])
                      } else {
                        setTagsFilter((prev) => prev.filter((t) => t !== tag))
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

      {/* Table */}
      <div className="flex-1 overflow-auto border-t py-2 border-gray-200 ">
        <Table className="">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="">
            {isLoading ? (
              <TableRow className="">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="">
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

      {/* Pagination */}
      <div className="border-t border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rangée par page</span>
          <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue placeholder="50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Page 1 à 1</span>
          <div className="flex">
            <Button variant="outline" size="icon" className="rounded-r-none" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-l-none" disabled={currentPage === 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
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
    </div>
  )
}

export default ContactsTable
