"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import ContactItem from "./ContactItem"

interface Contact {
  name: string
  visits: number
  icon: string
  trend: string
}

interface ContactsSectionProps {
  title: string
  description: string
  contacts: Contact[]
  variant: "high" | "low"
  icon: LucideIcon
}

export default function ContactsSection({ title, description, contacts, variant, icon: Icon }: ContactsSectionProps) {
  const isHigh = variant === "high"

  return (
    <Card
      className={`overflow-hidden border-0  w-full ${
        isHigh ? "bg-gradient-to-br from-white to-gray-50" : "bg-[#e6e7eb]"
      }`}
    >
      <CardHeader
        className={`${isHigh ? "bg-gradient-to-r from-[#591112] to-[#7a1419] text-white" : "bg-[#e6e7eb] text-black"}`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className={isHigh ? "text-white/80" : "text-black"}>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <ContactItem
              key={contact.name}
              name={contact.name}
              visits={contact.visits}
              icon={contact.icon}
              trend={contact.trend}
              variant={variant}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
