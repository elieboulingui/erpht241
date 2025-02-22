"use client"
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Utilisation de usePathname

const AcceptInvitation = () => {
  const pathname = usePathname(); // Récupère le chemin de l'URL
  const [idFromUrl, setIdFromUrl] = useState<string | null>(null);

  useEffect(() => {
    // Utilisation de regex pour extraire l'ID du token dans l'URL
    const match = pathname?.match(/\/accept-invitation\/([A-Za-z0-9]+)/);

    if (match && match[1]) {
      setIdFromUrl(match[1]); // Extraire l'ID du token
    }
  }, [pathname]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Accepter l'Invitation</h1>
      {/* Afficher l'ID extrait directement */}
      <p>L'ID extrait du token est : {idFromUrl}</p>
    </div>
  );
};

export default AcceptInvitation;
