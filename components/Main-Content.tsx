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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const features = [
  {
    id: "feature1",
    icon: Box,
    label: "Feature 1",
    content: "Contenu spécifique pour la Feature 1",
  },
  {
    id: "feature2",
    icon: Play,
    label: "Feature 2",
    content: "Contenu spécifique pour la Feature 2",
  },
  {
    id: "feature3",
    icon: ImageIcon,
    label: "Feature 3",
    content: "Contenu spécifique pour la Feature 3",
  },
  {
    id: "feature4",
    icon: MonitorSmartphone,
    label: "Feature 4",
    content: "Contenu spécifique pour la Feature 4",
  },
  {
    id: "feature5",
    icon: Settings,
    label: "Feature 5",
    content: "Contenu spécifique pour la Feature 5",
  },
];

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" }, // Page d'accueil
  { icon: Users, label: "Contacts", href: "/contacts" }, // Page Contacts
  { icon: Cog, label: "Settings", href: "/settings" }, // Page Settings
];

const favorites = [
  { label: "Airbnb", icon: Box, href: "/" },
  { label: "Google", icon: FcGoogle, href: "/" },
  { label: "Microsoft", icon: "/images/microsoft.png", href: "/" },
];

const AutresFonctionnalites = [
  { label: " Invite member", icon: Plus, href: "/" },
  { label: "Feedback", icon: MessageSquare, href: "/" },
];

const logos = [
  "/images/ht241.png",
  "/images/sambaTechPro.png",
  "/images/Classertif.png",
];

export default function MainContent() {
  return (
    <div className="container mx-auto">
      <div>
        {/* Sidebar */}
        <Tabs defaultValue="feature1" className="w-full">
          <TabsList className="flex items-center gap-2 bg-transparent">
            {features.map((feature, index) => (
              <div key={feature.id} className="flex items-center">
                <TabsTrigger
                  value={feature.id}
                  className="flex items-center gap-2 px-4 py-2  data-[state=active]:bg-none data-[state=active]:text-black"
                >
                  <feature.icon className="h-4 w-4" />
                  {feature.label}
                </TabsTrigger>
                {index < features.length - 1 && (
                  <div className="w-1 h-1 rounded-full bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </TabsList>

          {/* Main content */}
          <div className="w-full flex shadow-md ring-2 ring-gray-200 rounded-lg p-1 mt-6">
            <div className="w-[280px] p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-7 w-7 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">T</span>
                </div>
                <span className="font-medium">Tesla</span>
              </div>

              {/* Sidebar Items */}
              <nav className="">
                {sidebarItems.map((item, index) => (
                  <Link
                    href={item.href}
                    className="w-full justify-start flex items-center gap-2 py-2 font-bold"
                    key={index}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8">
                <h3 className="font-medium mb-2">Favorites</h3>

                {favorites.map((favorite, index) => (
                  <Link
                    href={favorite.href}
                    className="w-full justify-start flex items-center gap-2 py-2 font-bold"
                    key={index}
                  >
                    <div className="h-5 w-5 flex items-center justify-center">
                      {/* Check if the icon is a string (image path) or a React component */}
                      {typeof favorite.icon === "string" ? (
                        <Image
                          src={favorite.icon}
                          alt={favorite.label}
                          width={20}
                          height={20}
                          className="h-4 w-4 object-contain"
                        />
                      ) : (
                        <favorite.icon className="h-5 w-5 text-[#FF5A5F]" />
                      )}
                    </div>
                    {favorite.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto ">
                <div className="">
                  {AutresFonctionnalites.map((fonctionnalite, index) => (
                    <Link
                      key={index}
                      className="w-full flex justify-start gap-2 mt-4"
                      href={fonctionnalite.href}
                    >
                      <fonctionnalite.icon className="h-5 w-5" />
                      {fonctionnalite.label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="John Scott"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold">John Scott</span>
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

            {/* Tabs content */}
            <div className="p-3 w-full">
              {features.map((feature) => (
                <TabsContent
                  key={feature.id}
                  value={feature.id}
                  className="mt-10 h-[600px]  bg-gray-100 rounded-lg items-center justify-center"
                >
                  <div className="p-12">
                    <h2 className="text-2xl font-semibold">{feature.label}</h2>
                    <p className="mt-4 text-gray-500">{feature.content}</p>
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>

      <div>
        <div className="p-3 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
            Reconnu par des clients à croissance rapide <br /> entreprises du
            monde entier
          </p>
          <div className="flex justify-center gap-8">
            {logos.map((logo, index) => (
              <Image
                key={index}
                src={logo || "/placeholder.svg"}
                alt={`logo ${index + 1}`}
                width={56}
                height={56}
                className="h-16 w-16 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
