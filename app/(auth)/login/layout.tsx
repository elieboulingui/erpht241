import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Vérifier si l'utilisateur est connecté
  if (!session?.user) {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion,
    // mais éviter la redirection si l'utilisateur est déjà sur /login
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      return redirect("/login");
    }
  }

  // Si l'utilisateur est connecté et a le rôle "admin", rediriger vers la page de création d'organisation
  if (session?.user.role === "ADMIN") {
    return redirect("/listingorg");
  }

  // Passer l'ID du propriétaire en tant que prop si nécessaire
  const ownerId = session?.user.id;

  // Rendre les enfants si tout va bien
  return <>{children}</>;
}
