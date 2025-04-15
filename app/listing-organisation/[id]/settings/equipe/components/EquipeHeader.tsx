"use client"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon, Sparkles, Search } from "lucide-react"
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface EquipeHeaderProps {
  activeTab: "employes" | "profil" | "permission";
}

export function EquipeHeader({ activeTab }: EquipeHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Déterminer les textes en fonction de l'onglet actif
  const getTexts = () => {
    switch (activeTab) {
      case "employes":
        return {
          searchPlaceholder: "Rechercher un employé",
          buttonText: "Ajouter un employé",
          buttonLabel: "employé"
        };
      case "profil":
        return {
          searchPlaceholder: "Rechercher un profil",
          buttonText: "Ajouter un profil",
          buttonLabel: "profil"
        };
      case "permission":
        return {
          searchPlaceholder: "Rechercher une permission",
          buttonText: "Ajouter une permission",
          buttonLabel: "permission"
        };
      default:
        return {
          searchPlaceholder: "Rechercher",
          buttonText: "Ajouter",
          buttonLabel: "élément"
        };
    }
  };

  const { searchPlaceholder, buttonText, buttonLabel } = getTexts();

  return (
    <div className="w-full mt-4">
      <header className=" ">

        <div className="w-full flex items-center justify-between gap-4 bg-background/95 ">


          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink className="text-black font-bold" href="#">
                      Equipe
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

          </div>

          <div className="flex items-center gap-4 px-5">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                className="w-full pl-8"
                placeholder={searchPlaceholder}
              />
            </div>

            <div className="">
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild className="">
                  <Button className="bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold">
                    <Plus className="h-4 w-4 mr-1" /> {buttonText}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem className="cursor-pointer">
                    <PenIcon className="h-4 w-4 mr-2" />
                    <span>Manuellement</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Via IA</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>

        </div>

        <Separator className="mt-3" />
      </header>
    </div>
  );
}