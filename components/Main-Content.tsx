"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Box,
  Play,
  ImageIcon,
  MonitorSmartphone,
  Settings,
  Home,
  Users,
  Cog,
  Plus,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const logos = ["/ht241.png", "/SAMBA TECH.png", "/Classertif logo (1).png"];

export default function MainContent() {
  const features = [
    {
      id: "feature1",
      icon: Box,
      label: "Feature 1",
      title: "Gestion des contacts",
      description:
        "Organisez et gérez efficacement vos contacts avec notre interface intuitive et nos outils d'automatisation avancés.",
    },
    {
      id: "feature2",
      icon: Play,
      label: "Feature 2",
      title: "Campagnes marketing",
      description:
        "Créez et lancez des campagnes marketing multicanales pour atteindre vos clients de manière ciblée et efficace.",
    },
    {
      id: "feature3",
      icon: ImageIcon,
      label: "Feature 3",
      title: "Analyses et rapports",
      description:
        "Obtenez des insights précieux grâce à nos analyses détaillées et nos rapports personnalisables.",
    },
    {
      id: "feature4",
      icon: MonitorSmartphone,
      label: "Feature 4",
      title: "Expérience multi-appareils",
      description:
        "Profitez d'une expérience utilisateur optimisée sur tous les appareils, du bureau au mobile.",
    },
    {
      id: "feature5",
      icon: Settings,
      label: "Feature 5",
      title: "Personnalisation avancée",
      description:
        "Adaptez la plateforme à vos besoins spécifiques grâce à nos options de personnalisation avancées.",
    },
  ];

  const sidebarItems = [
    { icon: Home, label: "Home" },
    { icon: Users, label: "Contacts" },
    { icon: Cog, label: "Settings" },
  ];

  const favorites = [
    { label: "Airbnb", icon: Box },
    { label: "Google", icon: Box },
    { label: "Microsoft", icon: Box },
  ];

  return (
    <div className="py-8 px-4 md:px-28">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-8">
          <div className="py-16">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Tesla</h2>
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-2 text-muted-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Favorites</h3>
              {favorites.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 py-2 text-muted-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2  text-muted-foreground hover:text-foreground cursor-pointer">
              <Plus className="h-5 w-5" />
              <span>Invite member</span>
            </div>
            <div className="flex items-center gap-2  text-muted-foreground hover:text-foreground cursor-pointer">
              <MessageSquare className="h-5 w-5" />
              <span>Feedback</span>
            </div>
            <div className=" flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <Image
                    src="/ht241.png"
                    alt="John Scott"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium">John Scott</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Tabs defaultValue="feature1" className="w-full h-f">
            <TabsList className="h-auto p-1 bg-transparent gap-2 mb-8 overflow-x-auto flex-nowrap">
              {features.map((feature, index) => (
                <div key={feature.id} className="flex items-center">
                  <TabsTrigger
                    value={feature.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary whitespace-nowrap"
                  >
                    <feature.icon className="h-4 w-4" />
                    {feature.label}
                  </TabsTrigger>
                  {index < features.length - 1 && (
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/20 mx-2 shrink-0" />
                  )}
                </div>
              ))}
            </TabsList>
            {features.map((feature) => (
              <TabsContent
                key={feature.id}
                value={feature.id}
                className="mt-8 w-full"
              >
                <div className="bg-muted/40 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <div className="mt-16 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
          Reconnu par des clients à croissance rapide <br /> entreprises du
          monde entier
        </p>
        <div className="flex justify-center gap-8">
          {logos.map((logo, index) => (
            <Image
              key={index}
              src={logo || "/placeholder.svg"}
              alt={`Client logo ${index + 1}`}
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
