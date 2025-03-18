"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";
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
  const router = useRouter(); // Pour la redirection

  const fetchOrganizations = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Une erreur s'est produite lors de la récupération des organisations.");
    }
    return response.json();
  };

  // Récupérer les organisations avec SWR
  const { data, error, isLoading } = useSWR(
    `/api/listingorg?search=${search}&page=${page}&limit=10`,
    fetchOrganizations
  );

  // Gestion de la redirection en fonction des organisations récupérées
  useEffect(() => {
    if (data) {
      // Vérification si data.organizations existe avant de lire la longueur
      const organizations = data.organizations || [];
      
      if (organizations.length === 0) {
        router.push("/create-organisation");
      } else if (organizations.length >= 1) {
        router.push("/listing-organisation");
      } else {
        router.push("/create-organisation");
      }
    }
  }, [data, router]);

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      toast.error("Erreur de connexion au serveur. Veuillez réessayer.");
    }
  }, [error]);

  // Si la page est en chargement, affiche un composant de chargement
  if (isLoading) {
    return <Chargement />;
  }

  // Si des organisations existent, les afficher
  if (data?.organizations && data.organizations.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
        <h1 className="text-2xl font-semibold mb-6">Liste des Organisations</h1>
        <ul>
          {data.organizations.map((org: Organisation) => (
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
}
