import { AppSidebar } from "./components/app-sidebar";
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

import { ContactsOverview } from "./components/Contact";
import LeadGeneration from "./components/Leadgeneration";
import { DashboardHeaders } from "./components/header";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
            <DashboardHeaders/>
            </Breadcrumb>
          </div>
        </header>
      

        <div className="flex  flex-col pt-2 ">
          <LeadGeneration />
          <ContactsOverview />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
