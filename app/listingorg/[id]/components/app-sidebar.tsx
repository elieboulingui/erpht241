"use client" // Marquer ce composant comme côté client

import * as React from "react"
import {
  Command,
  LifeBuoy,
  Send,
  Settings2,
} from "lucide-react"
import { useSession } from "next-auth/react" // Importation du hook useSession pour gérer la session

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

  // Si la session est en cours de chargement ou si la session est vide, on peut afficher un état de chargement ou une autre vue
  if (status === "loading") {
    return <div>Loading...</div> // Vous pouvez remplacer ce message par un loader si nécessaire
  }

  if (!session) {
    return <div>Please log in</div> // Si l'utilisateur n'est pas connecté, un message peut être affiché
  }

  const user = session.user

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.main} />
        <div className="pt-2">
          <NavMains items={data.favorites} />
        </div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* Passer directement la session utilisateur à NavUser */}
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
