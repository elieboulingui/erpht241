"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/listingorg?search=${search}&page=${page}&limit=10`);
      
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

  // Utiliser useEffect pour récupérer les organisations à chaque changement de `search` ou `page`
  useEffect(() => {
    fetchOrganizations();
  }, [search, page]);

  // Gestion de la redirection en fonction des organisations récupérées
  useEffect(() => {
    if (organizations.length === 0) {
      router.push("/create-organisation");
    } else {
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
}
