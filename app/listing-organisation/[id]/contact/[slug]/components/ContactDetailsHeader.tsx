"use client";

import type * as React from "react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ChevronRight, Ellipsis, Star } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  icon?: React.ReactNode;
  niveau: string;
  tags: string[];
  status_contact: string;
}

// Fonction pour récupérer l'ID de l'organisation dans l'URL
function getOrganisationIdFromUrl(): string | null {
  const url = window.location.href;
  const regex = /\/listing-organisation\/([a-zA-Z0-9]+)\/contact/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function ContactDetailsHeader() {
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    // Récupération des IDs dynamiquement depuis l'URL
    const orgId = getOrganisationIdFromUrl();
    if (orgId) {
      setOrganisationId(orgId);
    }

    const url = window.location.href;
    const contactRegex = /\/contact\/([a-zA-Z0-9]+)/;
    const contactMatch = url.match(contactRegex);

    if (contactMatch) {
      setContactId(contactMatch[1]);
    }
  }, []);

  useEffect(() => {
    const fetchContactData = async () => {
      if (!contactId) return;

      try {
        const response = await fetch(`/api/getcontactDetails?id=${contactId}`);
        const data = await response.json();

        if (!data) return;

        const transformedData: Contact = {
          name: data.name || "Nom non disponible",
          email: data.email || "",
          phone: data.phone || "",
          address: data.adresse || "",
          logo: data.logo || "",
          icon: undefined,
          niveau: data.niveau || "",
          tags: data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : [],
          status_contact: data.status_contact || "",
        };

        setContactDetails(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des détails du contact:", err);
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, [contactId]);

  // Structure par défaut pour éviter les erreurs si contactDetails est null
  const safeContact = contactDetails || {
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    icon: undefined,
    niveau: "",
    tags: [],
    status_contact: "",
  };

  return (
    <header className="w-full items-center gap-4 bg-background/95 py-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="text-black font-bold" href={`/listing-organisation/${organisationId}/contact`}>
                  Contacts
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbItem className="font-bold text-black">
                {safeContact.name || "Nom non disponible"}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star fill="black" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="mt-2" />
    </header>
  );
}
