"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus, PenIcon, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface PageHeaderProps {
  title: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  showDropdownButton?: boolean;
  separator?: boolean;
  addButtonText?: string;
  dropdownButtonText?: string;
  onAddManual?: () => void;
  onAddAI?: () => void;
  onSearchChange?: (value: string) => void; // ✅ Ajouté ici
  children?: ReactNode;
  dropdownItems?: DropdownItem[];
  dropdownAlign?: "start" | "center" | "end";
  dropdownContentClassName?: string;
}

export function PageHeader({
  title,
  searchPlaceholder = "Rechercher",
  showSearch = true,
  showAddButton = false,
  showDropdownButton = false,
  addButtonText = "Ajouter",
  dropdownButtonText = "Nouveau",
  separator = true,
  onAddManual,
  onAddAI,
  onSearchChange, // ✅ Récupéré ici
  children,
  dropdownItems = [],
  dropdownAlign = "end",
  dropdownContentClassName = "w-10"
}: PageHeaderProps) {
  return (
    <div className="w-full mt-4">
      <header>
        <div className="w-full flex items-center justify-between gap-4 bg-background/95">
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
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
                  onChange={(e) => onSearchChange?.(e.target.value)} // ✅ Ici
                />
              </div>
            )}

            {showAddButton && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <Plus className="h-4 w-4 mr-1" /> {addButtonText}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[180px]"
                  sideOffset={4}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    onSelect={(e) => {
                      e.preventDefault();
                      onAddManual?.();
                    }}
                  >
                    <PenIcon className="h-4 w-4 mr-2" />
                    <span>Manuellement</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    onSelect={(e) => {
                      e.preventDefault();
                      onAddAI?.();
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Via IA</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showDropdownButton && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    <Plus className="h-4 w-4" /> {dropdownButtonText}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={dropdownAlign}
                  className={dropdownContentClassName}
                  sideOffset={4}
                  onEscapeKeyDown={(e) => e.preventDefault()}
                  onPointerDownOutside={(e) => e.preventDefault()}
                >
                  {dropdownItems.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                      onSelect={(e) => {
                        e.preventDefault();
                        item.onClick();
                      }}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {children}
          </div>
        </div>

        {separator && (
          <Separator orientation="horizontal" className="my-4" />
        )}
      </header>
    </div>
  );
}
