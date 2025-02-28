// /app/listingorg/[organisationId]/produit/categorie/page.tsx
"use client";
import * as React from "react";
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
import { ArrowUpDown, LayoutGrid, Users, Building2, SlidersHorizontal, MoreHorizontal } from "lucide-react";
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AddCategoryForm } from "./components/add-category-form";
import { useRouter } from "next/navigation";
import { getCategoriesByOrganisationId } from "./action/getCategoriesByOrganisationId";
 // Assurez-vous que le chemin est correct

// Définition du type pour les catégories
interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organisationId: string;
}

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [categories, setCategories] = React.useState<Category[]>([]);
  const router = useRouter();

  // Fonction pour extraire l'ID de l'URL
  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/listingorg\/([^/]+)\/produit\/categorie/);
    return match ? match[1] : null;
  };

  // Fonction pour récupérer les catégories
  const fetchCategories = async (id: string) => {
    try {
      const data = await getCategoriesByOrganisationId(id);
      console.log("Données récupérées :", data); // Log des données récupérées

      // Si vous récupérez un tableau de catégories
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  // Initialisation au chargement de la page
  React.useEffect(() => {
    const id = extractIdFromUrl();
    if (id) {
      fetchCategories(id);
    }
  }, []);

  // Définition des colonnes du tableau
  const columns: ColumnDef<Category>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Sélectionner tout"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Sélectionner la ligne"
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
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="mr-6"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      header: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Filtre</span>
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

  // Initialisation de la table
  const table = useReactTable({
    data: categories,
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
      <AddCategoryForm />
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
                Catégorie
              </TabsTrigger>
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nombre
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="relative w-full md:w-60 ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher par catégorie..." className="pl-8" />
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  Aucune Catégorie enregistrée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
