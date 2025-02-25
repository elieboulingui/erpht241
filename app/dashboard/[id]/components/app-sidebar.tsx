"use client"
import * as React from "react"
import { IoIosContacts } from "react-icons/io";
import { TiVendorMicrosoft } from "react-icons/ti";
import { SiAirtable } from "react-icons/si";
import { TbSettingsStar } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc" // Icône de react-icons
import { useSession } from "next-auth/react" // Gestion de la session
import { useEffect, useState } from "react" // Effets de bord
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar" // Composants Sidebar
import { NavUser } from "./nav-user" // Composant NavUser
import { NavMain } from "./nav-main" // Composant NavMain
import { NavSecondary } from "./nav-secondary" // Composant NavSecondary
import { NavMains } from "./nav-mains" // Composant NavMains
import { Command, LifeBuoy, Send, Settings2, Home, MessageSquare, Shield, Edit } from "lucide-react" // Icônes Lucide
 // Fonction pour récupérer l'organisation

// Importation du type LucideIcon
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons"
import { getorganisation } from "../action/getorganisation";

// Définir un type d'icône générique qui accepte aussi bien des icônes Lucide que react-icons
type Icon = React.ComponentType<any> | IconType | LucideIcon | string

const data = {
  main: [
    {
      title: "Home",
      url: "#",
      icon: Home, // Icône Lucide
    },
    {
      title: "contact",
      url: "#",
      icon: IoIosContacts, // Icône Lucide
    },
    {
      title: "Settings",
      url: "#",
      icon: TbSettingsStar, // Icône Lucide
    },
  ],
  favorites: [
    {
      title: "Airtable",
      url: "#",
      icon: SiAirtable, // Icône Lucide
    },
    {
      title: "Google",
      url: "#",
      icon: FcGoogle, // Icône react-icons
    },
    {
      title: "Microsoft",
      url: "#",
      icon: TiVendorMicrosoft , // Apply blue color inline
    }
    
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy, // Icône Lucide
    },
    {
      title: "Feedback",
      url: "#",
      icon: Edit, // Icône Lucide
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession() // Récupérer la session
  const [organisationData, setOrganisationData] = useState<any>(null)

  // Utilisation de useEffect pour récupérer l'organisation lors du montage
  useEffect(() => {
    const fetchOrganisation = async () => {
      const url = window.location.href
      const regex = /\/listingorg\/([a-zA-Z0-9]+)$/
      const match = url.match(regex)

      if (match && match[1]) {
        try {
          const response = await getorganisation(match[1])
          setOrganisationData(response)
        } catch (error) {
          console.error("Erreur lors de l'appel à getorganisation:", error)
        }
      }
    }

    fetchOrganisation() // Appel de la fonction au montage du composant
  }, [])

  if (status === "loading") {
    return <div>Loading...</div> // Affichage lors du chargement de la session
  }

  if (!session) {
    return <div>Please log in</div> // Affichage si non connecté
  }

  const user = session.user // Récupérer les données de l'utilisateur

  return (
    <Sidebar variant="inset" {...props}>
      {/* En-tête de la sidebar */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {organisationData?.logo ? (
                    <img
                      src={organisationData.logo}
                      alt="Organisation Logo"
                      className="object-cover h-10 w-10 rounded-full"
                    />
                  ) : (
                    <Command className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {organisationData?.name || 'Acme Inc'}
                  </span>
                  <span className="truncate text-xs">
                    {organisationData?.type || 'Enterprise'}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenu de la sidebar */}
      <SidebarContent>
        {/* Menu principal */}
        <NavMain items={data.main as any} />

        {/* Menu des favoris */}
        {organisationData ? (
          <div className="pt-2">
            <NavMains items={organisationData.favorites || data.favorites} />
          </div>
        ) : (
          <div className="pt-2">
            <NavMains items={data.favorites as any} />
          </div>
        )}

        {/* Menu secondaire */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* Footer de la sidebar */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
