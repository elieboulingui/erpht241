"use client"; // Assurez-vous que ce fichier est exécuté côté client

import * as React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronsUpDown, Plus } from "lucide-react"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"; 
import { getorganisation } from "../action/getorganisation"; 

export function TeamSwitcher({ teams }: { teams: { name: string; logo: React.ElementType; plan: string }[] }) {
  const { isMobile } = useSidebar();
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<any[]>([]);

  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  useEffect(() => {
    if (!session?.user?.email) {
      console.log("User not logged in or email not found");
      return;
    }

    const fetchUserOrganisations = async () => {
      try {
        const response = await fetch("/api/user-organisations");
        if (!response.ok) {
          throw new Error("Failed to fetch user organizations");
        }
        const organisations = await response.json();
        setUserOrganizations(organisations);
      } catch (error) {
        console.error("Error fetching user organizations:", error);
      }
    };

    fetchUserOrganisations();
  }, [session]);

  const getOrganisationData = async (orgId: string) => {
    try {
      const organisation = await getorganisation(orgId);
      setOrgName(organisation.name);
      setOrgLogo(organisation.logo);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const handleOrgSelect = (orgId: string) => {
    setOrgId(orgId);
    getOrganisationData(orgId);

    // Utilise window.location.href pour changer l'URL sans recharger la page
    window.location.href = `/listingorg/${orgId}`; // Change l'URL sans recharger la page
  };

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listingorg\/([^\/]+)/);

    if (match && match[1]) {
      const id = match[1];
      setOrgId(id);
      getOrganisationData(id);
    }
  }, []);

  const activeTeam = userOrganizations[0] || { name: "", logo: () => null, plan: "" };

  const handleAddOrganisationClick = () => {
    window.location.href = "/organisationcreate";
  };

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
                {orgLogo ? (
                  <img src={orgLogo} alt={orgName || "Organization"} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    {orgName ? orgName.charAt(0) : "O"}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{orgName || "Organization"}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
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
            {userOrganizations.map((organisation) => (
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
              <div className="font-medium text-muted-foreground" onClick={handleAddOrganisationClick}>Ajouter une organisation</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
