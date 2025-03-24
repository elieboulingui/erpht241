"use client";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ContactHeaderBreadcrumb from "./ContactHeaderBreadcrumb";
import ContactAddButton from "./ContactAddButton";
import AIContactGenerator from "@/app/agents/contact/composant/ai-contact-generator";
import { extractIdFromUrl, generateCompanyContactsFromLocalData } from "@/app/agents/contact/composant/utils";
import ManualContactForm from "./ManualContactForm";
import { CompanyData, Niveau } from "@/app/agents/contact/composant/types";
import { SearchInputContact } from "./SearchInputContact";

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
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <ContactHeaderBreadcrumb />

          <div className="flex items-center gap-4">
            <SearchInputContact 
              value={searchQuery} 
              onChange={setSearchQuery} 
              className="w-[200px]"
            />
            <ContactAddButton 
              onOpenManual={() => setIsSheetOpen(true)} 
              onOpenAI={() => setIsAIDialogOpen(true)} 
            />
          </div>
        </div>

        <Separator className="mt-2" />
      </header>

      <AIContactGenerator
        isOpen={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        organisationId={organisationId}
        saveContactToDatabase={saveContactToDatabase}
        generateContacts={generateCompanyContactsFromLocalData}
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