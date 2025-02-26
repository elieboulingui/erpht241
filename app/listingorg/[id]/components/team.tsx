import * as React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Import de useSession pour récupérer la session de l'utilisateur
import { ChevronsUpDown, Plus } from "lucide-react"; // Icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Components UI pour le dropdown
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"; // Sidebar components
 // Fonction pour récupérer les organisations
import { getorganisation } from "../action/getorganisation";
export function TeamSwitcher({ teams }: { teams: { name: string; logo: React.ElementType; plan: string }[] }) {
  const { isMobile } = useSidebar();
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<any[]>([]); // Etat pour les organisations

  const { data: session, status } = useSession(); // Utilisation de useSession pour récupérer les données de session

  const isLoading = status === "loading"; // Vérification de l'état de chargement de la session

  // Fonction pour récupérer les organisations de l'utilisateur via l'API
  useEffect(() => {
    if (!session?.user?.email) {
      console.log("User not logged in or email not found");
      return;
    }

    // Appel pour récupérer les organisations de l'utilisateur via l'API
    const fetchUserOrganisations = async () => {
      try {
        const response = await fetch("/api/user-organisations"); // Appel API pour récupérer les organisations
        if (!response.ok) {
          throw new Error("Failed to fetch user organizations");
        }
        const organisations = await response.json(); // Récupère les organisations
        setUserOrganizations(organisations); // Met à jour l'état des organisations
      } catch (error) {
        console.error("Error fetching user organizations:", error);
      }
    };

    fetchUserOrganisations();
  }, [session]); // Se lance à chaque fois que la session change

  // Fonction pour récupérer les informations détaillées de l'organisation
  const getOrganisationData = async (orgId: string) => {
    try {
      const organisation = await getorganisation(orgId); // Appel API pour récupérer les données de l'organisation
      setOrgName(organisation.name); // Met à jour le nom de l'organisation
      setOrgLogo(organisation.logo); // Met à jour le logo de l'organisation
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  // Fonction qui s'active lors de la sélection d'une organisation
  const handleOrgSelect = (orgId: string) => {
    setOrgId(orgId); // Met à jour l'ID de l'organisation
    getOrganisationData(orgId); // Récupère les détails de l'organisation
  };

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listingorg\/([^\/]+)/); // Capture l'ID de l'organisation dans l'URL

    if (match && match[1]) {
      const id = match[1];
      setOrgId(id); // Met à jour l'ID de l'organisation
      getOrganisationData(id); // Récupère les détails de l'organisation
    }
  }, []); // Se lance lors du montage du composant

  // Si aucune organisation n'est sélectionnée, on peut choisir une organisation par défaut
  const activeTeam = userOrganizations[0] || { name: "", logo: () => null, plan: "" };

  const handleAddOrganisationClick = () => {
    window.location.href = "/organisationcreate"; // Redirige vers la page "/listingorg"
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
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
                onClick={() => handleOrgSelect(organisation.id)} // Met à jour l'ID de l'organisation sélectionnée
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
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
              <div className="font-medium text-muted-foreground" onClick={handleAddOrganisationClick}>Add organisation</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
