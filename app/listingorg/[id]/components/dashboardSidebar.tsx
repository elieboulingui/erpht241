'use client';

import * as React from "react";
import { getorganisation } from "../action/getorganisation"; // Importer la fonction serveur
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Command } from "lucide-react"; // Importation des icônes lucide
import { IoIosContacts } from "react-icons/io";
import { TiVendorMicrosoft } from "react-icons/ti";
import { SiAirtable } from "react-icons/si";
import { TbSettingsStar } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Plus, Edit } from "lucide-react"; // Importation des icônes lucide
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { useState, useEffect } from "react";

// Définir un type pour accepter les icônes de react-icons et lucide-react
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

type SidebarIcon = LucideIcon | IconType;

// Fonction pour structurer les données du sidebar
const data = (orgId: string) => ({
  main: [
    { title: "Home", url: `/listingorg/${orgId}/`, icon: Command, isActive: false, items: [] },
    { title: "Contact", url: `/listingorg/${orgId}/contact`, icon: IoIosContacts, isActive: false, items: [] },
    { title: "Settings", url: `/listingorg/${orgId}/settings`, icon: TbSettingsStar, isActive: false, items: [] },
  ],
  favorites: [
    { title: "Airtable", url: "#", icon: SiAirtable, isActive: false, items: [] },
    { title: "Google", url: "#", icon: FcGoogle, isActive: false, items: [] },
    { title: "Microsoft", url: "#", icon: TiVendorMicrosoft, isActive: false, items: [] },
  ],
  navSecondary: [
    { title: "Invite Member", url: `/listingorg/${orgId}/invite-member`, icon: Plus, isActive: false, items: [] },
    { title: "Feedback", url: `/listingorg/${orgId}/feedback`, icon: Edit, isActive: false, items: [] },
  ],
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null); // Ajout de l'état pour l'orgId
  const [userEmail, setUserEmail] = useState<string | null>(null); // Ajout de l'état pour l'email de l'utilisateur

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listingorg\/([^\/]+)/); // Capture l'ID de l'URL avec regex

    if (match && match[1]) {
      const id = match[1];
      setOrgId(id); // Définit l'orgId dans le state
      // Appel à la fonction serveur getorganisation pour obtenir les informations
      getOrganisationData(id);
    }
  }, []);

  // Fonction pour appeler l'action serveur
  const getOrganisationData = async (orgId: string) => {
    try {
      // Appel à la fonction getorganisation, elle retourne directement l'objet de l'organisation
      const organisation = await getorganisation(orgId);
      setOrgName(organisation.name);  // Assurez-vous que l'API retourne le nom de l'organisation
      setOrgLogo(organisation.logo);  // Assurez-vous que l'API retourne le logo de l'organisation
    
    } catch (error) {
      console.error("Erreur lors de la récupération de l'organisation", error);
    }
  };

  // Si orgId est null, on utilise une valeur vide pour éviter les erreurs
  const validOrgId = orgId || "";

  return (
    <Sidebar className="border-r bg-white" variant="inset" {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu className="bg-white">
          <SidebarMenuItem className="bg-white">
            <SidebarMenuButton className="bg-white" size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {orgLogo ? (
                    <img
                      src={orgLogo} // Affiche le logo de l'organisation
                      alt="Logo"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <Command className="size-4" />
                  )}
                </div>
                <div className="mt-2">
                  {/* Vous pouvez ajouter ici un texte ou d'autres éléments si nécessaire */}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{orgName || "Chargement..."}</span>  {/* Affiche le nom de l'organisation */}
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data(validOrgId).main as any}/>
        <NavSecondary items={data(validOrgId).favorites as any} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavSecondary items={data(validOrgId).navSecondary} />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
