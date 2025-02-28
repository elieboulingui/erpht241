import DashboardSidebar from "@/components/DashboardSidebar";
import LeadGeneration from "@/app/listingorg/[id]/components/LeadGeneration";
import ContactsList from "@/app/listingorg/[id]/components/ListingContact";
import Darkpeack from "@/app/listingorg/[id]/components/Darkpeaker";
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
import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function Affiching() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex items-center">
          <div className="flex items-center gap-2 py-4 px-4">
            <SidebarTrigger className="" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList className="">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Tableau de Board</BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {" "}
                    <IoMdInformationCircleOutline
                      className="h-4 w-4"
                      color="gray"
                    />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator className="" />
        <Darkpeack />
        <LeadGeneration />
        <ContactsList />
      </SidebarInset>
    </SidebarProvider>
  );
}
