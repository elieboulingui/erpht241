import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Pass ownerId and email as props to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Vérifier si l'utilisateur est ADMIN

  // Récupérer l'ID du propriétaire et l'email de l'utilisateur


  // Passer l'ID et l'email en tant que props aux enfants
  return <>{children}</>;
}
