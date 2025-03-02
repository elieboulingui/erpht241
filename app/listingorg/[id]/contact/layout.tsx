import ContactdHeader from "@/app/listingorg/[id]/contact/components/ContactHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface OrganisationLayoutProps {
  children: React.ReactNode;
  params: { id: string }; // Add params to capture dynamic route data
}

export default async function OrganisationLayout({
  children,
  params,
}: OrganisationLayoutProps) {
  const session = await auth();

  // Vérifier si l'utilisateur est ADMIN
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard"); // Redirection côté serveur
  }


  return (
    <SidebarProvider>
      <div className="grid w-full lg:grid-cols-[259px_1fr]">
        <DashboardSidebar />
        <div className="flex flex-col">
          <ContactdHeader  />
          <main className="bg-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
