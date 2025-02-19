import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OrganisationLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Vérifier si l'utilisateur est ADMIN
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login"); // Redirection côté serveur
  }

  return <>{children}</>;
}
