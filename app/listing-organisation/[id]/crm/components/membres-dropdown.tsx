"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MembresDropdownProps = {
  onMemberSelect?: (member: { id: string; name: string , image: string }) => void
}

export function MembresDropdown({ onMemberSelect }: MembresDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null)
  const [membresFiltres, setMembresFiltres] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const membresCache = useRef<Map<string, any[]>>(new Map())

  // Function to extract the organisationId from the URL
  const extractOrganisationId = useCallback(() => {
    const urlPath = window.location.pathname
    const match = urlPath.match(/listing-organisation\/([^/]+)/)
    return match ? match[1] : null
  }, [])

  const organisationId = extractOrganisationId()

  const fetchMembres = useCallback(async (orgId: string) => {
    if (membresCache.current.has(orgId)) {
      setMembresFiltres(membresCache.current.get(orgId) || [])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/member?organisationId=${orgId}`)
      const data = await res.json()
      if (res.ok) {
        setMembresFiltres(data)
        membresCache.current.set(orgId, data)
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
    if (isOpen && organisationId && !membresFiltres.length && !loading) {
      fetchMembres(organisationId)
    }
  }, [isOpen, organisationId, membresFiltres.length, loading, fetchMembres])

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
    ? membresFiltres.filter((membre) => membre.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : membresFiltres

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-black bg-[#e5e6ea] hover:bg-gray-300 hover:text-black "
          data-dropdown="membres"
        >
          <Users size={16} className="mr-2" />
          Commerciaux
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0 bg-white text-black border-black/15 border" sideOffset={5}>
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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 " />
            <Input
              ref={searchInputRef}
              placeholder="Rechercher des commerciaux..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#e5e6ea]/15 border-gray-600 text-black placeholder:text-black "
            />
          </div>

          <div>
            <h3 className="text-xs font-medium  mb-2">Commerciaux du tableau</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="text-sm text-gray-400 py-2 text-center">Chargement...</div>
              ) : filteredMembers.length > 0 ? (
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
                        isHighlighted ? "" : " hover:bg-gray-300"
                      }`}
                      onClick={() => {
                        if (onMemberSelect) {
                          onMemberSelect({ id: membre.id, name: membre.name, image: membre.image })
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
