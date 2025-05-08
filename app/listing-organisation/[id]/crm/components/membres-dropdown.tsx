"use client"

import { useState, useRef, useEffect } from "react"
import { X, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Données d'exemple pour les membres
const membresInitiaux = [
  { id: "1", nom: "jo nath", initiales: "JN", couleur: "bg-orange-500" },
  { id: "2", nom: "Marie Dupont", initiales: "MD", couleur: "bg-blue-500" },
  { id: "3", nom: "Pierre Martin", initiales: "PM", couleur: "bg-green-500" },
  { id: "4", nom: "Sophie Lefebvre", initiales: "SL", couleur: "bg-purple-500" },
]

export function MembresDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [membres, setMembres] = useState(membresInitiaux)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filtrer les membres en fonction de la recherche
  const membresFiltres = membres.filter((membre) => membre.nom.toLowerCase().includes(searchQuery.toLowerCase()))

  // Focus sur le champ de recherche quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
          <Users size={16} className="mr-2" />
          Membres
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0 bg-gray-800 text-white border-gray-700" sideOffset={5}>
        <div className="flex items-center justify-between border-b border-gray-700 p-3">
          <h2 className="text-sm font-medium">Membres</h2>
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
              placeholder="Rechercher des membres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">Membres du tableau</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {membresFiltres.map((membre) => (
                <div
                  key={membre.id}
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-700 cursor-pointer"
                >
                  <Avatar className={`h-8 w-8 ${membre.couleur}`}>
                    <AvatarFallback className="text-white">{membre.initiales}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{membre.nom}</span>
                </div>
              ))}
              {membresFiltres.length === 0 && (
                <div className="text-sm text-gray-400 py-2 text-center">Aucun membre trouvé</div>
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
