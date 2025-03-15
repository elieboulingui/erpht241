"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";
import { updateCategoryById } from "./action/Update";
import { deleteCategoryById } from "./action/deleteCategoryById";
import { AddCategoryForm } from "./components/add-category-form";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { ContactsTablePagination } from "../../contact/components/ContactsTablePagination";
import Link from "next/link";
import { ProductCategoriesSelector } from "../components/product-categories-selector";
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
  parentCategoryId?: string | null; // Add parentCategoryId to track the hierarchy
}

export default function Page() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [formData, setFormData] = useState<Category>({ logo: null } as Category);
  const [selectedTab, setSelectedTab] = useState("all");
  const [urlid, setUrlid] = useState<string | null>(null);

  const router = useRouter();

  // Extract organisation ID from URL
  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/);
    return match ? match[1] : null;
  };

  // Fetch categories from the server
  const fetchCategories = async (organisationId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/categories?organisationId=${organisationId}`);
      if (!response.ok) {
        toast.error("Erreur lors de la récupération des catégories.");
        return;
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des catégories.");
    } finally {
      setLoading(false);
    }
  };

  // Handle category updates
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

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
  };

  // Handle drag over (allows drop)
  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const targetElement = e.target as HTMLElement;
    targetElement.classList.add("drag-over");
  };

  // Handle drop (reorder categories or merge)
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"));
    const newCategories = [...categories];
    const [movedCategory] = newCategories.splice(draggedIndex, 1);
    
    if (draggedIndex !== targetIndex) {
      const targetCategory = newCategories[targetIndex];

      // Check if the dragged category is being dropped inside another category (merge logic)
      if (targetCategory.parentCategoryId === null) {
        targetCategory.parentCategoryId = movedCategory.id; // Set parentId to the moved category
        movedCategory.parentCategoryId = targetCategory.id; // Set the moved category's parent to the target category
      }

      newCategories.splice(targetIndex, 0, movedCategory); // Insert the dragged category at the target position
      setCategories(newCategories);
      toast.success("Catégorie déplacée avec succès!");
    }
  };

  useEffect(() => {
    const organisationId = extractIdFromUrl();
    if (organisationId) {
      setUrlid(organisationId);
      fetchCategories(organisationId);
    }
  }, [pathname, selectedTab]);

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
      </div>

      {/* Show loading text instead of table */}
      {loading ? (
        <Chargement/>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => {/* sort categories */}}>
                  Nom
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Nombre de Produits</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories
                .filter(category =>
                  category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((category, index) => (
                  <TableRow
                    key={category.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{ cursor: "move" }}
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || "Pas de description"}</TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white p-3 border">
  <DropdownMenuItem
    onClick={() => setEditingCategory(category)}
    className=""
  >
    Éditer
  </DropdownMenuItem>
  <DropdownMenuItem
    onClick={() => deleteCategoryById(category.id)}
    className=""
  >
    Supprimer
  </DropdownMenuItem>
</DropdownMenuContent>

                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Sheet open={editingCategory !== null}>
        <SheetContent>
          <div>
            <h2 className="text-xl font-bold mb-4">Éditer la catégorie</h2>
            <form onSubmit={handleUpdateCategory}>
              <div className="mb-4">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <UploadButton
                  endpoint="imageUploader"
                    className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                  onClientUploadComplete={(files) => {
                    setFormData({ ...formData, logo: files[0]?.ufsUrl });
                  }}
                />
              </div>
              <div className="w-full flex items-center justify-center">
  <Button className="bg-black hover:bg-black w-full" type="submit">
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
