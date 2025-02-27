
import { redirect } from "next/navigation";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  // Vérifier si l'utilisateur est connecté
 

  // Rendre les enfants si tout va bien
  return <>{children}</>;
}
