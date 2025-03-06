import DashboardSidebar from "@/components/DashboardSidebar";
import LeadGeneration from "@/app/listing-organisation/[id]/components/LeadGeneration";
import ContactsList from "@/app/listing-organisation/[id]/components/ListingContact";
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
import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { Button } from "@/components/ui/button";
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

          <div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FaGithub className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <BsTwitterX className="h-4 w-4" />
            </Button>
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
