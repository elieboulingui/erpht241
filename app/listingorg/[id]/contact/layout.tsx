import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "../components/dashboardSidebar";
import ContactdHeader from "../components/ContactHearder";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Vérifier si l'utilisateur est ADMIN
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard"); // Redirection côté serveur
  }

  // Passer l'ID du propriétaire en tant que prop
  const ownerId = session.user.id;
  
  // Directly render the children
  return (
      <div className="grid   w-full lg:grid-cols-[259px_1fr]">
        <AppSidebar />
        <div className="flex flex-col">
        <ContactdHeader/>
          <main className="bg-white">{children}</main>
        </div>
      </div>
  
  )
}
