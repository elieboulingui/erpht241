"use client"

import { useState, useRef, useEffect } from "react"
import { X, Search, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MembresDropdownProps = {
  onMemberSelect?: (member: { id: string; name: string }) => void
}

export function MembresDropdown({ onMemberSelect }: MembresDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null)
  const [membresFiltres, setMembresFiltres] = useState<any[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Function to extract the organisationId from the URL
  const extractOrganisationId = () => {
    const urlPath = window.location.pathname
    const match = urlPath.match(/listing-organisation\/([^/]+)/)
    return match ? match[1] : null
  }

  const organisationId = extractOrganisationId()

  useEffect(() => {
    const fetchMembres = async () => {
      if (!organisationId) return

      try {
        const res = await fetch(`/api/member?organisationId=${organisationId}`)
        const data = await res.json()
        if (res.ok) {
          setMembresFiltres(data)
        } else {
          console.error("Erreur API :", data.error)
        }
      } catch (err) {
        console.error("Erreur réseau :", err)
      }
    }

    if (organisationId) {
      fetchMembres()
    }
  }, [organisationId])

  // Reset highlighted member when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setHighlightedMemberId(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const filteredMembers = searchQuery
    ? membresFiltres.filter((membre) => 
        membre.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : membresFiltres

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          data-dropdown="membres"
        >
          <Users size={16} className="mr-2" />
          Commerciaux
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0 bg-gray-800 text-white border-gray-700" sideOffset={5}>
        <div className="flex items-center justify-between border-b border-gray-700 p-3">
          <h2 className="text-sm font-medium">Commerciaux</h2>
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
              placeholder="Rechercher des commerciaux..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">Commerciaux du tableau</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((membre) => {
                  const initials = membre.name
                    ?.split(" ")
                    .map((part: string) => part[0])
                    .join("")
                    .toUpperCase()

                  const isHighlighted = membre.id === highlightedMemberId

                  return (
                    <div
                      key={membre.id}
                      className={`flex items-center gap-2 p-1 rounded-md cursor-pointer ${
                        isHighlighted ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        if (onMemberSelect) {
                          onMemberSelect({ id: membre.id, name: membre.name })
                          setIsOpen(false)
                        }
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        {membre.image ? (
                          <img
                            src={membre.image || "/placeholder.svg"}
                            alt={membre.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <AvatarFallback className="bg-blue-500 text-white">{initials}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm">{membre.name}</span>
                      {isHighlighted && <span className="ml-auto text-xs text-blue-400">Édition</span>}
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-gray-400 py-2 text-center">Aucun commercial trouvé</div>
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}