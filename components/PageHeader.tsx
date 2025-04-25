// components/common/PageHeader.tsx
"use client"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, PenIcon, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddManual?: () => void;
  onAddAI?: () => void;
  children?: ReactNode;
  onAddClick?: () => void; // Ajoutez cette ligne

}

export function PageHeader({
  title,
  searchPlaceholder = "Rechercher",
  showSearch = true,
  showAddButton = false,
  addButtonText = "Ajouter",
  onAddManual,
  onAddAI,
  children,
}: PageHeaderProps) {
  return (
    <div className="w-full mt-4">
      <header>
        <div className="w-full flex items-center justify-between gap-4 bg-background/95">
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb className="">
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block text-black font-bold">
                    {title}
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="w-full pl-8"
                  placeholder={searchPlaceholder}
                />
              </div>
            )}

            {showAddButton && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold">
                    <Plus className="h-4 w-4 mr-1" /> {addButtonText}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={onAddManual}
                  >
                    <PenIcon className="h-4 w-4 mr-2" />
                    <span>Manuellement</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={onAddAI}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Via IA</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {children}
          </div>
        </div>

        <Separator className="mt-3" />
      </header>
    </div>
  );
}