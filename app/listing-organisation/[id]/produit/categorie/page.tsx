"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";
import { updateCategoryById } from "./action/Update";
import { deleteCategoryById } from "./action/deleteCategoryById";
import { AddCategoryForm } from "./components/add-category-form";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { ContactsTablePagination } from "../../contact/components/ContactsTablePagination";
import Link from "next/link";
import Chargement from "@/components/Chargement";
import { ProductCategoriesSelector } from "./components/ProductCategoriesSelector";
import DashboardSidebar from "@/components/DashboardSidebar";

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
  parentCategoryName?: string | null; // Make sure this is nullable
}

export default function Page() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [formData, setFormData] = useState<Category>({
    logo: null,
  } as Category);
  const [selectedTab, setSelectedTab] = useState("all");
  const [organisationId, setOrganisationId] = useState<string | null>(null);

  const router = useRouter();

  // Extract organisation ID from URL
  const extractIdFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(
      /\/listing-organisation\/([^/]+)\/produit\/categorie/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

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
          <Chargement />
        ) : (
         <div className="p-3">
           <ProductCategoriesSelector
            selectedCategories={[]}
            setSelectedCategories={function (categories: string[]): void {
              throw new Error("Function not implemented.");
            }}
          />
         </div>
        )}
        {/* Pagination component can be added here */}
      </div>
    </div>
  );
}
