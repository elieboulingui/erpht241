'use client'
import * as React from "react";
import { getorganisation } from "../action/getorganisation";  // Importer la fonction serveur
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Command, LifeBuoy, Home, Edit } from "lucide-react";
import { IoIosContacts } from "react-icons/io";
import { TiVendorMicrosoft } from "react-icons/ti";
import { SiAirtable } from "react-icons/si";
import { TbSettingsStar } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { useState, useEffect } from "react";

const data = {
  main: [
    { title: "Home", url: "#", icon: Home },
    { title: "Contact", url: "#", icon: IoIosContacts },
    { title: "Settings", url: "#", icon: TbSettingsStar },
  ],
  favorites: [
    { title: "Airtable", url: "#", icon: SiAirtable },
    { title: "Google", url: "#", icon: FcGoogle },
    { title: "Microsoft", url: "#", icon: TiVendorMicrosoft },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Edit },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogo, setOrgLogo] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listingorg\/([^\/]+)/);  // Capture l'ID de l'URL avec regex

    if (match && match[1]) {
      const orgId = match[1];
      // Appel à la fonction serveur getorganisation pour obtenir les informations
      getOrganisationData(orgId);
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
        <NavMain items={data.main as any} />
        <NavSecondary items={data.favorites as any} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavSecondary items={data.navSecondary as any} />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
