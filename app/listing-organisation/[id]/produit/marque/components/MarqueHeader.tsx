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
    const timer = setTimeout(() => {
      // Envoie le filtre seulement après un délai de saisie
      onFilterChange({ name, description });
    }, 500); // Attendre 500ms après la dernière saisie

    return () => clearTimeout(timer); // Annuler si la saisie change avant les 500ms
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
