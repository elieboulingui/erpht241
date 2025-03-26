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
  parentCategoryName?: string | null; // Ensure this is nullable
}

export default function Page() {
  const pathname = usePathname();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [organisationId, setOrganisationId] = useState<string | null>(null);

  // Extract organisation ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/);
    setOrganisationId(match ? match[1] : null);
  }, [pathname]);

  // Fetch categories when organisationId changes
  useEffect(() => {
    if (organisationId) {
      setLoading(true);
      fetch(`/api/categories?organisationId=${organisationId}`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [organisationId]);

  return (
    <div className="flex w-full">
      <div className="w-1/4">
        <DashboardSidebar />
      </div>

      <div className="w-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          {/* Sidebar Trigger, Separator, and Category Text */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" />
            <div className="text-black font-bold">Catégories</div>
          </div>

          {/* Search and Add Category Button */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
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

            {/* Add Category Button */}
            <ContactAddButton />
          </div>
        </div>

        {/* Show loading spinner or categories */}
        <div className="p-3 flex-1">
          {loading ? (
            <Chargement />
          ) : (
            <ProductCategoriesSelector
              selectedCategories={[]}
              setSelectedCategories={(categories: string[]) => {}}
              searchTerm={searchTerm} // Pass searchTerm to the ProductCategoriesSelector
            />
          )}
        </div>
      </div>
    </div>
  );
}
