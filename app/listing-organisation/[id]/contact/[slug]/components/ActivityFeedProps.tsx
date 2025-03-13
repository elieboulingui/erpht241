import type React from "react"
import { Clock } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Contact } from "@/contact"

interface ActivityFeedProps {
  contact: Contact
  comments: Array<{ id: string; text: string; user: string; timestamp: Date }>
}

export function ActivityFeed({ contact, comments }: ActivityFeedProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "quelques secondes"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} heure${hours > 1 ? "s" : ""}`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} jour${days > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="space-y-6">
      <ActivityEntry user="Gabin Moundziegou" action="a créé le contact." timestamp="il y a environ 1 mois">
        <ActivityItem contact={contact} />
      </ActivityEntry>

      {comments.map((comment) => (
        <ActivityEntry
          key={comment.id}
          user={comment.user}
          action="a commenté"
          timestamp={`il y a ${formatTimeAgo(comment.timestamp)}`}
        >
          <div className="p-3 bg-gray-50 rounded-md">{comment.text}</div>
        </ActivityEntry>
      ))}
    </div>
  )
}

interface ActivityEntryProps {
  user: string
  action: string
  timestamp: string
  children: React.ReactNode
}

function ActivityEntry({ user, action, timestamp, children }: ActivityEntryProps) {
  return (
    <div className="flex">
      <Avatar className="h-10 w-10 bg-gray-200 p-2 mr-2">
        {user
          .split(" ")
          .map((name) => name[0])
          .join("")}
      </Avatar>
      <div className="flex-1">
        <div className="text-sm mt-2">
          <span className="font-medium">{user}</span> {action}
        </div>
        <div className="mt-4">{children}</div>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          {timestamp}
        </div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  contact: Contact
}

function ActivityItem({ contact }: ActivityItemProps) {
  return (
    <Card className="rounded-lg border p-4 space-y-2">
      <div className="space-y-3">
        <FormField label="Nom">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.name || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Étiquettes">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input
            value={contact.tags.length ? contact.tags.join(",") : "-"}
            readOnly
            className="bg-white w-1/2 h-8"
            title={contact.tags.join(", ")}
          />
        </FormField>

        <FormField label="Email">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.email || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Image">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input
            value={contact.logo || "Pas d'image"}
            readOnly
            className="bg-white w-1/2 h-8"
            title={contact.logo || "Pas d'image"}
          />
        </FormField>

        <FormField label="Téléphone">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.phone || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Étape">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.niveau || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Adresse">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.address || "-"} readOnly className="bg-white w-1/2 h-8" title={contact.address} />
        </FormField>
      </div>
    </Card>
  )
}

interface FormFieldProps {
  label: string
  children: React.ReactNode
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-500 font-normal">{label}</label>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}

function FormArrow() {
  return <span className="text-gray-400 mx-1">→</span>
}

