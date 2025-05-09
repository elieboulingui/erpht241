"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users } from "lucide-react"
import { useState, useEffect } from "react"

type ContactsDropdownProps = {
  onContactSelect?: (contact: { id: string; name: string }) => void
}

export function ContactsDropdown({ onContactSelect }: ContactsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedContactId, setHighlightedContactId] = useState<string | null>(null)
  const [contactsFiltres, setContactsFiltres] = useState<any[]>([])

  // Function to extract the organisationId from the URL
  const extractOrganisationId = () => {
    const urlPath = window.location.pathname
    const match = urlPath.match(/listing-organisation\/([^/]+)/)
    return match ? match[1] : null
  }

  const organisationId = extractOrganisationId()

  useEffect(() => {
    const fetchContacts = async () => {
      if (!organisationId) return

      try {
        const res = await fetch(`/api/contact?organisationId=${organisationId}`)
        const data = await res.json()
        if (res.ok) {
          setContactsFiltres(data)
        } else {
          console.error("Erreur API :", data.error)
        }
      } catch (err) {
        console.error("Erreur réseau :", err)
      }
    }

    if (organisationId) {
      fetchContacts()
    }
  }, [organisationId])

  // Reset highlighted contact when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setHighlightedContactId(null)
    }
  }, [isOpen])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          data-dropdown="contacts"
        >
          <Users size={16} className="mr-2" />
          Contacts
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <div className="flex flex-col gap-1 p-2">
          {contactsFiltres.map((contact) => {
            const isHighlighted = contact.id === highlightedContactId

            return (
              <div
                key={contact.id}
                className={`flex flex-col p-2 rounded-md cursor-pointer ${
                  isHighlighted ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => {
                  if (onContactSelect) {
                    onContactSelect({ id: contact.id, name: contact.name })
                    setIsOpen(false)
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-blue-600">
                    <AvatarFallback className="text-white uppercase">{contact.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-400">{contact.email}</p>
                  </div>
                  {isHighlighted && <span className="ml-auto text-xs text-blue-400">Édition</span>}
                </div>
              </div>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
