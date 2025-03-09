"use client";
import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowUpDown, LayoutGrid, Building2, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AddCategoryForm } from "./components/add-category-form";
import { updateCategoryById } from "./action/Update";
import { deleteCategoryById } from "./action/deleteCategoryById";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import Chargement from "@/components/Chargement";

// Type definitions for Category
interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  organisationId: string;
  logo?: string | null;
  productCount: number;
  parentCategoryId?: string | null;
}

export default function Page() {
  // State variables
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");
  const [formData, setFormData] = React.useState<Category>({ logo: null } as Category);
  const [selectedTab, setSelectedTab] = React.useState("all");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const router = useRouter();

  // Utility function to extract organisation ID from URL
  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/);
    return match ? match[1] : null;
  };

  // Fetch categories based on selected tab and organisationId
  const fetchCategories = async (organisationId: string, tab: string) => {
    setLoading(true);
    setError(null);

    let url = '/api/getparentcategory'; // Default for parent categories
    if (tab === "all") {
      url = '/api/categories'; // All categories
    } else if (tab === "compagnie") {
      url = '/api/categorieschildrem'; // Sub-categories
    }

    try {
      const response = await fetch(`${url}?organisationId=${organisationId}`);
      if (!response.ok) {
        toast.error("Erreur lors de la récupération des catégories.");
        return;
      }
      const data: Category[] = await response.json();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la récupération des catégories.");
    } finally {
      setLoading(false);
    }
  };

  // Delete category by ID
  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryById(id);
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error);
    }
  };

  // Handle category update
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      try {
        setLoading(true);
        await updateCategoryById(editingCategory.id, {
          name: categoryName,
          description: categoryDescription,
          logo: formData.logo,
        });

        setEditingCategory(null);
        toast.success("Catégorie mise à jour avec succès");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de la catégorie");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  // Fetch categories when URL or tab changes
  useEffect(() => {
    const id = extractIdFromUrl();
    if (id) {
      fetchCategories(id, selectedTab);
    }
  }, [selectedTab]);

  // Set category data when editing a category
  React.useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setCategoryDescription(editingCategory.description || "");
      setFormData({
        ...formData,
        logo: editingCategory.logo || null,
      });
    }
  }, [editingCategory]);

  // Columns setup for the table
  const columns: ColumnDef<Category>[] = useMemo(() => [
    // Define columns (select, logo, name, description, product count, actions)
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
      cell: ({ row }) => {
        const isSubcategory = row.original.parentCategoryId ? true : false;
        return (
          <span>
            {row.original.name}
            {isSubcategory && <span className="text-gray-500 ml-2">(Sous-catégorie)</span>}
          </span>
        );
      },
    },
    // Additional columns for description, stock, and actions...
  ], []);

  // Update column filters based on search term
  React.useEffect(() => {
    setColumnFilters([
      {
        id: "name",
        value: searchTerm,
      },
    ]);
  }, [searchTerm]);

  // Table setup
  const table = useReactTable({
    data: categories,  // Using the latest fetched categories
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
      {/* Add Category Form */}
      <AddCategoryForm />

      {/* Tab and Search Input */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-3 py-5">
        <div className="flex items-center gap-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-white">
              {/* Tab Buttons */}
              <TabsTrigger value="all" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                Tous
              </TabsTrigger>
              <TabsTrigger value="personne" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Catégories
              </TabsTrigger>
              <TabsTrigger value="compagnie" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Sous Catégories
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-60">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par catégorie..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Table Component */}
      <div className="rounded-md border mt-6 px-5">
        {loading ? (
          <div className="text-center py-5">
            <Chargement />
          </div>
        ) : (
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
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucune catégorie enregistrée.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
