"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import Iageneratemarque from "./Buttonfordrop";
import { createmarque } from "../action/createmarque";
import { Search } from "lucide-react";

export function MarqueHeader() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [organisationId, setOrganisationId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    const regex = /\/listing-organisation\/([a-zA-Z0-9-]+)\/produit\/marque/;
    const match = pathname.match(regex);

    if (match) {
      setOrganisationId(match[1]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!organisationId) {
      toast.error("Organisation ID est manquant.");
      setLoading(false);
      return;
    }

    try {
      await createmarque({
        name,
        description,
        organisationId,
        logo,
      });
      toast.success("Marque créée avec succès!");
      setName("");
      setDescription("");
      setLogo(undefined);
    } catch (error) {
      toast.error("Erreur lors de la création de la marque.");
    } finally {
      setLoading(false);
    }
  };

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
            <form
              onSubmit={handleSubmit}
              className="flex justify-between items-center w-full"
            >
              {/* Input will appear first */}
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de la marque"
                className="flex-1"
              />
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             
            </form>
            <Iageneratemarque  />
          </div>
        </div>

        <Separator className="mt-2" />
      </header>
    </div>
  );
}
