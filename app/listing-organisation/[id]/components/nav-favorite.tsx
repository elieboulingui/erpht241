"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface FavoriteItem {
  title: string;
  url: string;
  logo?: string;
  isActive: boolean;
  items: any[];
}

const mockContacts: Contact[] = [
  { id: "1", name: "Marie Dupont", email: "marie@example.com" },
  { id: "2", name: "Jean Martin", email: "jean@example.com" },
  { id: "3", name: "Sophie Lefebvre", email: "sophie@example.com" },
  { id: "4", name: "Thomas Bernard", email: "thomas@example.com" },
  { id: "5", name: "Camille Petit", email: "camille@example.com" },
  { id: "6", name: "Lucas Moreau", email: "lucas@example.com" },
  { id: "7", name: "Emma Dubois", email: "emma@example.com" },
  { id: "8", name: "Hugo Leroy", email: "hugo@example.com" },
];

interface FavoritesProps {
  items: FavoriteItem[];
}

export function Favorites({ items: initialItems }: FavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");

  const addToFavorites = (contact: Contact) => {
    const newFavorite: FavoriteItem = {
      title: contact.name,
      url: `#/contact/${contact.id}`,
      logo: contact.avatar,
      isActive: false,
      items: [],
    };

    if (!favorites.some((fav) => fav.title === contact.name)) {
      setFavorites([...favorites, newFavorite]);
    }
  };

  const removeFromFavorites = (title: string) => {
    setFavorites(favorites.filter((item) => item.title !== title));
  };

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SidebarMenu>
        <div className="flex items-center justify-between px-3 mt-6">
          <div className="">
            <span className="text-sm font-medium">Favoris</span>
          </div>

          <SidebarMenuItem>
            <Sheet>
              <SheetTrigger asChild>
                <SidebarMenuButton variant={"outline"} className="bg-[#7f1d1d] text-white font-bold hover:bg-[#7f1d1d] hover:text-white">
                  <Plus className="h-5 w-5" />
                  <span>Ajouter</span>
                </SidebarMenuButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Ajouter aux favoris</SheetTitle>
                  <SheetDescription>
                    Sélectionnez un contact pour l'ajouter à vos favoris.
                  </SheetDescription>
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
                            <AvatarImage
                              src={contact.avatar}
                              alt={contact.name}
                            />
                            <AvatarFallback>
                              {contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                        {favorites.some(
                          (fav) => fav.title === contact.name
                        ) && (
                          <span className="text-sm text-muted-foreground">
                            Déjà en favoris
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </SidebarMenuItem>
        </div>

        {favorites.length > 0 ? (
          favorites.map((item, index) => (
            <SidebarMenuItem key={index} className="group relative">
              <SidebarMenuButton
                asChild
                className={item.isActive ? "bg-gray-300" : ""}
              >
                <Link href={item.url} className="flex items-center">
                  {item.logo ? (
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={item.logo} alt={item.title} />
                      <AvatarFallback>
                        {item.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback>
                        {item.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(item.title);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                aria-label={`Retirer ${item.title} des favoris`}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </SidebarMenuItem>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Star className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Aucun favori pour le moment
            </p>
          </div>
        )}
      </SidebarMenu>
    </>
  );
}