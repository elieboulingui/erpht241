"use client";

import { PageHeader } from "@/components/PageHeader";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus, Star, Phone, Mail, Info, EllipsisVertical, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Types
type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  avatar?: string;
};

type Merchant = {
  id: string;
  name: string;
  photo: string;
  contacts: Contact[];
};

type Deal = {
  id: string;
  title: string;
  description?: string;
  amount: number;
  merchantId?: string;
  tags: string[];
  tagColors: string[];
  icons?: string[];
  avatar?: string;
  iconColors?: string[];
  deadline?: string;
};

type DealStage = {
  id: string;
  title: string;
  color: string;
};

// Configuration initiale des colonnes
const INITIAL_DEAL_STAGES: DealStage[] = [
  {
    id: "new",
    title: "Nouveau",
    color: "bg-gray-500",
  },
  {
    id: "qualified",
    title: "Qualifié",
    color: "bg-orange-300",
  },
  {
    id: "proposal",
    title: "Proposition",
    color: "bg-red-500",
  },
  {
    id: "won",
    title: "Gagné",
    color: "bg-green-500",
  },
  {
    id: "lost",
    title: "Perdu",
    color: "bg-black",
  },
];

// Données des commerçants avec avatars uniques
const merchantsData: Merchant[] = [
  {
    id: "m1",
    name: "Dec Ads/dt",
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
    contacts: [
      {
        id: "c1",
        name: "Sophie Martin",
        email: "sophie@decads.com",
        phone: "+123456789",
        position: "Sales Manager",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "c2",
        name: "Pierre Dupont",
        email: "pierre@decads.com",
        phone: "+987654321",
        position: "Account Executive",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
      }
    ]
  },
  {
    id: "m2",
    name: "Ready M4K",
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
    contacts: [
      {
        id: "c3",
        name: "Jean Leroy",
        email: "jean@readym4k.com",
        phone: "+1122334455",
        position: "CEO",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
      }
    ]
  },
  {
    id: "m3",
    name: "Azure Interior",
    photo: "https://randomuser.me/api/portraits/women/50.jpg",
    contacts: [
      {
        id: "c4",
        name: "Marie Lambert",
        email: "marie@azure.com",
        phone: "+3344556677",
        position: "Design Director",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg"
      },
      {
        id: "c5",
        name: "Thomas Garnier",
        email: "thomas@azure.com",
        phone: "+5566778899",
        position: "Project Manager",
        avatar: "https://randomuser.me/api/portraits/men/30.jpg"
      }
    ]
  }
];

