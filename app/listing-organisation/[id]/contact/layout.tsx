import DashboardSidebar from "@/components/DashboardSidebar";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface OrganisationLayoutProps {
  children: React.ReactNode;
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
      <div className=" w-full ">
        <main className="bg-white">{children}</main>
      </div>
    </SidebarProvider>
  );
}
