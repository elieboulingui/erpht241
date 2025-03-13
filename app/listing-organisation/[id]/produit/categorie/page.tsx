"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import { ArrowUpDown, LayoutGrid, Building2, Search, MoreHorizontal } from "lucide-react";
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ContactsTablePagination } from "../../contact/components/ContactsTablePagination";
import Link from "next/link";
import { revalidatePath } from 'next/cache';

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
  const pathname = usePathname(); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [formData, setFormData] = useState<Category>({ logo: null } as Category);
  const [selectedTab, setSelectedTab] = useState("all");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [urlid, setUrlid] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();

  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/);
    return match ? match[1] : null;
  };

  const fetchCategories = async (organisationId: string, tab: string) => {
    setLoading(true);
    setError(null);

    let url = '/api/categories';

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

      // Revalidate path after deleting category
      const path = `/listing-organisation/${urlid}/produit/categorie`;  // Adjust path as needed
      console.log("Revalidating path:", path); // Log the path for debugging
      revalidatePath(path);
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

        // Revalidate path after updating category
        const path = `/listing-organisation/${urlid}/produit/categorie`;  // Adjust path as needed
        console.log("Revalidating path:", path); // Log the path for debugging
        revalidatePath(path);

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
// Service pour récupérer les catégories depuis l'API
useEffect(() => {
  // Appliquer l'expression régulière pour extraire l'ID de l'organisation
  const regex = /\/listing-organisation\/([a-zA-Z0-9]+)\/produit\/categorie/;
  const match = pathname.match(regex);

  if (match) {
    const organisationId = match[1]; // L'ID de l'organisation
    setUrlid(organisationId);
  }
}, [pathname]); // Recalculer chaque fois que le pathname change

const deleteAllCategories = async () => {
  if (!urlid) {
    toast.error("L'ID de l'organisation est manquant.");
    return;
  }

  try {
    // Faire une requête API pour supprimer toutes les catégories de l'organisation
    const response = await fetch(`/api/catego?organisationId=${urlid}`, {
      method: "DELETE", // Suppression via méthode DELETE
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de toutes les catégories.");
    }

    // Réinitialiser l'état des catégories
    setCategories([]);
    setRowSelection({});

    toast.success("Toutes les catégories ont été supprimées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    toast.error("Erreur lors de la suppression des catégories.");
  }
};

  useEffect(() => {
    const id = extractIdFromUrl();
    setUrlid(id);
    if (id) {
      fetchCategories(id, selectedTab);
    }
  }, [selectedTab, currentPage, rowsPerPage]);

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setCategoryDescription(editingCategory.description || "");
      setFormData({
        ...formData,
        logo: editingCategory.logo || null,
      });
    }
  }, [editingCategory]);

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
      cell: ({ row }) => {
        const isSubcategory = row.original.parentCategoryId ? true : false;
        const categoryName = row.original.name;
        const categoryId = row.original.id;
        const logo = row.original.logo;

        return (
          <Link
            href={`/listing-organisation/${urlid}/produit/categorie/${categoryId}`}
            passHref
            className="cursor-pointer flex items-center space-x-2"
          >
            {logo && <img src={logo} alt="image" className="h-8 w-8 object-contain" />}
            <span style={{ paddingLeft: isSubcategory ? '20px' : '0' }}>{categoryName}</span>
            {isSubcategory && <span className="text-gray-500 ml-2">(Sous-catégorie)</span>}
          </Link>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.description || "Pas de description";
        return <span>{description}</span>;
      },
    },
    {
      accessorKey: "productCount",
      header: "Nombre de Produits",
      cell: ({ row }) => {
        const productCount = row.original.productCount;
        return <span>{productCount}</span>;
      },
    },
    {
      id: "actions",
      header: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <ArrowUpDown className="h-4 w-4" />
          <span className="sr-only">Filtre</span>
        </Button>
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border cursor-pointer border-gray-200 rounded-md shadow-lg">
            <DropdownMenuItem
              onClick={() => setEditingCategory(row.original)}
              className="px-4 py-2 rounded-md"
            >
              Editer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteCategory(row.original.id)}
              className="px-4 py-2 rounded-md"
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  useEffect(() => {
    setColumnFilters([
      {
        id: "name",
        value: searchTerm,
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
    initialState: {
      pagination: {
        pageSize: rowsPerPage,
      },
    },
  });

  const selectedRowCount = Object.values(rowSelection).filter((isSelected) => isSelected).length;
  const calculateCategoryDepth = (categoryId: string, categories: Category[]): number => {
    let depth = 0;
    let currentCategoryId = categoryId;
  
    // Tant qu'on trouve un parent, on incrémente la profondeur
    while (currentCategoryId) {
      const category = categories.find((cat) => cat.id === currentCategoryId);
      if (category && category.parentCategoryId) {
        depth += 1;
        currentCategoryId = category.parentCategoryId;
      } else {
        break;
      }
    }
  
    return depth;
  };

  return (
    <div className="w-full">
      <AddCategoryForm />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-3 py-5">
        <div className="relative w-full md:w-60">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par catégorie..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedRowCount > 0 && (
      <Button
      variant="destructive"
      onClick={deleteAllCategories} // Appel de la fonction pour supprimer toutes les catégories
    >
      Supprimer toutes les catégories
    </Button>
    
    
        )}
      </div>

      {loading && <Chargement />}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              const isSubcategory = row.original.parentCategoryId !== null;
              const depth = calculateCategoryDepth(row.original.id, categories);

              return (
                <TableRow
                  key={row.id}
                  style={{ paddingLeft: `${depth * 20}px` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Sheet open={editingCategory !== null} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <SheetContent>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Éditer la catégorie</h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Nom de la catégorie"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Description"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="logo">image</Label>
                <UploadButton
                  endpoint="imageUploader"
                  className="relative h-full w-full ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                  onClientUploadComplete={(res: any) => {
                    console.log("Fichiers uploadés: ", res);
                    if (res && res[0]) {
                      setFormData({ ...formData, logo: res[0].ufsUrl });
                      toast.success("Upload du logo terminé !");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Erreur lors de l'upload: ${error.message}`);
                  }}
                />
              </div>
              <div className="w-full flex justify-center items-center">
                <Button type="submit" className="w-full bg-black hover:bg-black">
                  Mettre à jour
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}