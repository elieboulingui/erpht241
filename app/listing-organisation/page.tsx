"use client"
import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import useSWR from "swr";
import { signOut } from "next-auth/react";
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const router = useRouter(); // To handle redirection

  const fetchOrganizations = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Une erreur s'est produite lors de la récupération des organisations.");
    }
    return response.json();
  };

  const { data, error, isLoading } = useSWR(
    `/api/listingorg?search=${search}&page=${page}&limit=10`,
    fetchOrganizations
  );

  // Handle search and pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && data?.totalPages && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const getImageUrl = (url: string) => {
    return url && (url.startsWith("http") || url.startsWith("https"))
      ? url
      : "/images/default-logo.png";
  };

  useEffect(() => {
    if (error) {
      toast.error("Erreur de connexion au serveur. Veuillez réessayer.");
    }
  }, [error]);

  // Redirect if no organizations are found
  useEffect(() => {
    if (data && data.organisations.length === 0) {
      window.location.href = "/create-organisation"; // Redirect immediately
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      {/* Logo and Heading */}
      <img src="/images/ht241.png" alt="Logo" className="w-24 h-24 mb-4" />
      <h2 className="text-xl font-bold">Organisations</h2>
      <p className="text-gray-500 mb-4">Allez dans une organisation ou créez une organisation</p>

      {/* Search and Add Organization Button */}
      <div className="flex items-center w-full max-w-md space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Recherche"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <Link href="/create-organisation" className="bg-black text-white px-4 py-2 rounded-md">
          Ajouter une organisation
        </Link>
      </div>

      {/* Organizations List */}
      <div className="w-full max-w-md mt-6">
        {isLoading ? (
          <Chargement />
        ) : (
          data?.organisations?.length > 0 ? (
            data.organisations.map((org: Organisation, index: number) => {
              const totalMembers = org.members.some((member) => member.id === org.ownerId)
                ? org.members.length
                : org.members.length + 1; // Include owner if not already counted

              return (
                <Link key={index} href={`/listing-organisation/${org.id}`} passHref>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md mb-3 cursor-pointer hover:shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={getImageUrl(org.logo)}
                          alt={`Logo de l'organisation ${org.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{org.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={20} className="text-gray-500" />
                      <span className="text-gray-700">{totalMembers}</span>
                      <button className="text-gray-500 hover:text-black">→</button>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div>Aucune organisation trouvée</div>
          )
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex space-x-4">
        {data?.organisations?.length === 5 && (
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-md"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data?.totalPages}
          >
            Suivant
          </button>
        )}
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-500 text-white rounded-md absolute bottom-4 right-4"
      >
        Se déconnecter
      </button>
    </div>
  );
}
