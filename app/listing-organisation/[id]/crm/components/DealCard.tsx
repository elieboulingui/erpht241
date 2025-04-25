// DealCard.tsx
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, ChevronDown, ChevronUp, EllipsisVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Deal, Merchant, merchantsData } from "./types";

interface DealCardProps extends Deal {
  index: number;
  onEdit: (deal: Deal) => void;
}

export function DealCard({ id, title, description, amount, merchantId, tags, tagColors, index, onEdit }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showDealSheet, setShowDealSheet] = useState(false);

  const merchant = merchantsData.find(m => m.id === merchantId);

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Card className="mb-3 max-w-[280px] border border-gray-200 hover:shadow-md transition-shadow relative">
              <CardContent className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0" onClick={() => setShowDealSheet(true)}>
                    <h3 className="text-xs font-medium leading-tight truncate">{title}</h3>
                  </div>

                  <div className="w-8 h-6 flex justify-end">
                    {(isHovered || dropdownOpen) && (
                      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(!dropdownOpen);
                            }}
                          >
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50">
                          <DropdownMenuItem onClick={() => onEdit({
                            id,
                            title,
                            description,
                            amount,
                            merchantId,
                            tags,
                            tagColors,
                          })}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                {description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
                )}

                <p className="text-sm text-gray-600">
                  {amount.toLocaleString()} FCFA
                </p>

                {merchant && (
                  <div className="mt-1">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setShowContacts(!showContacts)}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={merchant.photo} alt={merchant.name} />
                      </Avatar>
                      <span className="text-xs text-gray-500">Commerçant: {merchant.name}</span>
                      {showContacts ? (
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      )}
                    </div>

                    {showContacts && (
                      <div className="mt-2 pl-8 space-y-2">
                        {merchant.contacts.map(contact => (
                          <div key={contact.id} className="text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                              </Avatar>
                              <div>
                                <div className="font-medium">{contact.name}</div>
                                <div className="text-gray-500">{contact.position}</div>
                              </div>
                            </div>
                            {contact.phone && <div className="mt-1 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>}
                            {contact.email && <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{contact.email}</span>
                            </div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${tagColors[index] || "bg-gray-100 text-gray-800"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>

      <Sheet open={showDealSheet} onOpenChange={setShowDealSheet}>
        <SheetContent className="w-full sm:max-w-6xl">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="client" className="mt-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="taches">Tâches</TabsTrigger>
              <TabsTrigger value="rendezvous">Rendez-vous</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="devis">Devis</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-medium">Informations client</h3>
                  {merchant && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={merchant.photo} alt={merchant.name} />
                        </Avatar>
                        <div>
                          <div className="font-medium">{merchant.name}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>

                <div>
                  <h3 className="font-medium">Montant</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {amount.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="taches">
              <div className="mt-4">
                <p>Liste des tâches associées à ce deal</p>
              </div>
            </TabsContent>

            <TabsContent value="rendezvous">
              <div className="mt-4">
                <p>Calendrier des rendez-vous</p>
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="mt-4">
                <p>Notes et commentaires</p>
              </div>
            </TabsContent>

            <TabsContent value="document">
              <div className="mt-4">
                <p>Documents associés</p>
              </div>
            </TabsContent>

            <TabsContent value="devis">
              <div className="mt-4">
                <p>Devis associés</p>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}