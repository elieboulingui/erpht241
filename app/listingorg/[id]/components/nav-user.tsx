"use client" // Mark this as a client-side component

import * as React from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react" // Importation du hook useSession et de signOut

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Typing pour le user depuis NextAuth
interface User {
  name: string
  email: string
  image: string | null
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession() // Utilisation de useSession pour récupérer la session

  // Si la session est en cours de chargement, on peut afficher un état de chargement
  if (status === "loading") {
    return <div>Loading...</div> // Vous pouvez remplacer par un loader si nécessaire
  }

  // Si l'utilisateur n'est pas connecté, on affiche un message ou un autre composant
  if (!session) {
    return <div>Please log in</div>
  }

  const user: User = session.user // Récupère l'utilisateur à partir de la session

  // Fonction pour gérer la déconnexion
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }) // Redirection après la déconnexion
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Avatar de l'utilisateur */}
              <Avatar className="h-8 w-8 rounded-lg">
                {/* Affichage de l'image de l'utilisateur ou image par défaut */}
                <AvatarImage src={user?.image || "/default-avatar.jpg"} alt={user?.name} />
                {/* Si l'image est manquante, afficher l'initiale du nom */}
                <AvatarFallback className="rounded-lg">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {/* Avatar de l'utilisateur dans le menu déroulant */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || "/default-avatar.jpg"} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">{user?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
