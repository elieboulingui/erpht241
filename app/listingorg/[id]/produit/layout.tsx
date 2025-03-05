import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface OrganisationLayoutProps {
  children: React.ReactNode;
  // Add params to capture dynamic route data
}

export default async function OrganisationLayout({
  children,
}: OrganisationLayoutProps) {
  const session = await auth();

  // Vérifier si l'utilisateur est ADMIN
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard"); // Redirection côté serveur
  }


  return (
    <SidebarProvider>
      <div className="grid w-full grid-cols-[259px_1fr] min-h-screen">
        <DashboardSidebar />
        <div className="flex  w-full">
          <main className="bg-white flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
