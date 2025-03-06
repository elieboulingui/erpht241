"use client";  // Assurez-vous que ce fichier est exécuté côté client

import * as React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronsUpDown, Plus } from "lucide-react";
import useSWR from "swr";  // Importer SWR
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

// Définir le type pour l'organisation
interface Organisation {
  id: string;
  name: string;
  logo?: string;
  plan: string;
}

// Fonction de récupération des organisations de l'utilisateur
const fetchUserOrganizations = async (): Promise<Organisation[]> => {
  const response = await fetch("/api/user-organisations");
  if (!response.ok) {
    throw new Error("Failed to fetch user organizations");
  }
  return response.json();
};

// Fonction de récupération des données de l'organisation par ID
const fetchOrganisationData = async (orgId: string): Promise<Organisation> => {
  const url = `/api/getOrganisation?id=${orgId}`;  // URL avec le paramètre 'id'
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch organisation data");
  }

  return response.json();
};

export function TeamSwitcher({ teams }: { teams: { name: string; logo: React.ElementType; plan: string }[] }) {
  const { isMobile } = useSidebar();
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Utilisation de SWR pour récupérer les organisations de l'utilisateur
  const { data: userOrganizations, error } = useSWR<Organisation[]>(
    session?.user?.email ? "/api/user-organisations" : null,
    fetchUserOrganizations
  );

  // Fonction pour récupérer les données d'une organisation spécifique
  const getOrganisationData = async (orgId: string) => {
    try {
      const organisation = await fetchOrganisationData(orgId);
      setOrgName(organisation.name);
      setOrgLogo(organisation.logo || null);  // Utilisation de null si logo est undefined
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };
  
  const handleOrgSelect = (orgId: string) => {
    setOrgId(orgId);
    getOrganisationData(orgId);

    // Utilise window.location.href pour changer l'URL sans recharger la page
    window.location.href = `/listing-organisation/${orgId}`;  // Changer l'URL sans recharger la page
  };

  // Gestion du chemin dans l'URL pour définir l'organisation active
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listing-organisation\/([^\/]+)/);

    if (match && match[1]) {
      const id = match[1];
      setOrgId(id);
      getOrganisationData(id);
    }
  }, []);

  // Si aucune organisation n'est sélectionnée, on prend la première organisation
  const activeOrganisation = userOrganizations?.find((org) => org.id === orgId) || userOrganizations?.[0];

  const handleAddOrganisationClick = () => {
    window.location.href = "/create-organisation";
  };

  // Vérifiez si l'organisation active et son plan sont disponibles
  const orgNameToDisplay = orgName || activeOrganisation?.name || "Organisation";
  const orgPlanToDisplay = activeOrganisation?.logo

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {orgPlanToDisplay ? (
                  <img src={orgPlanToDisplay} alt={orgName || "Organization"} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    {orgName ? orgName.charAt(0) : "O"}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{orgNameToDisplay}</span>
                {/* <span className="truncate text-xs">{orgPlanToDisplay}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Organisations</DropdownMenuLabel>
            {userOrganizations?.map((organisation) => (
              <DropdownMenuItem
                key={organisation.id}
                onClick={() => handleOrgSelect(organisation.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center ">
                  <img
                    src={organisation.logo || "/default-logo.png"}
                    alt={organisation.name}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                {organisation.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground" onClick={handleAddOrganisationClick}>plus d organisation</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
