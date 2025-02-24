"use client"

import * as React from "react"
import { useSession } from "next-auth/react" // Importation du hook useSession pour gérer la session
import { useEffect, useState } from "react" // Utilisation de useEffect pour les effets de bord
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user" // Assurez-vous que le chemin est correct
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavMains } from "./nav-mains"
import { Command, LifeBuoy, Send, Settings2 } from "lucide-react"
import { getorganisation } from "../action/getorganisation"

const data = {
  main: [
    {
      title: "home",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "contact",
      url: "#",
      icon: Send,
    },
    {
      title: "setting",
      url: "#",
      icon: Settings2,
    },
  ],
  favorites: [
    {
      title: "home",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "contact",
      url: "#",
      icon: Send,
    },
    {
      title: "setting",
      url: "#",
      icon: Send,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Utilisation du hook useSession pour obtenir les données de session
  const { data: session, status } = useSession()
  
  // État local pour stocker les données récupérées de l'organisation
  const [organisationData, setOrganisationData] = useState<any>(null)

  // Utilisation de useEffect pour extraire l'ID via regex une fois que le composant est monté
  useEffect(() => {
    // Fonction asynchrone pour gérer l'appel à `getorganisation`
    const fetchOrganisation = async () => {
      // L'URL de la page
      const url = window.location.href;

      // Regex pour extraire l'ID de l'URL, ici après `/listingorg/`
      const regex = /\/listingorg\/([a-zA-Z0-9]+)$/;
      const match = url.match(regex);

      // Si un ID est trouvé, on appelle getorganisation et attend la réponse
      if (match && match[1]) {
        console.log("ID extrait de l'URL:", match[1]);
        try {
          // Appel de la fonction getorganisation et attente de la réponse
          const response = await getorganisation(match[1]);
          setOrganisationData(response); // Stockage des données dans l'état local
        } catch (error) {
          console.error("Erreur lors de l'appel à getorganisation:", error);
        }
      } else {
        console.log("Aucun ID trouvé dans l'URL");
      }
    }

    // Appel de la fonction asynchrone
    fetchOrganisation();
  }, []); // Le tableau vide [] signifie que cela s'exécute une seule fois lors du montage

  // Si la session est en cours de chargement ou si la session est vide, on peut afficher un état de chargement ou une autre vue
  if (status === "loading") {
    return <div>Loading...</div> // Vous pouvez remplacer ce message par un loader si nécessaire
  }

  if (!session) {
    return <div>Please log in</div> // Si l'utilisateur n'est pas connecté, un message peut être affiché
  }

  const user = session.user

  // Rendu du sidebar
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {/* Affichage du logo si disponible, sinon une icône par défaut */}
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
                  {/* Affichage conditionnel du nom et type de l'organisation */}
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

      <SidebarContent>
        {/* Affichage des menus statiques ou dynamiques en fonction des données */}
        <NavMain items={data.main} />

        {organisationData ? (
          <div className="pt-2">
            <NavMains items={organisationData.favorites || data.favorites} />
          </div>
        ) : (
          <div className="pt-2">
            {/* Si organisationData est null, afficher un menu par défaut */}
            <NavMains items={data.favorites} />
          </div>
        )}

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
