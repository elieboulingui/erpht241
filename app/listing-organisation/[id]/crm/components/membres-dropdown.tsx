"use client"

import { Users } from "lucide-react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MembresDropdownProps = {
  onMemberSelect?: (member: { id: string; name: string }) => void
}

export function MembresDropdown({ onMemberSelect }: MembresDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null)
  const [membresFiltres, setMembresFiltres] = useState<any[]>([])

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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          data-dropdown="membres"
        >
          <Users size={16} className="mr-2" />
          Membres
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {membresFiltres.map((membre) => {
          const initials = membre.name
            ?.split(" ")
            .map((part: any[]) => part[0])
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
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
