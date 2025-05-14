"use client"

import { useState, useRef, useEffect } from "react"
import { X, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ContactsDropdownProps = {
  onContactSelect?: (contact: { id: string; name: string }) => void
}

export function ContactsDropdown({ onContactSelect }: ContactsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedContactId, setHighlightedContactId] = useState<string | null>(null)
  const [contactsFiltres, setContactsFiltres] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Filter contacts based on search query
  const filteredContacts = contactsFiltres.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-black hover:bg-gray-700 hover:text-white"
          data-dropdown="contacts"
        >
          <Users size={16} className="mr-2" />
          Clients
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0 bg-gray-800 text-white border-gray-700" sideOffset={5}>
        <div className="flex items-center justify-between border-b border-gray-700 p-3">
          <h2 className="text-sm font-medium">Clients</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="p-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Rechercher des clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">Clients disponibles</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => {
                  const isHighlighted = contact.id === highlightedContactId

                  return (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                        isHighlighted ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        if (onContactSelect) {
                          onContactSelect({ id: contact.id, name: contact.name })
                          setIsOpen(false)
                        }
                      }}
                    >
                      <Avatar className="h-8 w-8 bg-blue-600">
                        <AvatarFallback className="text-white uppercase">{contact.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.email}</p>
                      </div>
                      {isHighlighted && <span className="ml-auto text-xs text-blue-400">Édition</span>}
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-gray-400 py-2 text-center">Aucun contact trouvé</div>
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}