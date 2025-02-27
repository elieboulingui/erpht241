import ContactdHeader from "@/app/listingorg/[id]/contact/components/ContactHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import HeaderInvite from "./components/HeaderInvite";

interface OrganisationLayoutProps {
  children: React.ReactNode;
 
}

export default function OrganisationLayout({
  children,

}: OrganisationLayoutProps) {
// Destructure the `id` from params

  return (
    <SidebarProvider>
      <div className="grid w-full lg:grid-cols-[259px_1fr]">
        <DashboardSidebar />
        <div className="flex flex-col">
        <HeaderInvite/>
          <main className="bg-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
