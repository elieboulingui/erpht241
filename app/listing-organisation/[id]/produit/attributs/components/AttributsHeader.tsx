import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { PenIcon, Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export function AttributsHeader() {

  return (
    <div className="w-full">
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-black font-bold" href="#">
                    Attributs & Caractéristiques
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>



          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-8 w-full"

              />
            </div>

            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg"

                >
                  <Plus className="h-2 w-2" /> Ajouter un produit
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[180px] bg-white cursor-pointer z-50">
                <DropdownMenuItem className="flex items-center gap-2 p-2">
                  <PenIcon className="h-4 w-4" />
                  <span>Manuellement</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 p-2">
                  <Sparkles className="h-4 w-4" />
                  <span>via IA</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>

        <Separator className="mt-2" />
      </header>
    </div>
  );
}
