"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AIContactGenerator from "@/app/agents/contact/composant/ai-contact-generator";
import { extractIdFromUrl, generateCompanyContactsFromLocalData } from "@/app/agents/contact/composant/utils";
import ManualContactForm from "./ManualContactForm";
import { CompanyData, Niveau } from "@/app/agents/contact/composant/types";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Search, Plus, Sparkles, PenIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { PageHeader } from "@/components/PageHeader";

// SearchInputContact component
interface SearchInputProps<TData> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  table?: Table<TData>;
  columnId?: string;
  className?: string;
}

function SearchInputContact<TData>({
  placeholder = "Rechercher par nom",
  value,
  onChange,
  table,
  columnId = "name",
  className = "",
}: SearchInputProps<TData>) {
  return (
    <div className={`relative w-full md:w-60 ${className}`}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (table && columnId) {
            table.getColumn(columnId)?.setFilterValue(e.target.value);
          }
        }}
      />
    </div>
  );
}

// ContactAddButton component
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

// ContactHeader component
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

    console.log("Données envoyées à l'API :", contactData);

    const loadingToast = toast.loading("Création du contact en cours...");

    try {
      const response = await fetch("/api/createcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur serveur : ${errorText || response.statusText}`);
      }

      const responseData = await response.json();
      if (responseData?.message) {
        toast.success(responseData.message);

        if (responseData?.contact) {
          window.createdContact = responseData.contact;
          window.dispatchEvent(new Event("newContactAdded"));
          console.log("Contact created and event dispatched:", responseData.contact);
        }

        const event = new CustomEvent("contactCreated", {
          detail: { organisationId },
        });
        window.dispatchEvent(event);

        return responseData.contact;
      } else {
        throw new Error("Réponse du serveur invalide, message manquant.");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du contact", error);
      throw error;
    }
  };

  return (
    <div className="flex">
     <PageHeader
  title="Contacts"
  searchPlaceholder="Rechercher par nom"
  showAddButton
  addButtonText="Ajouter un contact"
  onAddManual={() => setIsSheetOpen(true)}
  onAddAI={() => setIsAIDialogOpen(true)}
/>

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