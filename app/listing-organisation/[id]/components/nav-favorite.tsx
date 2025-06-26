"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, X, Star, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { addFavorite } from "../action/addfavorite"
import { removeFavorite } from "../action/removeFavorite"
import { listFavorites } from "../action/listFavorites"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  email: string
  avatar?: string
  logo?: string
}

interface FavoriteItem {
  title: string
  url: string
  logo?: string
  isActive: boolean
  items: any[]
}

interface FavoritesProps {
  items: FavoriteItem[]
}

export function Favorites({ items: initialItems }: FavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [organisationId, setOrganisationId] = useState<string | null>(null)

  const fetchContacts = async (organisationId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // Utilisation de l'endpoint pour récupérer les contacts d'une organisation
      const response = await fetch(`/api/getContactsByOrganisationId?organisationId=${organisationId}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || 'Échec de la récupération des contacts'
        )
      }
      
      const data = await response.json()
      setContacts(Array.isArray(data) ? data : [])
      return data
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error)
      setError(
        error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors du chargement des contacts"
      )
      toast.error("Erreur lors du chargement des contacts")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchContactsData = async () => {
      const orgId = organisationId
      if (orgId) {
        const contactsData = await fetchContacts(orgId)
        if (contactsData) {
          console.log("Contacts chargés:", contactsData)
        }
      }
    }

    fetchContactsData()
  }, [organisationId])

  useEffect(() => {
    const fetchFavoritesData = async () => {
      try {
        const url = window.location.href;
        const match = url.match(/\/listing-organisation\/([^/]+)/);
        if (!match) return;
        
        const orgId = match[1];
        setOrganisationId(orgId);

        // Fetch contacts - Utilisation du même endpoint que dans fetchContacts
        await fetchContacts(orgId);

        // Fetch favorites using the server action
        const favoritesResult = await listFavorites(orgId);
        if (favoritesResult.success) {
          setFavorites(favoritesResult.data as any);
        } else {
          console.error("Erreur lors de la récupération des favoris:", favoritesResult.error);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Une erreur est survenue lors du chargement des données");
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchFavoritesData()
  }, [])

  const addToFavorites = async (contact: Contact) => {
    if (!organisationId) {
      console.error("Organisation ID non défini.")
      toast.error("Impossible d'ajouter aux favoris: organisation non définie")
      return
    }

    try {
      const result = await addFavorite(contact.id, organisationId)
      
      if (result && result.success) {
        const newFavorite: FavoriteItem = {
          title: contact.name,
          url: `/listing-organisation/${organisationId}/contact/${contact.id}`,
          logo: contact.logo || undefined,
          isActive: false,
          items: [],
        }

        if (!favorites.some((fav) => fav.title === contact.name)) {
          setFavorites([...favorites, newFavorite])
          toast.success("Contact ajouté aux favoris")
        } else {
          toast.info("Ce contact est déjà dans vos favoris")
        }
      } else {
        throw new Error(result?.error || "Erreur inconnue lors de l'ajout aux favoris")
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error)
      toast.error("Erreur lors de l'ajout aux favoris")
    }
  }

  const removeFromFavorites = async (contactTitle: string) => {
    const contact = contacts.find((c) => c.name === contactTitle)
    if (!contact || !organisationId) return

    const result = await removeFavorite(contact.id, organisationId)

    if (result.success) {
      setFavorites(favorites.filter((fav) => fav.title !== contactTitle))
    } else {
      console.error(result.error)
    }
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <SidebarMenu className="">
      <div className="flex items-center justify-between px-3 mt-6">
        <div>
          <span className="text-sm font-medium">Favoris</span>
        </div>
        <SidebarMenuItem>
          <Sheet>
            <SheetTrigger asChild>
              <SidebarMenuButton
                variant="outline"
                className="bg-[#7f1d1d] text-white font-bold hover:bg-[#7f1d1d] hover:text-white"
              >
                <Plus className="h-5 w-5" />
              </SidebarMenuButton>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Ajouter aux favoris</SheetTitle>
                <SheetDescription>Sélectionnez un contact pour l'ajouter à vos favoris.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un contact..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => addToFavorites(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                      </div>
                      {favorites.some((fav) => fav.title === contact.name) && (
                        <span className="text-sm text-muted-foreground">Déjà en favoris</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </SidebarMenuItem>
      </div>

      {favorites.map((item, index) => (
        <SidebarMenuItem key={index} className="group relative">
          <SidebarMenuButton asChild className={item.isActive ? "bg-gray-300" : ""}>
            <Link href={item.url} className="flex items-center">
              <Avatar className="h-5 w-5 mr-2">
                {item.logo ? <AvatarImage src={item.logo} alt={item.title} /> : null}
                <AvatarFallback>{item.title.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>

          <button
            onClick={(e) => {
              e.stopPropagation()
              removeFromFavorites(item.title)
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
            aria-label={`Retirer ${item.title} des favoris`}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}