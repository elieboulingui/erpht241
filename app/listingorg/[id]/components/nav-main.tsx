"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { IconType } from "react-icons"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon | IconType
}

interface NavMainProps {
  items: NavItem[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            // Check if this is the home page (Accueil) and we're at the root path
            const isHome = item.title === "Accueil"
            const isRootPath =
              pathname.endsWith(`/${item.url.split("/").pop()}`) || pathname.endsWith(`/${item.url.split("/").pop()}/`)
            const isActive = pathname === item.url || (isHome && isRootPath)

            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild isActive={isActive} className={isActive ? "bg-gray-300" : ""}>
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className={isActive ? "font-bold" : ""}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

