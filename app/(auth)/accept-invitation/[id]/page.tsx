'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const LoadingPanda = () => {
  return (
    <div className="flex flex-col items-center">
      <img
        src="/images/ht241.png"
        alt="Chargement"
        className="w-80 h-80 animate-pulse"
      />
      <p className="mt-4 text-xl font-semibold text-gray-700">
        Chargement en cours...
      </p>
    </div>
  );
};

const AcceptInvitation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [idFromUrl, setIdFromUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const match = pathname?.match(/\/accept-invitation\/([A-Za-z0-9]+)/);
    if (match && match[1]) {
      setIdFromUrl(match[1]);
    }
  }, [pathname]);

  useEffect(() => {
    if (idFromUrl) {
      const fetchInvitationData = async () => {
        try {
          const response = await fetch(`/api/accept-invitation?token=${idFromUrl}`, {
            method: 'GET',
          });

          const data = await response.json();

          if (response.ok) {
            toast.success("Invitation acceptée ! Redirection en cours...");
            setTimeout(() => router.push('/login'), 2000);
          } else {
            setError(data.error || 'Une erreur est survenue.');
            toast.error(data.error || "Erreur lors de l'acceptation.");
          }
        } catch (error) {
          console.error('Erreur API', error);
          setError('Erreur serveur');
          toast.error('Erreur serveur');
        } finally {
          setIsLoading(false);
        }
      };

      fetchInvitationData();
    }
  }, [idFromUrl, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {isLoading ? (
        <LoadingPanda />
      ) : error ? (
        <div className="text-red-500">
          <p>Erreur : {error}</p>
        </div>
      ) : (
        <p className="text-green-500 text-xl font-semibold">
          Invitation acceptée ! Redirection en cours...
        </p>
      )}
    </div>
  );
};

export default AcceptInvitation;
