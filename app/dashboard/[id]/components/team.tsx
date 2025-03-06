import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { GetOrganisation } from "@/app/api/getOrganisation/route"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType // Ensure logo is a React component
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [orgName, setOrgName] = useState<string | null>(null)
  const [orgLogo, setOrgLogo] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null) // State for orgId

  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/\/listingorg\/([^\/]+)/) // Capture orgId from the URL

    if (match && match[1]) {
      const id = match[1]
      setOrgId(id) // Set orgId
      getOrganisationData(id) // Fetch organization data
    }
  }, [])

  const getOrganisationData = async (orgId: string) => {
    try {
      const organisation = await GetOrganisation(orgId) // Fetch data
      setOrgName(organisation.name)  // Set organization name
      setOrgLogo(organisation.logo)  // Set organization logo (ensure it returns a component or image URL)
    } catch (error) {
      console.error("Error fetching organization data:", error)
    }
  }

  // If orgId is null, use a default value to avoid errors
  const validOrgId = orgId || ""

  // Ensure that teams is not empty and set a default active team
  const [activeTeam, setActiveTeam] = React.useState(teams[0] || { name: "", logo: () => null, plan: "" })
  
  // Check if the logo is valid before rendering it
  const renderLogo = (logo: React.ElementType) => {
    return logo ? React.createElement(logo, { className: "size-4" }) : null;
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* Render organization logo or default if not set */}
                {orgLogo ? (
                  <img src={orgLogo} alt={orgName || "Organization"} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    {orgName ? orgName.charAt(0) : "O"}
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {orgName || "Organization"}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {/* Render each team's logo */}
                  {renderLogo(team.logo)}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
