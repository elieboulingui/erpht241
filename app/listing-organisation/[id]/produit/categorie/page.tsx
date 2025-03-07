"use client";
import * as React from "react";
import { useMemo } from "react";
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
import { ArrowUpDown, LayoutGrid, Building2, SlidersHorizontal, MoreHorizontal, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { AddCategoryForm } from "./components/add-category-form";
import { useRouter } from "next/navigation";
import { updateCategoryById } from "./action/Update";
import { deleteCategoryById } from "./action/deleteCategoryById";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";

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

  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/);
    return match ? match[1] : null;
  };

  const fetchCategories = async (organisationId: string, tab: string) => {
    setLoading(true);
    setError(null);

    let url = '/api/getparentcategory'; // URL par défaut
    if (tab === "all") {
      url = `/api/categories`; // Si l'onglet "Tout" est sélectionné
    }

    try {
      const response = await fetch(`${url}?organisationId=${organisationId}`);
      if (!response.ok) {
        toast.error("Erreur lors de la récupération des catégories.");
        return;
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

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  React.useEffect(() => {
    const id = extractIdFromUrl();
    if (id) {
      fetchCategories(id, selectedTab);
    }
  }, [selectedTab]); // On refait l'appel API chaque fois que l'onglet change

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

  const columns: ColumnDef<Category>[] = useMemo(() => [
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
      accessorKey: "productCount",
      header: "Stoks",
      cell: ({ row }) => (
        <span>{row.original.productCount}</span>
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
  ], []);

  const filteredCategories = useMemo(() => categories.filter((category) => {
    if (selectedTab === "personne") return !category.parentCategoryId;
    if (selectedTab === "compagnie") return category.parentCategoryId;
    return true;
  }), [categories, selectedTab]);

  React.useEffect(() => {
    setColumnFilters([
      {
        id: "name",
        value: searchTerm,
      },
    ]);
  }, [searchTerm]);

  const table = useReactTable({
    data: filteredCategories,
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
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-white">
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

      <div className="rounded-md border mt-6 px-5">
        {loading ? (
          <div className="text-center py-5">
            <span>Chargement...</span>
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
              {filteredCategories.length === 0 ? (
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

      <Sheet open={!!editingCategory} onOpenChange={handleCancelEdit}>
        <SheetContent>
          <h3 className="text-lg font-semibold">Modifier la catégorie</h3>
          <form onSubmit={handleUpdateCategory} method="POST">
            <div>
              <Label htmlFor="name">Nom:</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description:</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="logo">Logo:</Label>
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                onClientUploadComplete={(res: any) => {
                  if (res && res[0]) {
                    setFormData({
                      ...formData,
                      logo: res[0].ufsUrl,
                    });
                    toast.success("Upload du logo terminé !");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Erreur lors de l'upload: ${error.message}`);
                }}
              />
              {formData.logo && (
                <div className="mt-2">
                  <img
                    className="max-h-32 max-w-full object-contain"
                    src={formData.logo}
                    alt="Logo de catégorie"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="mt-4 w-full bg-back hover:bg-black"
              disabled={loading}
            >
              {loading ? "Mise à jour en cours..." : "Mettre à jour"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
