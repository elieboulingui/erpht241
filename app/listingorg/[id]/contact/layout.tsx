

import ContactdHeader from "@/app/listingorg/[id]/contact/components/ContactHeader"
import  DashboardSidebar  from "@/app/listingorg/[id]/components/DashboardSidebar"
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  
  // Directly render the children
  return (
    <SidebarProvider>
      <div className="grid    w-full lg:grid-cols-[259px_1fr]">
        <DashboardSidebar />
        <div className="flex flex-col">
        <ContactdHeader/>
          <main className="bg-white">{children}</main>
        </div>
      </div>
      </SidebarProvider>
  )
}