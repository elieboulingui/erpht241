"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Chargement from "@/components/Chargement";
import { ProductCategoriesSelector } from "./components/ProductCategoriesSelector";
import DashboardSidebar from "@/components/DashboardSidebar";
import ContactAddButton from "./components/ContactAddButton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-select";

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
        <div className="flex items-center justify-between px-5 py-3">
          {/* Align SidebarTrigger, Separator and Category Text */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />

            <Separator className="mr-2 h-4" />

            <Separator  className="mr-2 h-4" />

            <div className="text-black font-bold">Catégories</div>
          </div>

          {/* Flex container for Input and ContactAddButton */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {/* Barre de recherche */}
            <div className="relative w-full md:w-60">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par catégorie..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ContactAddButton */}
            <ContactAddButton />
          </div>
        </div>

        {/* Affichage pendant le chargement */}
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
