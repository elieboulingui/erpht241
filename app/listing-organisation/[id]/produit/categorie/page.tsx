"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
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
import { updateCategoryById } from "./action/Update";
import { deleteCategoryById } from "./action/deleteCategoryById";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organisationId: string;
  logo?: string | null; // Ajout du champ logo pour afficher l'image
}

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState(""); // Ajout de l'état pour la recherche
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");
  const router = useRouter();

  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/);
    return match ? match[1] : null;
  };

  const fetchCategories = async (organisationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/categories?organisationId=${organisationId}`);
      if (!response.ok) {
        toast.error("Erreur lors de la récupération des catégories.");
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la récupération des catégories.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryById(id);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (editingCategory) {
      try {
        setLoading(true);
        const updatedCategory = await updateCategoryById(editingCategory.id, {
          name: categoryName,
          description: categoryDescription,
        });
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
        setEditingCategory(null);
        toast.success("Catégorie mise à jour avec succès");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de la catégorie");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  React.useEffect(() => {
    const id = extractIdFromUrl();
    if (id) {
      fetchCategories(id);
    }
  }, []);

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
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const logo = row.original.logo;
        return logo ? (
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
        ) : (
          <span className="text-gray-500">Pas de logo</span>
        );
      },
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
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditingCategory(row.original)}>Editer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteCategory(row.original.id)}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Mise à jour des filtres de la table en fonction de la recherche
  React.useEffect(() => {
    setColumnFilters([
      {
        id: "name",
        value: searchTerm, // Utilisation de searchTerm comme filtre
      },
    ]);
  }, [searchTerm]);

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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-3 py-5">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="">
            <TabsList className="bg-white">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Tous
              </TabsTrigger>
              <TabsTrigger value="personne" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Catégorie
              </TabsTrigger>
              <TabsTrigger value="compagnie" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nombre
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="relative w-full md:w-60 ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par catégorie..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour de l'état de recherche
          />
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}

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

      {/* Modal pour l'édition */}
      <Sheet open={!!editingCategory} onOpenChange={handleCancelEdit}>
        <SheetContent>
          <SheetClose onClick={handleCancelEdit}>Close</SheetClose>
          <h3 className="text-lg font-semibold">Modifier la catégorie</h3>
          <form onSubmit={handleUpdateCategory}>
            <div>
              <label htmlFor="name">Nom:</label>
              <input
                id="name"
                name="name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <input
                id="description"
                name="description"
                type="text"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <button type="submit" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