// Données initiales des deals avec avatars uniques
const initialDealsData: Record<string, Deal[]> = {
  new: [
    {
      id: "new-1",
      title: "Office Design Project",
      description: "Conception de bureau moderne pour espace ouvert",
      amount: 24000,
      merchantId: "m1",
      tags: ["Design", "Urgent"],
      tagColors: ["bg-purple-100 text-purple-800", "bg-red-100 text-red-800"],
      icons: ["phone"],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      iconColors: ["text-blue-500"],
      deadline: "2023-12-15",
    },
    {
      id: "new-2",
      title: "Global Solutions Furnitures",
      description: "Meubles de bureau haut de gamme",
      amount: 3800,
      merchantId: "m2",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ],
  qualified: [
    {
      id: "qualified-1",
      title: "Quote for 12 Tables",
      description: "Devis pour tables de conférence",
      amount: 40000,
      merchantId: "m1",
      tags: ["Product", "Important"],
      tagColors: ["bg-blue-100 text-blue-800", "bg-yellow-100 text-yellow-800"],
      avatar: "https://randomuser.me/api/portraits/women/70.jpg",
    },
    {
      id: "qualified-2",
      title: "Global Solutions Furnitures",
      description: "Meubles pour espace coworking",
      amount: 3800,
      merchantId: "m2",
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
      avatar: "https://randomuser.me/api/portraits/women/71.jpg",
    },
  ],
  proposal: [
    {
      id: "proposal-1",
      title: "Defiance to Computer Desks",
      description: "Bureaux informatiques sur mesure",
      amount: 35500,
      merchantId: "m2",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      icons: ["phone"],
      iconColors: ["text-blue-500"],
    },
    {
      id: "proposal-2",
      title: "Balance Inc: Potential Distributor",
      description: "Partenariat de distribution",
      amount: 1000,
      merchantId: "m3",
      tags: ["Services"],
      tagColors: ["bg-orange-100 text-orange-800"],
      avatar: "https://randomuser.me/api/portraits/men/73.jpg",
    },
  ],
  won: [
    {
      id: "won-1",
      title: "Proposition",
      description: "Projet signé avec client premium",
      amount: 11000,
      merchantId: "m1",
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
      icons: ["info"],
      avatar: "https://randomuser.me/api/portraits/women/74.jpg",
      iconColors: ["text-green-500"],
    },
    {
      id: "won-2",
      title: "Modern Open Space",
      description: "Aménagement d'espace ouvert",
      amount: 4500,
      merchantId: "m3",
      tags: ["Design"],
      tagColors: ["bg-purple-100 text-purple-800"],
      avatar: "https://randomuser.me/api/portraits/women/76.jpg",
    },
  ],
  lost: [
    {
      id: "lost-1",
      title: "Customizable Desk",
      description: "Bureau modulable haut de gamme",
      amount: 15000,
      merchantId: "m3",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
      avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    {
      id: "lost-2",
      title: "Need 20 Desks",
      description: "Commande groupée de bureaux",
      amount: 60000,
      merchantId: "m1",
      tags: ["Product"],
      tagColors: ["bg-blue-100 text-blue-800"],
      avatar: "https://randomuser.me/api/portraits/men/78.jpg",
    },
  ],
};

const DealCard = ({
  id,
  title,
  description,
  amount,
  merchantId,
  tags,
  tagColors,
  icons = [],
  avatar,
  iconColors = [],
  deadline,
  index,
  onEdit,
}: Deal & { index: number; onEdit: (deal: Deal) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showDealSheet, setShowDealSheet] = useState(false); // Nouvel état pour le Sheet

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
            <Card className="mb-3 border border-gray-200 hover:shadow-md transition-shadow relative">
              <CardContent className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0"
                    onClick={() => setShowDealSheet(true)} // Ajout du clic pour ouvrir le Sheet
                  >
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
                        <DropdownMenuContent
                          align="end"
                          className="z-50"
                          onInteractOutside={(e) => {
                            const isTrigger = e.target === document.querySelector(`[data-id="${id}"] button`);
                            if (!isTrigger) {
                              setDropdownOpen(false);
                            }
                          }}
                        >
                          <DropdownMenuItem onClick={() => onEdit({
                            id,
                            title,
                            description,
                            amount,
                            merchantId,
                            tags,
                            tagColors,
                            icons,
                            avatar,
                            iconColors,
                            deadline
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

                {deadline && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span>Échéance: {new Date(deadline).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center justify-between">
                    {icons.length > 0 && (
                      <div className="flex gap-2">
                        {icons.includes("phone") && (
                          <Phone
                            className={`h-3 w-3 ${iconColors[icons.indexOf("phone")] || "text-gray-500"
                              }`}
                          />
                        )}
                        {icons.includes("mail") && (
                          <Mail
                            className={`h-3 w-3 ${iconColors[icons.indexOf("mail")] || "text-gray-500"
                              }`}
                          />
                        )}
                        {icons.includes("info") && (
                          <Info
                            className={`h-3 w-3 ${iconColors[icons.indexOf("info")] || "text-gray-500"
                              }`}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    {avatar && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={avatar} alt={title} />
                      </Avatar>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>


      {/* Ajoutez ce Sheet pour afficher les détails avec onglets */}
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

                {deadline && (
                  <div>
                    <h3 className="font-medium">Échéance</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="taches">
              <div className="mt-4">
                <p>Liste des tâches associées à ce deal</p>
                {/* Ajoutez ici le contenu des tâches */}
              </div>
            </TabsContent>

            <TabsContent value="rendezvous">
              <div className="mt-4">
                <p>Calendrier des rendez-vous</p>
                {/* Ajoutez ici le contenu des rendez-vous */}
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="mt-4">
                <p>Notes et commentaires</p>
                {/* Ajoutez ici le contenu des notes */}
              </div>
            </TabsContent>

            <TabsContent value="document">
              <div className="mt-4">
                <p>Documents associés</p>
                {/* Ajoutez ici le contenu des documents */}
              </div>
            </TabsContent>

            <TabsContent value="devis">
              <div className="mt-4">
                <p>Devis associés</p>
                {/* Ajoutez ici le contenu des devis */}
              </div>
            </TabsContent>

          </Tabs>

          {/* <SheetFooter className="mt-6">
            <Button onClick={() => setShowDealSheet(false)}>Fermer</Button>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </>
  );
};

const EditDealSheet = ({
  deal,
  onSave,
  onOpenChange,
  isAddingNew = false,
}: {
  deal: Deal | null;
  onSave: (deal: Deal) => void;
  onOpenChange: (open: boolean) => void;
  isAddingNew?: boolean;
}) => {
  const [formData, setFormData] = useState<Deal>(() => ({
    id: deal?.id || `new-${Date.now()}`,
    title: deal?.title || "",
    description: deal?.description || "",
    amount: deal?.amount || 0,
    merchantId: deal?.merchantId || "",
    tags: deal?.tags || [],
    tagColors: deal?.tagColors || [],
    icons: deal?.icons || [],
    iconColors: deal?.iconColors || [],
    avatar: deal?.avatar || "",
    deadline: deal?.deadline || "",
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const tagOptions = [
    { value: "Design", label: "Design", color: "bg-purple-100 text-purple-800" },
    { value: "Product", label: "Product", color: "bg-blue-100 text-blue-800" },
    { value: "Services", label: "Services", color: "bg-orange-100 text-orange-800" },
    { value: "Information", label: "Information", color: "bg-green-100 text-green-800" },
    { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
    { value: "Important", label: "Important", color: "bg-yellow-100 text-yellow-800" },
  ];

  return (
    <Sheet open={!!deal} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{isAddingNew ? "Créer un nouveau deal" : "Modifier le deal"}</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="merchant">Commerçant</Label>
              <Select
                value={formData.merchantId || ""}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    merchantId: value || undefined,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un commerçant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun commerçant</SelectItem>
                  {merchantsData.map((merchant) => (
                    <SelectItem key={merchant.id} value={merchant.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={merchant.photo} alt={merchant.name} />
                        </Avatar>
                        {merchant.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Tags</Label>
              <Select
                value={undefined}
                onValueChange={(value) => {
                  if (value && !formData.tags.includes(value)) {
                    const selectedTag = tagOptions.find(opt => opt.value === value);
                    setFormData(prev => ({
                      ...prev,
                      tags: [...prev.tags, value],
                      tagColors: [...prev.tagColors, selectedTag?.color || ""],
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter un tag" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="relative">
                    <span className={`text-xs px-2 py-1 rounded-full ${formData.tagColors[index]}`}>
                      {tag}
                    </span>
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 text-xs"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index),
                          tagColors: prev.tagColors.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Échéance</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar">URL de l'avatar</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">Enregistrer</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const AddStageSheet = ({
  stage,
  onSave,
  onOpenChange,
}: {
  stage: DealStage | null;
  onSave: (stage: DealStage) => void;
  onOpenChange: (open: boolean) => void;
}) => {
  const [formData, setFormData] = useState<DealStage>({
    id: "",
    title: "",
    color: "bg-gray-500",
    ...stage,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || formData.title.toLowerCase().replace(/\s+/g, '-'),
    });
    onOpenChange(false);
  };

  const colorOptions = [
    { value: "bg-gray-500", label: "Gris" },
    { value: "bg-blue-500", label: "Bleu" },
    { value: "bg-red-500", label: "Rouge" },
    { value: "bg-green-500", label: "Vert" },
    { value: "bg-yellow-500", label: "Jaune" },
    { value: "bg-purple-500", label: "Violet" },
    { value: "bg-pink-500", label: "Rose" },
    { value: "bg-orange-500", label: "Orange" },
  ];

  return (
    <Sheet open={!!stage} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>Ajouter une nouvelle colonne</SheetTitle>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="color">Couleur</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    color: value,
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une couleur" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${option.value}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">Enregistrer</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

const SelectColumnSheet = ({
  open,
  onOpenChange,
  columns,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: DealStage[];
  onSelect: (columnId: string) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Sélectionner une colonne</SheetTitle>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {columns.map((column) => (
            <Button
              key={column.id}
              variant="outline"
              className="justify-start"
              onClick={() => {
                onSelect(column.id);
                onOpenChange(false);
              }}
            >
              {column.title}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface HeaderCRMProps {
  onAddClick?: () => void;
  onAddColumn?: () => void;
}

export function HeaderCRM({ onAddClick, onAddColumn }: HeaderCRMProps) {
  return (
    <div className="flex w-full items-center px-3">
      <PageHeader
        title="CRM"
        searchPlaceholder="Rechercher..."
      />

      <div className="flex gap-2">
        <Button
          className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4 mr-1" /> Nouvelle carte
        </Button>
        <Button
          className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold"
          onClick={onAddColumn}
        >
          <Plus className="h-4 w-4 mr-1" /> Nouvelle colonne
        </Button>
      </div>
    </div>
  );
}

export default function CRMDealsBoard() {
  const [dealStages, setDealStages] = useState<DealStage[]>(INITIAL_DEAL_STAGES);
  const [dealsData, setDealsData] = useState(initialDealsData);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isAddingNewDeal, setIsAddingNewDeal] = useState(false);
  const [addingStage, setAddingStage] = useState<DealStage | null>(null);
  const [newDealColumn, setNewDealColumn] = useState<string | null>(null);
  const [showColumnSelection, setShowColumnSelection] = useState(false);

  const calculateStageStats = useCallback(
    (stageId: string) => {
      const deals = dealsData[stageId] || [];
      const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

      let progress = 0;
      if (stageId === "new") progress = 25;
      else if (stageId === "qualified") progress = 50;
      else if (stageId === "proposal") progress = 75;
      else if (stageId === "won") progress = 100;

      return { totalAmount, progress };
    },
    [dealsData]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const sourceItems = [...dealsData[sourceColumn]];
    const destItems =
      destColumn === sourceColumn ? sourceItems : [...dealsData[destColumn]];
    const [removed] = sourceItems.splice(source.index, 1);

    destItems.splice(destination.index, 0, removed);

    setDealsData({
      ...dealsData,
      [sourceColumn]: sourceItems,
      [destColumn]: destItems,
    });
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsAddingNewDeal(false);
  };

  const handleAddNewDeal = () => {
    setShowColumnSelection(true);
  };

  const handleAddNewColumn = () => {
    setAddingStage({
      id: "",
      title: "",
      color: "bg-gray-500",
    });
  };

  const handleAddCardToColumn = (columnId: string) => {
    setNewDealColumn(columnId);
    const newDeal: Deal = {
      id: `new-${Date.now()}`,
      title: "Nouveau deal",
      amount: 0,
      tags: [],
      tagColors: [],
    };
    setEditingDeal(newDeal);
    setIsAddingNewDeal(true);
  };

  const handleSaveStage = (newStage: DealStage) => {
    setDealStages(prev => [...prev, newStage]);
    setDealsData(prev => ({
      ...prev,
      [newStage.id]: [],
    }));
    setAddingStage(null);
  };

  const handleSaveDeal = (updatedDeal: Deal) => {
    if (isAddingNewDeal) {
      const columnId = newDealColumn || "new";
      setDealsData(prev => ({
        ...prev,
        [columnId]: [...(prev[columnId] || []), {
          ...updatedDeal,
          id: `new-${Date.now()}`,
        }]
      }));
    } else {
      setDealsData(prev => {
        const newData = { ...prev };
        for (const stage of dealStages) {
          const index = newData[stage.id]?.findIndex(d => d.id === updatedDeal.id);
          if (index !== -1 && index !== undefined) {
            newData[stage.id][index] = updatedDeal;
            break;
          }
        }
        return newData;
      });
    }
    setEditingDeal(null);
    setIsAddingNewDeal(false);
    setNewDealColumn(null);
  };

  const handleCloseEditDealSheet = (open: boolean) => {
    if (!open) {
      setEditingDeal(null);
      setIsAddingNewDeal(false);
      setNewDealColumn(null);
    }
  };

  const handleCloseAddStageSheet = (open: boolean) => {
    if (!open) {
      setAddingStage(null);
    }
  };

  const handleCloseColumnSelectionSheet = (open: boolean) => {
    if (!open) {
      setShowColumnSelection(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <HeaderCRM
        onAddClick={handleAddNewDeal}
        onAddColumn={handleAddNewColumn}
      />

      <div className="flex justify-between items-center border-b px-6 py-3">
        <nav className="flex space-x-6 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-medium flex items-center focus:outline-none">
                Contact
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 flex items-center focus:outline-none">
                Commerciaux
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 flex items-center focus:outline-none">
                Tags
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-4 p-6 overflow-auto flex-1">
          {dealStages.map((stage) => {
            const { totalAmount, progress } = calculateStageStats(stage.id);

            return (
              <div key={stage.id} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold">{stage.title}</h2>
                  <button
                    className="text-gray-400 hover:text-gray-800"
                    onClick={() => handleAddCardToColumn(stage.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress
                      value={progress}
                      className={`h-2 ${stage.color}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {totalAmount.toLocaleString()} FCFA
                  </span>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3 overflow-y-auto flex-1 min-h-[100px]"
                    >
                      {dealsData[stage.id]?.map((deal, index) => (
                        <DealCard
                          key={deal.id}
                          {...deal}
                          index={index}
                          onEdit={handleEditDeal}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <EditDealSheet
        deal={editingDeal}
        onSave={handleSaveDeal}
        onOpenChange={handleCloseEditDealSheet}
        isAddingNew={isAddingNewDeal}
      />

      <AddStageSheet
        stage={addingStage}
        onSave={handleSaveStage}
        onOpenChange={handleCloseAddStageSheet}
      />

      <SelectColumnSheet
        open={showColumnSelection}
        onOpenChange={handleCloseColumnSelectionSheet}
        columns={dealStages}
        onSelect={(columnId) => {
          setNewDealColumn(columnId);
          setEditingDeal({
            id: `new-${Date.now()}`,
            title: "Nouveau deal",
            amount: 0,
            tags: [],
            tagColors: [],
          });
          setIsAddingNewDeal(true);
        }}
      />
    </div>
  );
}