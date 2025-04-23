"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus, Star, Phone, Mail, Info } from "lucide-react";

// Configuration des colonnes
const DEAL_STAGES = [
  { 
    id: "new", 
    title: "Nouveau", 
    amount: 104000, 
    progress: 68,
    color: "bg-blue-500" 
  },
  { 
    id: "qualified", 
    title: "Qualifié", 
    amount: 87300, 
    progress: 45,
    color: "bg-purple-500" 
  },
  { 
    id: "proposal", 
    title: "Proposition", 
    amount: 99500, 
    progress: 82,
    color: "bg-orange-500" 
  },
  { 
    id: "won", 
    title: "Gagné", 
    amount: 29400, 
    progress: 100,
    color: "bg-green-500" 
  },
  { 
    id: "lost", 
    title: "Perdu", 
    amount: 0, 
    progress: 0,
    color: "bg-gray-300" 
  },
] as const;

// Données complètes des deals
const DEALS_DATA = {
  new: [
    {
      title: "Office Design Project",
      amount: "24 000 FCFA",
      company: "Dec Ads/dt",
      tag: "Design",
      tagColor: "bg-pink-100 text-pink-800",
      rating: 3,
      icons: ["phone"],
      avatar: "/avatars/design.png"
    },
    {
      title: "Global Solutions Furnitures",
      amount: "3 800 FCFA",
      company: "Ready M4K",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 2
    },
    {
      title: "Devis pour 150 kb/s",
      amount: "40 000 FCFA",
      company: "OPEN/DOG",
      tag: "Services",
      tagColor: "bg-orange-100 text-orange-800",
      rating: 4,
      icons: ["mail"]
    },
  ],
  qualified: [
    {
      title: "Quote for 12 Tables",
      amount: "40 000 FCFA",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 3
    },
    {
      title: "Global Solutions Furnitures",
      amount: "3 800 FCFA",
      company: "Ready M4K",
      tag: "Design",
      tagColor: "bg-pink-100 text-pink-800",
      rating: 2
    },
    {
      title: "Quote for 600 Chairs",
      amount: "22 500 FCFA",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 4
    },
  ],
  proposal: [
    {
      title: "Defiance to Computer Desks",
      amount: "35 500 FCFA",
      company: "Ready M4K",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 3
    },
    {
      title: "Balance Inc: Potential Distributor",
      amount: "1 000 FCFA",
      tag: "Services",
      tagColor: "bg-orange-100 text-orange-800",
      rating: 2
    },
    {
      title: "Info about services",
      amount: "25 500 FCFA",
      company: "Dec Ads/dt",
      tag: "Information",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 4
    },
  ],
  won: [
    {
      title: "Proposition",
      amount: "11 000 FCFA",
      company: "Dec Ads/dt",
      tag: "Design",
      tagColor: "bg-pink-100 text-pink-800",
      rating: 3
    },
    {
      title: "Modern Open Space",
      amount: "4 500 FCFA",
      tag: "Design",
      tagColor: "bg-pink-100 text-pink-800",
      rating: 2
    },
    {
      title: "Office Design and Architecture",
      amount: "9 000 FCFA",
      company: "Ready M4K",
      tag: "Design",
      tagColor: "bg-pink-100 text-pink-800",
      rating: 4
    },
  ],
  lost: [
    {
      title: "Customizable Desk",
      amount: "15 000 FCFA",
      company: "Azure Interior",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 3
    },
    {
      title: "Need 20 Desks",
      amount: "60 000 FCFA",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 2
    },
    {
      title: "Gage6",
      amount: "2 000 FCFA",
      company: "Dec Ads/dt",
      tag: "Information",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 4,
      icons: ["info"]
    },
    {
      title: "Distributor Contract",
      amount: "19 000 FCFA",
      company: "Central Furniture",
      tag: "Services",
      tagColor: "bg-orange-100 text-orange-800",
      rating: 3
    },
    {
      title: "Access to Online Catalog",
      amount: "2 000 FCFA",
      company: "Lumber Inc",
      tag: "Information",
      tagColor: "bg-purple-100 text-purple-800",
      rating: 2
    },
    {
      title: "5 VP Chairs",
      amount: "5 000 FCFA",
      company: "Azure Interior",
      tag: "Product",
      tagColor: "bg-blue-100 text-blue-800",
      rating: 4,
      icons: ["phone"]
    },
  ],
};

const DealCard = ({ 
  title, 
  amount, 
  company, 
  tag, 
  tagColor, 
  rating = 3, 
  icons = [], 
  avatar 
}: {
  title: string;
  amount: string;
  company?: string;
  tag: string;
  tagColor: string;
  rating?: number;
  icons?: string[];
  avatar?: string;
}) => (
  <Card className="mb-3 border border-gray-200 hover:shadow-md transition-shadow">
    <CardContent className="p-3 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium leading-tight">{title}</h3>
        {avatar && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar} alt={title} />
          </Avatar>
        )}
      </div>
      <p className="text-sm text-gray-600">{amount}</p>
      {company && <p className="text-xs text-gray-500">{company}</p>}
      <span className={`text-xs px-2 py-1 rounded-full ${tagColor}`}>
        {tag}
      </span>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      {icons.length > 0 && (
        <div className="flex gap-2 pt-1">
          {icons.includes("phone") && <Phone className="h-3 w-3 text-gray-500" />}
          {icons.includes("mail") && <Mail className="h-3 w-3 text-gray-500" />}
          {icons.includes("info") && <Info className="h-3 w-3 text-gray-500" />}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function CRMDealsBoard() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-6 py-3">
        <nav className="flex space-x-6 text-sm">
          <button className="font-medium">Vente ▾</button>
          <button className="text-gray-600">Analyse ▾</button>
          <button className="text-gray-600">Configuration ▾</button>
        </nav>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter étape
        </Button>
      </div>

      {/* Board */}
      <div className="grid grid-cols-5 gap-4 p-6 overflow-auto flex-1">
        {DEAL_STAGES.map((stage) => (
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
                  value={stage.progress} 
                  className={`h-2 ${stage.color}`}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {stage.amount.toLocaleString()} FCFA
              </span>
            </div>

            {/* Deals List */}
            <div className="space-y-3 overflow-y-auto">
              {DEALS_DATA[stage.id].map((deal, index) => (
                <DealCard key={index} {...deal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}