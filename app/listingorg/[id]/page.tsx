import { AppSidebar } from "@/app/listingorg/[id]/components/DashboardSidebar"
import LeadGeneration from "@/app/listingorg/[id]/components/Leadgeneration"
import ContactsList from "@/app/listingorg/[id]/components/ListingContact"
import Darkpeack from "@/app/listingorg/[id]/components/Darkpeaker"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import React from "react"
import { IoMdInformationCircleOutline } from "react-icons/io"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                  Overview
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                <BreadcrumbItem>
                  <BreadcrumbPage> <IoMdInformationCircleOutline className="h-4 w-4" color="gray" /></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
          </div>
          
        </header>
        <Darkpeack/>
        <LeadGeneration/>
        <ContactsList/>
      </SidebarInset>
    </SidebarProvider>
  )
}
