"use client"

import * as React from "react"
import { Command, LifeBuoy, Home, Edit } from "lucide-react";
 // Icônes Lucide
import { IoIosContacts } from "react-icons/io";
import { TiVendorMicrosoft } from "react-icons/ti";
import { SiAirtable } from "react-icons/si";
import { TbSettingsStar } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc"


import { NavMain } from "./nav-main"

import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
const data = {
    main: [
      {
        title: "Home",
        url: "#",
        icon: Home, // Lucide icon
      },
      {
        title: "Contact",
        url: "#",
        icon: IoIosContacts, // React Icons
      },
      {
        title: "Settings",
        url: "#",
        icon: TbSettingsStar, // Lucide icon
      },
    ],
    favorites: [
      {
        title: "Airtable",
        url: "#",
        icon: SiAirtable, // Lucide icon
      },
      {
        title: "Google",
        url: "#",
        icon: FcGoogle, // React Icons
      },
      {
        title: "Microsoft",
        url: "#",
        icon: TiVendorMicrosoft, // React Icons
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy, // Lucide icon
      },
      {
        title: "Feedback",
        url: "#",
        icon: Edit, // Lucide icon
      },
    ],
  }

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r bg-white" variant="inset" {...props}>
      <SidebarHeader className="bg-white">
        <SidebarMenu className="bg-white">
          <SidebarMenuItem className="bg-white">
            <SidebarMenuButton className="bg-white" size="lg" asChild>
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
      <SidebarContent className="bg-white">
        <NavMain items={data.main as any} />
        <NavSecondary items={data.favorites as any} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
      <NavSecondary items={data.navSecondary as any} />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
