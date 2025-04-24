"use client";

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
import { Plus, Star, Phone, Mail, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useCallback } from "react";

// Configuration des colonnes
const DEAL_STAGES = [
  {
    id: "new",
    title: "Nouveau",
    color: "bg-green-500"
  },
  {
    id: "qualified",
    title: "Qualifié",
    color: "bg-gray-300"
  },
  {
    id: "proposal",
    title: "Proposition",
    color: "bg-orange-500"
  },
  {
    id: "won",
    title: "Gagné",
    color: "bg-red-500"
  },
  {
    id: "lost",
    title: "Perdu",
    color: "bg-gray-300"
  },
] as const;

// Type for deal data
type Deal = {
  id: string;
  title: string;
  amount: number;
  company?: string;
  contact?: string;
  tag: string;
  tagColor: string;
  rating?: number;
  icons?: string[];
  avatar?: string;
  iconColors?: string[];
};

// Initial data with unique IDs for each deal
const initialDealsData: Record<string, Deal[]> = {
  new: [
    {
      id: "new-1",
      title: "Office Design Project",
      amount: 24000,
      company: "Dec Ads/dt",
      contact: "Sophie Martin",
      tag: "Design",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 3,
      icons: ["phone"],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      iconColors: ["text-blue-500"]
    },
    {
      id: "new-2",
      title: "Global Solutions Furnitures",
      amount: 3800,
      company: "Ready M4K",
      contact: "Thomas Dubois",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 2,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: "new-3",
      title: "Devis pour 150 kb/s",
      amount: 40000,
      company: "OPEN/DOG",
      contact: "Camille Leroy",
      tag: "Services",
      tagColor: "bg-orange-100 text-orange-800",
      rating: 4,
      icons: ["mail"],
      iconColors: ["text-red-500"]
    },
  ],
  qualified: [
    {
      id: "qualified-1",
      title: "Quote for 12 Tables",
      amount: 40000,
      contact: "Élodie Petit",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 3,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: "qualified-2",
      title: "Global Solutions Furnitures",
      amount: 3800,
      company: "Ready M4K",
      contact: "Nicolas Lambert",
      tag: "Design",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 2
    },
    {
      id: "qualified-3",
      title: "Quote for 600 Chairs",
      amount: 22500,
      contact: "Pierre Garnier",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
  ],
  proposal: [
    {
      id: "proposal-1",
      title: "Defiance to Computer Desks",
      amount: 35500,
      company: "Ready M4K",
      contact: "Laura Rousseau",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 3,
      icons: ["phone"],
      iconColors: ["text-blue-500"]
    },
    {
      id: "proposal-2",
      title: "Balance Inc: Potential Distributor",
      amount: 1000,
      contact: "Antoine Moreau",
      tag: "Services",
      tagColor: "bg-orange-100 text-orange-800",
      rating: 2
    },
    {
      id: "proposal-3",
      title: "Info about services",
      amount: 25500,
      company: "Dec Ads/dt",
      contact: "Julie Lefevre",
      tag: "Information",
      tagColor: "bg-green-100 text-green-800",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    },
  ],
  won: [
    {
      id: "won-1",
      title: "Proposition",
      amount: 11000,
      company: "Dec Ads/dt",
      contact: "Marc Chevalier",
      tag: "Design",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 3,
      icons: ["info"],
      iconColors: ["text-green-500"]
    },
    {
      id: "won-2",
      title: "Modern Open Space",
      amount: 4500,
      contact: "Alexandre Girard",
      tag: "Design",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 2,
      avatar: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      id: "won-3",
      title: "Office Design and Architecture",
      amount: 9000,
      company: "Ready M4K",
      contact: "Céline Mercier",
      tag: "Design",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 4,
      icons: ["mail"],
      iconColors: ["text-red-500"]
    },
  ],
  lost: [
    {
      id: "lost-1",
      title: "Customizable Desk",
      amount: 15000,
      company: "Azure Interior",
      contact: "Sarah Bertin",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 3,
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
      id: "lost-2",
      title: "Need 20 Desks",
      amount: 60000,
      contact: "David Perrot",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 2
    },
    {
      id: "lost-3",
      title: "Gage6",
      amount: 2000,
      company: "Dec Ads/dt",
      contact: "Olivier Marchand",
      tag: "Information",
      tagColor: "bg-green-100 text-green-800",
      rating: 4,
      icons: ["info"],
      iconColors: ["text-green-500"]
    },
    {
      id: "lost-4",
      title: "Distributor Contract",
      amount: 19000,
      company: "Central Furniture",
      contact: "François Delattre",
      tag: "Services",
      tagColor: "bg-orange-100 text-orange-800",
      rating: 3,
      avatar: "https://randomuser.me/api/portraits/men/68.jpg"
    },
    {
      id: "lost-5",
      title: "Access to Online Catalog",
      amount: 2000,
      company: "Lumber Inc",
      contact: "Hélène Fontaine",
      tag: "Information",
      tagColor: "bg-green-100 text-green-800",
      rating: 2
    },
    {
      id: "lost-6",
      title: "5 VP Chairs",
      amount: 5000,
      company: "Azure Interior",
      contact: "Patrick Renault",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 4,
      icons: ["phone"],
      iconColors: ["text-blue-500"]
    },
  ],
};

const DealCard = ({
  id,
  title,
  amount,
  company,
  contact,
  tag,
  tagColor,
  rating = 3,
  icons = [],
  avatar,
  iconColors = [],
  index
}: Deal & { index: number }) => (
  <Draggable draggableId={id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Card className="mb-3 border border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-3 space-y-2">
            <div className="">
            
              <h3 className="text-xs font-medium leading-tight">{title}</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  {contact && <p className="font-semibold text-gray-900">{contact}</p>}
                </div>
                
                {avatar && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatar} alt={title} />
                  </Avatar>
                )}
              </div>
            </div>


            <p className="text-sm text-gray-600">{amount.toLocaleString()} FCFA</p>
            {company && <p className="text-xs text-gray-500">{company}</p>}
            <span className={`text-xs px-2 py-1 rounded-full ${tagColor}`}>
              {tag}
            </span>

            <div className="flex items-center justify-between">
              {icons.length > 0 && (
                <div className="flex gap-2">
                  {icons.includes("phone") && (
                    <Phone className={`h-3 w-3 ${iconColors[icons.indexOf("phone")] || "text-gray-500"}`} />
                  )}
                  {icons.includes("mail") && (
                    <Mail className={`h-3 w-3 ${iconColors[icons.indexOf("mail")] || "text-gray-500"}`} />
                  )}
                  {icons.includes("info") && (
                    <Info className={`h-3 w-3 ${iconColors[icons.indexOf("info")] || "text-gray-500"}`} />
                  )}
                </div>
              )}
             
            </div>
          </CardContent>
        </Card>
      </div>
    )}
  </Draggable>
);

