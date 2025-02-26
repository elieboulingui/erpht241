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
import { SiAdobe } from "react-icons/si";
import { TbBrandAirbnb } from "react-icons/tb";
import Link from "next/link";
import { Users, Building2, CirclePlus, LayoutGrid } from "lucide-react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

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

const contacts: Contact[] = [
  {
    id: "1",
    name: "Adobe",
    link: "https://www.adobe.com",
    icon: <SiAdobe className="text-white p-1 rounded-lg bg-red-600 h-5 w-5" />,
    email: "contact@adobe.com",
    phone: "+1 408-536-6000",
    stage: "Won",
    tags: ["Software", "Technology", "Creativity"],
  },
  {
    id: "2",
    name: "Airbnb",
    link: "https://www.airbnb.com",
    icon: (
      <TbBrandAirbnb className="text-white p-1 rounded-lg bg-rose-500 h-5 w-5" />
    ),
    email: "press@airbnb.com",
    phone: "+1 415-800-5959",
    stage: "Lead",
    tags: ["Internet", "B2C", "Web Services & Apps"],
  },
  {
    id: "3",
    name: "Amazon",
    link: "https://www.amazon.com",
    logo: "/amazon-paie (1).png",
    email: "contact@amazon.com",
    phone: "+1 206-266-1000",
    stage: "Lead",
    tags: ["Technology", "E-commerce", "Cloud Computing"],
  },
];

export default function ContactsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [contactId, setContactId] = useState<string | null>(null); // State pour stocker l'ID
  const [isClient, setIsClient] = useState(false); // Etat pour vérifier si nous sommes en environnement client
  const router = useRouter(); // Utilisation de useRouter de Next.js 14

  // Vérifier si nous sommes en environnement client (côté navigateur)
  React.useEffect(() => {
    setIsClient(true); // Mettre à jour l'état quand le composant est monté côté client
  }, []);

  // Utiliser useEffect uniquement quand nous sommes côté client
  useEffect(() => {
    if (isClient) {
      // Récupérer l'ID directement depuis l'URL
      const regex = /listingorg\/([a-zA-Z0-9]+)/; // Expression régulière pour récupérer l'ID
      const match = window.location.href.match(regex); // Utiliser window.location.href pour l'URL complète
      if (match) {
        setContactId(match[1]); // Stocker l'ID dans le state
      }
    }
  }, [isClient]); // Exécuter lorsque nous avons confirmé que nous sommes côté client et que l'URL change
// Réexécuter à chaque changement d'URL

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
              <Image
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
          {/* Updated Link path with correct dynamic id */}
          <Link
  href={`/listingorg/${contactId}/contact/${row.original.id}`}
  className="hover:underline"
>
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
        const stage = row.getValue("stage") as string;
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
            <span>{stage}</span>
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
          {row.original.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-sm bg-gray-100 hover:bg-gray-100"
            >
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editer</DropdownMenuItem>
            <DropdownMenuItem>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-5">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="">
            <TabsList className="bg-white">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Tous
              </TabsTrigger>
              <TabsTrigger value="people" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Personnes
              </TabsTrigger>
              <TabsTrigger
                value="companies"
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" />
                Compagnies
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            value="default"
            className="flex items-center gap-2 bg-transparent hover:bg-transparent text-black border border-gray-200"
          >
            <CirclePlus className="h-4 w-4" />
            Tags
          </Button>
        </div>

        <div className="relative w-full md:w-60 ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-8" />
        </div>
      </div>

      <div className="rounded-md border mt-6 px-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}