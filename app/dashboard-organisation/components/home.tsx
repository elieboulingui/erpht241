"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Users, Settings, Plus, MessageSquare, ChevronDown, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="font-semibold text-xl">samba</span>
            <ChevronDown className="h-4 w-4" />
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg bg-gray-100">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/contacts" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <Users className="h-5 w-5" />
              <span>Contacts</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Favorites</h3>
            <div className="space-y-2">
              {["Airbnb", "Google", "Microsoft"].map((company) => (
                <Link
                  key={company}
                  href={`/company/${company.toLowerCase()}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-5 h-5 rounded bg-gray-200" />
                  <span>{company}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Invite member
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
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
              <div className="text-sm text-gray-500">Jan 22, 2025 - Feb 21, 2025</div>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Overview</span>
            </div>
          </div>

          {/* Lead Generation Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Lead generation</CardTitle>
              <p className="text-sm text-gray-500">New contacts added to the pool.</p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">People</div>
                  <div className="text-2xl font-semibold">3</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Companies</div>
                  <div className="text-2xl font-semibold">0</div>
                </div>
              </div>

              {/* Graph */}
              <div className="mt-8 flex items-end justify-between h-48">
                {["Jan 21", "Jan 22", "Jan 29"].map((date) => (
                  <div key={date} className="w-1/4">
                    <div className="bg-[#E76F51] h-32 rounded" />
                    <div className="text-sm text-gray-500 mt-2 text-center">{date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Stats */}
          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Most visited contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Adobe", visits: 11 },
                    { name: "Airbnb", visits: 7 },
                    { name: "AMD", visits: 4 },
                    { name: "Google", visits: 4 },
                    { name: "Microsoft", visits: 3 },
                    { name: "Beatrice Richter", visits: 2 },
                  ].map((contact) => (
                    <div key={contact.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-200" />
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
                  {["United Airlines", "Amazon", "Dropbox", "Apple", "Intercom", "Spotify"].map((company) => (
                    <div key={company} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-200" />
                        <span>{company}</span>
                      </div>
                      <span>0</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

