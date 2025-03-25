"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import Iageneratemarque from "./Buttonfordrop";
import { Search } from "lucide-react";

interface MarqueHeaderProps {
  onFilterChange: (filter: { name: string; description: string }) => void;
}

export function MarqueHeader({ onFilterChange }: MarqueHeaderProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Déclenche l'appel de onFilterChange après un délai (300 ms)
    const timer = setTimeout(() => {
      onFilterChange({ name, description });
    }, 300); // Attendre 300 ms après la dernière modification

    // Nettoie le timer précédent si un changement se produit avant le délai
    return () => clearTimeout(timer);
  }, [name, description, onFilterChange]);

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
                    Marque
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

          <div className="flex gap-4 items-center">
            <div className="flex items-center">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la marque"
                className="flex-1"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
           
            <Iageneratemarque />
          </div>
        </div>

        <Separator className="mt-2" />
      </header>
    </div>
  );
}
