
import { DashboardHeader } from "@/app/dashboard/[id]/components/DashboardHeader";
import { redirect } from "next/navigation";

import React from "react";


// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  
  // Directly render the children
  return (
      <div className="grid   w-full lg:grid-cols-[0px_1fr]">
        <DashboardHeader />
        <div className="flex flex-col">
          <main>{children}</main>
        </div>
      </div>
  
  )
}