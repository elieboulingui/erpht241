
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CirclePlus, LayoutGrid, Users, Building2 } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { getContactsByOrganisationId } from "../action/getContactsByOrganisationId";
import Link from "next/link";
import { Deletecontact } from "../action/Deletcontact"; // Assuming Deletecontact is the delete action.

// Helper function to extract the ID from the URL
const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listingorg\/([^\/]+)\/contact/);
  return match ? match[1] : null;
};

interface Contact {
  id: string;
  name: string;
  logo?: string;
  icon?: string | React.JSX.Element;
  email: string;
  phone: string;
  link: string;
  stage: "Won" | "Lead" | "Qualified";
  tags: string[];
}

const ContactsTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [contactId, setContactId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching contacts

  const router = useRouter();

  
  useEffect(() => {
    setIsClient(true);
  }, []);
   useEffect(() => {
    if (isClient) {
      const url = window.location.href;
      const id = extractIdFromUrl(url);
      setContactId(id);

      if (id) {
        const fetchContacts = async () => {
          setIsLoading(true); // Set loading state to true before fetching
          try {
            const data = await getContactsByOrganisationId(id); // Assuming this returns data
            const formattedContacts = data.map((contact: any) => ({
              ...contact,
              link: contact.link || "", // Default empty link if it's missing
              tags: contact.tags || [], // Default empty array for tags if it's missing
            }));
            setContacts(formattedContacts);
          } catch (error) {
            console.error("Erreur lors de la récupération des contacts:", error);
          } finally {
            setIsLoading(false); // Set loading state to false after fetch
          }
        };

        fetchContacts();
      }
    }
  }, [isClient]);
  // Fetch contacts when we are on the client and an ID is available
  useEffect(() => {
    if (isClient) {
      const url = window.location.href;
      const id = extractIdFromUrl(url);
      setContactId(id);

      if (id) {
        const fetchContacts = async () => {
          setIsLoading(true); // Set loading state to true before fetching
          try {
            const data = await getContactsByOrganisationId(id); // Assuming this returns data
            const formattedContacts = data.map((contact: any) => ({
              ...contact,
              link: contact.link || "", // Default empty link if it's missing
              tags: contact.tags || [], // Default empty array for tags if it's missing
            }));
            setContacts(formattedContacts);
          } catch (error) {
            console.error("Erreur lors de la récupération des contacts:", error);
          } finally {
            setIsLoading(false); // Set loading state to false after fetch
          }
        };

        fetchContacts();
      }
    }
  }, [isClient]);

  // Define table columns
  const columns: ColumnDef<Contact>[] = [
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
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
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
                width={32}
                height={32}
                className="object-contain h-5 w-5"
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stage = row.getValue("stage");
        return (
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                stage === "Won"
                  ? "bg-green-500"
                  : stage === "Lead"
                  ? "bg-blue-500"
                  : "bg-yellow-500"
              }`}
            />
            <span>{stage as string}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tags
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.original.tags || []).map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-sm bg-gray-100 hover:bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
      ),
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
        const contactId = row.original.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem >Editer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteContact(contactId)}>Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Function to delete a contact
  const deleteContact = async (contactId: string) => {
    try {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?");
      if (confirmDelete) {
        setIsLoading(true); // Set loading state to true during delete
        // Make API request to delete contact
        await Deletecontact(contactId);

        // Update local state to remove the deleted contact
        setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));

        alert("Le contact a été supprimé.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after delete
    }
  };

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
  });

  return (
    <div className="w-full">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-5">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all">
            <TabsList className="bg-white">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Tous
              </TabsTrigger>
              <TabsTrigger value="people" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personnes
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Compagnies
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button value="default" className="flex items-center gap-2 bg-transparent hover:bg-transparent text-black border border-gray-200">
            <CirclePlus className="h-4 w-4" />
            Tags
          </Button>
        </div>

        <div className="relative w-full md:w-60">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par nom etc" className="pl-8" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border mt-6 px-5">
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
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">range par page</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lt;
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactsTable;
