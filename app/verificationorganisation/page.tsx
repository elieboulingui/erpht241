"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Importer useSession
import Chargement from "@/components/Chargement";

type Organisation = {
  id: string;
  name: string;
  logo: string;
  members: { id: string; name: string; role: string }[];
  ownerId: string;
};

export default function OrganizationsPage() {
  const [search, setSearch] = useState(""); // Recherche d'organisations
  const [page, setPage] = useState(1); // Pagination
  const [organizations, setOrganizations] = useState<Organisation[]>([]); // Stockage des organisations
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs
  const router = useRouter(); // Pour la redirection
  const { data: session, status } = useSession(); // Utilisation de useSession pour récupérer la session

  // Vérification de la session et de l'email
  const fetchOrganizations = async () => {
    if (!session || !session.user?.email) {
      setError("Vous devez être connecté pour voir les organisations.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/listing?&email=${session.user.email}`);
      
      if (!response.ok) {
        throw new Error("Une erreur s'est produite lors de la récupération des organisations.");
      }

      const data = await response.json();
      setOrganizations(data.organizations || []); // Sauvegarde les organisations récupérées
    } catch (err) {
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utiliser useEffect pour récupérer les organisations à chaque changement de `search` ou `page`, et à la connexion
  useEffect(() => {
    if (status === "authenticated") {
      fetchOrganizations();
    }
  }, [search, page, session, status]);

  // Gestion de la redirection en fonction des organisations récupérées
  useEffect(() => {
    if (organizations.length === 0) {
      router.push("/create-organisation");
    } else if (organizations.length === 1) {
      router.push("/listing-organisation");
    }
  }, [organizations, router]);

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Si la page est en chargement, affiche un composant de chargement
  if (isLoading) {
    return <Chargement />;
  }

  // Si des organisations existent, les afficher
  if (organizations.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
        <h1 className="text-2xl font-semibold mb-6">Liste des Organisations</h1>
        <ul>
          {organizations.map((org: Organisation) => (
            <li key={org.id} className="mb-6 border-b pb-4">
              <div className="flex items-center">
                <img
                  src={org.logo || "/images/default-logo.png"}
                  alt={org.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="font-semibold text-lg">{org.name}</h2>
                  <p className="text-sm">
                    Propriétaire: {org.members.find((member) => member.id === org.ownerId)?.name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Si aucune organisation n'est trouvée, on ne retourne rien
  return null;
}