export default function CRMDealsBoard() {
  const [dealsData, setDealsData] = useState(initialDealsData);

  // Calcul des statistiques pour chaque colonne
  const calculateStageStats = useCallback((stageId: string) => {
    const deals = dealsData[stageId] || [];
    const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

    // Calcul du pourcentage de progression basé sur l'étape
    let progress = 0;
    if (stageId === "new") progress = 25;
    else if (stageId === "qualified") progress = 50;
    else if (stageId === "proposal") progress = 75;
    else if (stageId === "won") progress = 100;

    return { totalAmount, progress };
  }, [dealsData]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const sourceItems = [...dealsData[sourceColumn]];
    const destItems = destColumn === sourceColumn ? sourceItems : [...dealsData[destColumn]];
    const [removed] = sourceItems.splice(source.index, 1);

    // Add to destination column
    destItems.splice(destination.index, 0, removed);

    setDealsData({
      ...dealsData,
      [sourceColumn]: sourceItems,
      [destColumn]: destItems,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-3">
        <nav className="flex space-x-6 text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-medium flex items-center focus:outline-none">
                Vente
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>Nouvelle vente</DropdownMenuItem>
              <DropdownMenuItem>Pipeline des ventes</DropdownMenuItem>
              <DropdownMenuItem>Statistiques</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 flex items-center focus:outline-none">
                Analyse
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>Rapports</DropdownMenuItem>
              <DropdownMenuItem>Tableaux de bord</DropdownMenuItem>
              <DropdownMenuItem>Analytique</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-600 flex items-center focus:outline-none">
                Configuration
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuItem>Équipe</DropdownMenuItem>
              <DropdownMenuItem>Intégrations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-4 p-6 overflow-auto flex-1">
          {DEAL_STAGES.map((stage) => {
            const { totalAmount, progress } = calculateStageStats(stage.id);

            return (
              <div key={stage.id} className="flex flex-col gap-3">
                {/* Column Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold">{stage.title}</h2>
                  <button className="text-gray-400 hover:text-gray-800">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress Bar + Amount */}
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

                {/* Deals List */}
                <Droppable droppableId={stage.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3 overflow-y-auto flex-1 min-h-[100px]"
                    >
                      {dealsData[stage.id].map((deal, index) => (
                        <DealCard key={deal.id} {...deal} index={index} />
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
    </div>
  );
}