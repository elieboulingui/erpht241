import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Vérifier si l'utilisateur est connecté et s'il est admin
  if (!session?.user) {
    // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
    redirect("/login");
  }

  // Si l'utilisateur est connecté et a le rôle "admin", rediriger vers la page de création d'organisation
  if (session.user.role === "ADMIN") {
    redirect("/organisationcreate");
  }

  // Passer l'ID du propriétaire en tant que prop (si nécessaire)
  const ownerId = session.user.id;

  // Directement rendre les enfants
  return <>{children}</>;
}
