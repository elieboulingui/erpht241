import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Vérifier si l'utilisateur est ADMIN
  if (!session?.user) {
    redirect("/login"); // Redirection côté serveur
  }

  // Passer l'ID du propriétaire en tant que prop
  const ownerId = session.user.id;

  // Directly render the children
  return <>{children}</>;
}
