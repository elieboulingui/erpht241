"use client"
import { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import Link from "next/link";
import { toast } from "sonner";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Organisation = {
  name: string;
  logo: string;
  members: { id: string; name: string; role: string }[];
};

export default function OrganizationsPage() {
  const [search, setSearch] = useState('');
  const [organizations, setOrganizations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/getorgmember?search=${search}&page=${page}&limit=10`);
      const data = await response.json();
      if (data.error) {
        toast.error(data.error || "Une erreur s'est produite lors de la récupération des organisations.");
        return;
      }
      setOrganizations(data.organisations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erreur de récupération des organisations:', error);
      toast.error("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [search, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getImageUrl = (url: string) => {
    // Vérifie si l'URL est valide
    return url && (url.startsWith('http') || url.startsWith('https')) ? url : '/images/default-logo.png'; // Image par défaut si l'URL est manquante ou invalide
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      <img src="/images/ht241.png" alt="Logo" className="w-24 h-24 mb-4" />
      <h2 className="text-xl font-bold">Organisations</h2>
      <p className="text-gray-500 mb-4">Allez dans une organisation </p>

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
        {/* <Link href="/organisationcreate" className="bg-black text-white px-4 py-2 rounded-md">
          Ajouter une organisation
        </Link> */}
      </div>

      <div className="w-full max-w-md mt-6">
        {loading ? (
          <div>Chargement...</div>
        ) : (
          organizations.length > 0 ? (
            organizations.map((org, index) => (
              <Link key={index} href={`/dashboard-organisation`} passHref>
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
                      {/* <p className="text-sm text-gray-500">{org.logo}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={20} className="text-gray-500" />
                    <span className="text-gray-700">{org.members.length}</span>
                    <button className="text-gray-500 hover:text-black">→</button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div>Aucune organisation trouvée</div>
          )
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded-md"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span>
          Page {page} sur {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-black rounded-md"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Suivant
        </button>
      </div>

      {/* Button positioned at bottom-right */}
      <button
        onClick={handleSignOut}
        className="px-4 py-2 bg-red-500 text-white rounded-md absolute bottom-4 right-4"
      >
        Se déconnecter
      </button>
    </div>
  );
}
