"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AIContactGenerator from "@/app/agents/contact/composant/ai-contact-generator";
import { extractIdFromUrl } from "@/app/agents/contact/composant/utils";
import ManualContactForm from "./ManualContactForm";
import { CompanyData, Niveau } from "@/app/agents/contact/composant/types";
import { Search, Plus, Sparkles, PenIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function SearchInputContact({
  placeholder = "Rechercher par nom",
  value,
  onChange,
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative w-full md:w-60 ${className}`}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface ContactAddButtonProps {
  onOpenManual: () => void;
  onOpenAI: () => void;
}

function ContactAddButton({ onOpenManual, onOpenAI }: ContactAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
          <Plus className="h-4 w-4" />
          Ajouter un contact
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[177px]">
        <DropdownMenuItem onClick={onOpenManual} className="cursor-pointer">
          <PenIcon className="h-4 w-4 mr-2" />
          <span>Manuellement</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenAI} className="cursor-pointer">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Via IA</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ContactHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function ContactHeader({ searchQuery, setSearchQuery }: ContactHeaderProps) {
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        setCompanyData(data);
      } catch (error) {
        console.error("Error loading data.json:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.pathname;
      const id = extractIdFromUrl(url);
      if (id) {
        setOrganisationId(id);
      } else {
        console.error("Aucun ID d'organisation trouvé dans l'URL");
      }
    }
  }, []);

  const saveContactToDatabase = async (contactData: {
    name: string;
    email: string;
    phone: string;
    niveau: Niveau;
    tags: string;
    organisationIds: string[];
    logo: string | null;
    adresse: string;
    status_contact: string;
  }) => {
    if (!organisationId) {
      console.error("Organisation ID is missing");
      throw new Error("L'ID de l'organisation est manquant");
    }

    // Afficher un indicateur de chargement sans message de succès intermédiaire
    const loadingToast = toast.loading("Ajout du contact en cours...");

    try {
      const response = await fetch("/api/createcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur serveur : ${errorText || response.statusText}`);
      }

      const responseData = await response.json();
      
      if (!responseData) {
        throw new Error("Réponse du serveur invalide");
      }
      
      if (responseData.contact) {
        toast.dismiss(loadingToast);
        window.location.reload();
        
        return responseData.contact;
      } else {
        throw new Error("Réponse du serveur invalide, contact manquant.");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      console.error("Erreur lors de la création du contact", error);
      toast.error(`Erreur : ${error.message || "Une erreur est survenue"}`);
      throw error;
    }
  };

  return (
    <div className="gap-4 mt-4">
      <div className="flex justify-between items-center gap-4">

        <div className="flex items-center px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-black font-bold">
                  Contacts
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

        <div className="flex items-center gap-2 px-5">
          <div>
            <SearchInputContact
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher par nom, email "
            />
          </div>
          <div>
            <ContactAddButton
              onOpenManual={() => setIsSheetOpen(true)}
              onOpenAI={() => setIsAIDialogOpen(true)}
            />
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" className="my-4" />

      <AIContactGenerator
        isOpen={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        organisationId={organisationId}
        saveContactToDatabase={saveContactToDatabase}
        onManualFallback={() => {
          setIsAIDialogOpen(false);
          setIsSheetOpen(true);
        }}
      />

      <ManualContactForm
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        organisationId={organisationId}
        saveContactToDatabase={saveContactToDatabase}
      />
    </div>
  );
}