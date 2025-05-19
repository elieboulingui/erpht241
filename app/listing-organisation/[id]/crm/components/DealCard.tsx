"use client"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import TaskTab from "./task-tab";
import AppointmentTab from "./appointment-tab";
import DocumentsTab from "./documents-tab";
import QuotesTab from "./quotes-tab";
import NotesTab from "./notes-tab";
import { deleteDeal } from "../action/deletedeals";

interface DealCardProps extends Deal {
  index: number;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
}

export function DealCard({ id, label, description, amount, merchantId, tags, tagColors, index, onEdit, onDelete }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showDealSheet, setShowDealSheet] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const merchant = merchantsData.find(m => m.id === merchantId);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteDeal(id);
    setIsDeleteDialogOpen(false);
  };

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
                    <h3 className="text-xs font-medium leading-tight truncate">{label}</h3>
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
                            label,
                            description,
                            amount,
                            merchantId,
                            tags,
                            tagColors,
                            stepNumber: 1
                          })}>
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[#7f1d1c]"
                            onClick={handleDeleteClick}
                          >
                            Supprimer
                          </DropdownMenuItem>
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
                      <div className="flex-1">
                        <div className="text-xs font-medium">{merchant.name}</div>
                        <div className="text-xs text-gray-500">{merchant.role}</div>
                      </div>
                      {showContacts ? (
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      )}
                    </div>

                    {showContacts && (
                      <div className="mt-2 pl-8 space-y-2">
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{merchant.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{merchant.email}</span>
                          </div>
                        </div>

                        {merchant.contacts.map(contact => (
                          <div key={contact.id} className="text-xs text-gray-600 mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                              </Avatar>
                              <div>
                                <div className="font-medium">{contact.name}</div>
                                <div className="text-gray-500">{contact.position}</div>
                              </div>
                            </div>
                            {contact.phone && <div className="mt-1 flex items-center gap-1 pl-7">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>}
                            {contact.email && <div className="flex items-center gap-1 pl-7">
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

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'Opportunité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'Opportunité "{label}" ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white"
              onClick={handleConfirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={showDealSheet} onOpenChange={setShowDealSheet}>
        <SheetContent className="w-full sm:max-w-6xl">
          <SheetHeader>
            <SheetTitle>{label}</SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="client" className="mt-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="client">Commercial</TabsTrigger>
              <TabsTrigger value="taches">Tâches</TabsTrigger>
              <TabsTrigger value="rendezvous">Rendez-vous</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="devis">Devis</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-medium text-lg">Informations Commercial</h3>
                  {merchant && (
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={merchant.photo} alt={merchant.name} />
                        </Avatar>
                        <div>
                          <div className="font-medium">{merchant.name}</div>
                          <div className="text-sm text-gray-500">{merchant.role}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Coordonnées</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{merchant.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>{merchant.email}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Contacts</h4>
                          <div className="space-y-3">
                            {merchant.contacts.map(contact => (
                              <div key={contact.id} className="p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={contact.avatar} alt={contact.name} />
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{contact.name}</div>
                                    <div className="text-sm text-gray-500">{contact.position}</div>
                                  </div>
                                </div>
                                <div className="mt-2 space-y-1 pl-11">
                                  {contact.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span>{contact.phone}</span>
                                    </div>
                                  )}
                                  {contact.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <span>{contact.email}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
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
              <TaskTab />
            </TabsContent>

            <TabsContent value="rendezvous">
              <AppointmentTab />
            </TabsContent>

            <TabsContent value="notes">
              <NotesTab />
            </TabsContent>

            <TabsContent value="document">
              <DocumentsTab />
            </TabsContent>

            <TabsContent value="devis">
              <QuotesTab />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}