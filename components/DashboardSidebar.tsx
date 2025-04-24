"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { HomeIcon as House, ShoppingBasket, Plus, Edit, ChevronDown } from "lucide-react"
import { IoMdContacts } from "react-icons/io"
import { TbCategory, TbSettingsStar } from "react-icons/tb"
import { NavMain } from "../app/listing-organisation/[id]/components/nav-main"
import { NavSecondary } from "../app/listing-organisation/[id]/components/nav-project"
import { NavUser } from "../app/listing-organisation/[id]/components/nav-user"
import { TeamSwitcher } from "../app/listing-organisation/[id]/components/team"
import { useSession } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

// Define types for the icons used in the sidebar
import type { LucideIcon } from "lucide-react"
import type { IconType } from "react-icons"
import { Favorites } from "@/app/listing-organisation/[id]/components/nav-favorite"
import { FaHandshake } from "react-icons/fa6"

type SidebarIcon = LucideIcon | IconType

const data = (orgId: string, currentPath: string) => {
  const isRootPath =
    currentPath === `/listing-organisation/${orgId}/` || currentPath === `/listing-organisation/${orgId}`

  return {
    main: [
      {
        title: "Accueil",
        url: `/listing-organisation/${orgId}/`,
        icon: House,
        isActive: isRootPath,
        items: [],
      },
      {
        title: "Contact",
        url: `/listing-organisation/${orgId}/contact`,
        icon: IoMdContacts,
        isActive: false,
        items: [],
      },
      {
        title: "Produit",
        url: `/listing-organisation/${orgId}/produit`,
        icon: ShoppingBasket,
        isActive: false,
        items: [
          {
            title: "Produits",
            url: `/listing-organisation/${orgId}/produit`,
            icon: ShoppingBasket,
            isActive: false,
          },
          {
            title: "Catégories",
            url: `/listing-organisation/${orgId}/produit/categorie`,
            icon: TbCategory,
            isActive: false,
          }, 
          {
            title: "Attributs",
            url: `/listing-organisation/${orgId}/produit/attributs`,
            icon: TbSettingsStar,
            isActive: false,
          },
          {
            title: "Marques",
            url: `/listing-organisation/${orgId}/produit/marque`,
            icon: ShoppingBasket,
            isActive: false,
          },
          {
            title: "Stock",
            url: `/listing-organisation/${orgId}/produit/stock`,
            icon: ShoppingBasket,
            isActive: false,
          },
        ],
      },
      {
        title: "Paramètre",
        url: `/listing-organisation/${orgId}/settings`,
        icon: TbSettingsStar,
        isActive: false,
        items: [
          {
            title: "Organisation",
            url: `/listing-organisation/${orgId}/settings/organisation`,
            icon: TbSettingsStar,
            isActive: false,
          },
          {
            title: "Equipe",
            url: `/listing-organisation/${orgId}/settings/equipe`,
            icon: IoMdContacts,
            isActive: false,
          },
          {
            title: "Veille Concurentielle",
            url: `/listing-organisation/${orgId}/settings/veille`,
            icon: TbSettingsStar,
            isActive: false,
          },
          {
            title: "Logs",
            url: `/listing-organisation/${orgId}/settings/logs`,
            icon: TbSettingsStar,
            isActive: false,
          },
        ],
      },
      {
        title: "CRM",
        url: `/listing-organisation/${orgId}/crm`,
        icon: FaHandshake,
        isActive: false,
        items: [],
      },
    ],
    navSecondary: [
      {
        title: "Invitation des membres",
        url: `/listing-organisation/${orgId}/invite-member`,
        icon: Plus,
        isActive: false,
        items: [],
      },
      {
        title: "Commentaire",
        url: `/listing-organisation/${orgId}/feedback`,
        icon: Edit,
        isActive: false,
        items: [],
      },
    ],
  }
}

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()
  const [orgName, setOrgName] = useState<string | null>(null)
  const [orgLogo, setOrgLogo] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const match = pathname.match(/\/listing-organisation\/([^/]+)/)

    if (match && match[1]) {
      const id = match[1]
      setOrgId(id)
      getOrganisationData(id)

      const isRootPath = pathname === `/listing-organisation/${id}/` || pathname === `/listing-organisation/${id}`
      if (isRootPath) {
        setActiveItem("Accueil")
      }
    }

    if (pathname.includes("/produit")) {
      setIsProductMenuOpen(true)
      if (pathname.includes("/categorie")) {
        setActiveItem("Catégories")
      } else {
        setActiveItem("Produits")
      }
    }

    if (pathname.includes("/settings")) {
      setIsSettingsMenuOpen(true)
    }
  }, [pathname])

  const getOrganisationData = async (orgId: string) => {
    try {
      const response = await fetch(`/api/getOrganisation?id=${orgId}`)
      const organisation = await response.json()
      if (response.ok) {
        setOrgName(organisation.name)
        setOrgLogo(organisation.logo)
      } else {
        console.error(organisation.error)
      }
    } catch (error) {
      console.error("Error fetching organization data:", error)
    }
  }

  const validOrgId = orgId || ""
  const sidebarData = data(validOrgId, pathname)

  const isProductActive = pathname.includes("/produit")
  const isSettingsActive = pathname.includes("/settings")

  const ProductMenu = () => {
    return (
      <SidebarMenu>
        <Collapsible open={isProductMenuOpen} onOpenChange={setIsProductMenuOpen} className="w-full">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className={isProductActive ? "bg-gray-300" : ""}>
                <ShoppingBasket />
                <span>Catalogue</span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${isProductMenuOpen ? "rotate-180" : ""}`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {sidebarData.main[2].items.map((item, index) => (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === item.url}
                      className={pathname === item.url ? "bg-gray-300" : ""}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    )
  }

  const SettingsMenu = () => {
    return (
      <SidebarMenu>
        <Collapsible open={isSettingsMenuOpen} onOpenChange={setIsSettingsMenuOpen} className="w-full">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className={isSettingsActive ? "bg-gray-300" : ""}>
                <TbSettingsStar />
                <span>Paramètre</span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 transition-transform ${isSettingsMenuOpen ? "rotate-180" : ""}`}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {sidebarData.main[3].items.map((item, index) => (
                  <SidebarMenuSubItem key={index}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === item.url}
                      className={pathname === item.url ? "bg-gray-300" : ""}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    )
  }

  return (
    <Sidebar collapsible="icon" className="border-r bg-white" variant="inset" {...props}>
      <SidebarHeader className="bg-white">
        <TeamSwitcher teams={[]} />
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <NavMain
          items={sidebarData.main.filter((item) => item.title !== "Produit" && item.title !== "Paramètre") as any}
        />
        <ProductMenu />
        <SettingsMenu />
        <Favorites items={[]} />
      </SidebarContent>

      <SidebarFooter className="bg-white">
        <NavSecondary items={sidebarData.navSecondary} />
        {session ? (
          <NavUser
            user={{
              name: session.user?.name || "HT241",
              email: session.user?.email || "",
              avatar: session.user?.image || "",
            }}
          />
        ) : (
          <NavUser user={{ name: "HT241", email: "", avatar: "" }} />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}