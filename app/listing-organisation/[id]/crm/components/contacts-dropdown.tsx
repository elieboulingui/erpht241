"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const contactsCache = useRef<Map<string, any[]>>(new Map())

  // Function to extract the organisationId from the URL
  const extractOrganisationId = useCallback(() => {
    const urlPath = window.location.pathname
    const match = urlPath.match(/listing-organisation\/([^/]+)/)
    return match ? match[1] : null
  }, [])

  const organisationId = extractOrganisationId()

  const fetchContacts = useCallback(async (orgId: string) => {
    if (contactsCache.current.has(orgId)) {
      setContactsFiltres(contactsCache.current.get(orgId) || [])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/contact?organisationId=${orgId}`)
      const data = await res.json()
      if (res.ok) {
        setContactsFiltres(data)
        contactsCache.current.set(orgId, data)
      } else {
        console.error("Erreur API :", data.error)
      }
    } catch (err) {
      console.error("Erreur réseau :", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen && organisationId && !contactsFiltres.length && !loading) {
      fetchContacts(organisationId)
    }
  }, [isOpen, organisationId, contactsFiltres.length, loading, fetchContacts])

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
          className="w-full justify-start text-black bg-[#e5e6ea] hover:bg-gray-300 hover:text-black "
          data-dropdown="contacts"
        >
          <Users size={16} className="mr-2" />
          Clients
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0 bg-white text-black border-black/15 border" sideOffset={5}>
        <div className="flex items-center justify-between border-b border-gray-700 p-3">
          <h2 className="text-sm font-medium">Clients</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 "
          >
            <X size={16} />
          </Button>
        </div>

        <div className="p-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black" />
            <Input
              ref={searchInputRef}
              placeholder="Rechercher des clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#e5e6ea]/15 border-gray-600 text-black placeholder:text-black "
            />
          </div>

          <div>
            <h3 className="text-xs font-medium text-black mb-2">Clients disponibles</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="text-sm text-gray-400 py-2 text-center">Chargement...</div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => {
                  const isHighlighted = contact.id === highlightedContactId

                  return (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                        isHighlighted ? "" : " hover:bg-gray-300"
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
                <div className="text-sm text-gray-400 py-2 text-center">Aucun client trouvé</div>
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
