import type React from "react"
import { User, Building2, Mail, MapPin, Phone } from "lucide-react"
import { Contact } from "@/contact"

interface PropertyItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function PropertyItem({ icon, label, value }: PropertyItemProps) {
  return (
    <div className="flex gap-14">
      <div className="w-20 text-gray-500 flex items-center">
        <span className="mr-2 text-gray-400">{icon}</span>
        {label}
      </div>
      <div className="flex-1 truncate">{value || "-"}</div>
    </div>
  )
}

interface ContactPropertiesProps {
  contact: Contact
}

export function ContactProperties({ contact }: ContactPropertiesProps) {
  return (
    <div className="space-y-3 text-sm">
      <PropertyItem icon={<User className="h-4 w-4 " />} label="Type" value={contact.status_contact} />
      <PropertyItem icon={<Building2 className="h-4 w-4" />} label="Secteur" value={contact.sector} />
      <PropertyItem icon={<Building2 className="h-4 w-4" />} label="Nom" value={contact.name} />
      <PropertyItem icon={<Mail className="h-4 w-4" />} label="Email" value={contact.email} />
      <PropertyItem icon={<Phone className="h-4 w-4" />} label="Téléphone" value={contact.phone} />
      <PropertyItem icon={<MapPin className="h-4 w-4" />} label="Adresse" value={contact.address} />
    </div>
  )
}

