"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Users, Settings, Plus, MessageSquare, ChevronDown, Info } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

const visitedContacts = [
  { name: "Adobe", visits: 11, logo: "A" },
  { name: "Airbnb", visits: 7, logo: "A" },
  { name: "AMD", visits: 4, logo: "A" },
  { name: "Google", visits: 4, logo: "G" },
  { name: "Microsoft", visits: 3, logo: "M" },
  { name: "Beatrice Richter", visits: 2, logo: "BR" },
]

const leastVisitedContacts = [
  { name: "United Airlines", visits: 0, logo: "UA" },
  { name: "Amazon", visits: 0, logo: "A" },
  { name: "Dropbox", visits: 0, logo: "D" },
  { name: "Apple", visits: 0, logo: "A" },
  { name: "Intercom", visits: 0, logo: "I" },
  { name: "Spotify", visits: 0, logo: "S" },
]

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Ensure it's client-side only
  }, [])

  if (!isClient) {
    return null // Avoid rendering the component until it's client-side
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-gray-50">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 mb-8">
              <span className="font-semibold text-xl">samba</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contacts">
                    <Users className="h-5 w-5" />
                    <span>Contacts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Favorites</h3>
              <SidebarMenu>
                {["Airbnb", "Google", "Microsoft"].map((company) => (
                  <SidebarMenuItem key={company}>
                    <SidebarMenuButton asChild>
                      <Link href={`/contacts/${company.toLowerCase()}`}>
                        <div className="w-5 h-5 rounded bg-gray-200" />
                        <span>{company}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite member
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Feedback
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className=" w-full flex flex-col h-full">
  <div className="p-8 flex flex-col flex-grow h-full">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">1d</SelectItem>
            <SelectItem value="3d">3d</SelectItem>
            <SelectItem value="7d">7d</SelectItem>
            <SelectItem value="30d">30d</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-500">
          Jan 22, 2025 - Feb 21, 2025
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-gray-400" />
        <span className="text-sm">Overview</span>
      </div>
    </div>

    {/* Lead Generation Card */}
    <Card className="mb-8 flex-grow">
      <CardHeader>
        <CardTitle>Lead generation</CardTitle>
        <p className="text-sm text-gray-500">New contacts added to the pool.</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <div className="text-2xl font-semibold">3</div>
            <div className="text-sm text-gray-500">People</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">0</div>
            <div className="text-sm text-gray-500">Companies</div>
          </div>
        </div>

        {/* Graph */}
        <div className="flex items-end justify-between h-48 gap-4">
          {["Jan 21", "Jan 22", "Jan 29"].map((date) => (
            <div key={date} className="flex-1">
              <div className="bg-[#E76F51] h-32 rounded-md" />
              <div className="text-sm text-gray-500 mt-2 text-center">{date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Contact Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Most visited contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visitedContacts.map((contact) => (
              <div key={contact.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs">
                    {contact.logo}
                  </div>
                  <span>{contact.name}</span>
                </div>
                <span>{contact.visits}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Least visited contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leastVisitedContacts.map((contact) => (
              <div key={contact.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs">
                    {contact.logo}
                  </div>
                  <span>{contact.name}</span>
                </div>
                <span>{contact.visits}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</main>

      </div>
    </SidebarProvider>
  )
}
