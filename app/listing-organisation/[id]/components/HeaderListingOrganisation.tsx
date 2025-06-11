"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import LeadGeneration from "@/app/listing-organisation/[id]/components/LeadGeneration";
import Darkpeack from "@/app/listing-organisation/[id]/components/Darkpeaker";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsTwitterX } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import BodyNotification from "../notification/components/BodyNotification";
import ContactsSection from "./ContactsSection";
import { Eye, EyeOff, Sparkles } from "lucide-react";

const topContacts = [
  { name: "Adobe", visits: 11, icon: "🎨", trend: "+23%" },
  { name: "Airbnb", visits: 7, icon: "🏠", trend: "+15%" },
  { name: "AMD", visits: 4, icon: "💻", trend: "+8%" },
  { name: "Google", visits: 4, icon: "🔍", trend: "+12%" },
  { name: "Microsoft", visits: 3, icon: "🪟", trend: "+5%" },
  { name: "Beatrice Richter", visits: 2, icon: "👤", trend: "+3%" },
];

const lowContacts = [
  { name: "United Airlines", visits: 0, icon: "✈️", trend: "0%" },
  { name: "Amazon", visits: 0, icon: "📦", trend: "0%" },
  { name: "Dropbox", visits: 0, icon: "☁️", trend: "0%" },
  { name: "Apple", visits: 0, icon: "🍎", trend: "0%" },
  { name: "Intercom", visits: 0, icon: "💬", trend: "0%" },
  { name: "Spotify", visits: 0, icon: "🎵", trend: "0%" },
];

export default function HeaderListingOrganisation() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2 py-3 ">
            <SidebarTrigger className="" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Tableau de Board</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <IoMdInformationCircleOutline
                      className="h-4 w-4"
                      color="gray"
                    />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BodyNotification />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BsTwitterX className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <Separator className="" />
        <Darkpeack />
        <LeadGeneration />
        <div className="flex p-6 w-full gap-4">

          <ContactsSection
            title="Contacts les plus visités"
            description="Top performers de la période"
            contacts={topContacts}
            variant="high"
            icon={Eye}
          />

          <ContactsSection
            title="Contacts les moins visités"
            description="Opportunités d'amélioration"
            contacts={lowContacts}
            variant="low"
            icon={EyeOff}
          />
        </div>

        {/* Footer avec action */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#591112] to-[#7a1419] px-6 py-3 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Dashboard mis à jour en temps réel</span>
          </div>
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
}