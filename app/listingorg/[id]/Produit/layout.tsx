import ContactdHeader from "@/app/listingorg/[id]/contact/components/ContactHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./components/Sidebar";

interface OrganisationLayoutProps {
  children: React.ReactNode;
  // Add params to capture dynamic route data
}

export default function OrganisationLayout({
  children,
}: OrganisationLayoutProps) {
  // Destructure the `id` from params if needed

  return (
    <SidebarProvider>
      <div className="grid w-full grid-cols-[259px_1fr] min-h-screen">
        <DashboardSidebar />
        <div className="flex  w-full">
          <Sidebar />
          <main className="bg-white flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
