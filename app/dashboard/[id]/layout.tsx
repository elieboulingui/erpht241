

import { redirect } from "next/navigation";
import React from "react";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  // Vérifier si l'utilisateur est ADMIN


  // Directly render the children
  return <div className="flex flex-col gap-2">

    {children}</div>;
}
