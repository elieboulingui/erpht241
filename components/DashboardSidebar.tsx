"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { House } from 'lucide-react';
import { ShoppingBasket } from 'lucide-react';
import { IoMdContacts } from "react-icons/io";
import { getorganisation } from "../app/listingorg/[id]/action/getorganisation"; // Import the server-side function
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Command } from "lucide-react"; // Import Lucide icons
import { IoIosContacts } from "react-icons/io";
import { TiVendorMicrosoft } from "react-icons/ti";
import { SiAirtable } from "react-icons/si";
import { TbSettingsStar } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Plus, Edit } from "lucide-react"; // Import Lucide icons
import { NavMain } from "../app/listingorg/[id]/components/nav-main";
import { NavSecondary } from "../app/listingorg/[id]/components/nav-project";
import { NavUser } from "../app/listingorg/[id]/components/nav-user";
import { TeamSwitcher } from "../app/listingorg/[id]/components/team";

// For session data
import { useSession } from "next-auth/react";

// Define types for the icons used in the sidebar
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

type SidebarIcon = LucideIcon | IconType;

// Function to structure sidebar data based on orgId
const data = (orgId: string) => ({
  main: [
    {
      title: "Accueil",
      url: `/listingorg/${orgId}/`,
      icon: House,
      isActive: false,
      items: [],
    },
    {
      title: "Contact",
      url: `/listingorg/${orgId}/contact`,
      icon: IoMdContacts,
      isActive: false,
      items: [],
    },
    {
      title: "Produit",
      url: `/listingorg/${orgId}/produit/stock`,
      icon: ShoppingBasket,
      isActive: false,
      items: [],
    },
    {
      title: "Paramettre",
      url: `/listingorg/${orgId}/settings`,
      icon: TbSettingsStar,
      isActive: false,
      items: [],
    },
  
  ],
  favorites: [
    {
      title: "Airtable",
      url: "#",
      icon: SiAirtable,
      isActive: false,
      items: [],
    },
    { title: "Google", url: "#", icon: FcGoogle, isActive: false, items: [] },
    {
      title: "Microsoft",
      url: "#",
      icon: TiVendorMicrosoft,
      isActive: false,
      items: [],
    },
  ],
  navSecondary: [
    {
      title: "Invitation des members",
      url: `/listingorg/${orgId}/invite-member`,
      icon: Plus,
      isActive: false,
      items: [],
    },
    {
      title: "commentaire",
      url: `/listingorg/${orgId}/feedback`,
      icon: Edit,
      isActive: false,
      items: [],
    },
  ],
});

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession(); // Fetch session data (user name, email, avatar)
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null); // State for orgId

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/listingorg\/([^\/]+)/); // Capture orgId from the URL

    if (match && match[1]) {
      const id = match[1];
      setOrgId(id); // Set orgId
      getOrganisationData(id); // Fetch organization data
    }
  }, []);

  const getOrganisationData = async (orgId: string) => {
    try {
      const organisation = await getorganisation(orgId); // Fetch data
      setOrgName(organisation.name); // Set organization name
      setOrgLogo(organisation.logo); // Set organization logo (ensure it returns a component or image URL)
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  // If orgId is null, use a default value to avoid errors
  const validOrgId = orgId || "";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-white"
      variant="inset"
      {...props}
    >
      <SidebarHeader className="bg-white">
        <TeamSwitcher teams={[]} />{" "}
        {/* Replace with actual TeamSwitcher if necessary */}
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {/* Pass dynamic orgId to generate the menus */}
        <NavMain items={data(validOrgId).main as any} />
        <NavSecondary items={data(validOrgId).favorites as any} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <NavSecondary items={data(validOrgId).navSecondary} />
        {/* Pass session data to NavUser */}
        {session ? (
          <NavUser
            user={{
              name: session.user?.name || "Guest", // Fallback to "Guest" if no name is available
              email: session.user?.email || "", // Ensure email exists
              avatar: session.user?.image || "", // Ensure avatar exists (image URL)
            }}
          />
        ) : (
          <NavUser user={{ name: "Guest", email: "", avatar: "" }} /> // Fallback if no session data
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
