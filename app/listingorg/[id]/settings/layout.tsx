import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) 
{
    const session = await auth();

    // Vérifier si l'utilisateur est ADMIN
    if (!session?.user || session.user.role !== "ADMIN") {
      redirect("/dashboard"); // Redirection côté serveur
    }
  return <div className="">{children}</div>;
}
