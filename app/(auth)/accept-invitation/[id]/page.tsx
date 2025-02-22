// /app/accept-invitation/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';  // Ajout de useRouter pour la redirection

const AcceptInvitation = () => {
  const pathname = usePathname(); // Récupère le chemin de l'URL
  const router = useRouter(); // Permet de rediriger l'utilisateur
  const [idFromUrl, setIdFromUrl] = useState<string | null>(null);
  const [response, setResponse] = useState<{ id: string, token: string } | null>(null); // Pour stocker la réponse de l'API
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs

  useEffect(() => {
    // Utilisation de regex pour extraire l'ID du token dans l'URL
    const match = pathname?.match(/\/accept-invitation\/([A-Za-z0-9]+)/);
    if (match && match[1]) {
      setIdFromUrl(match[1]); // Extraire l'ID du token
    }
  }, [pathname]);

  useEffect(() => {
    // Si l'ID est disponible, envoyer une requête à l'API
    if (idFromUrl) {
      const fetchInvitationData = async () => {
        try {
          const response = await fetch(`/api/accept-invitation?token=${idFromUrl}`, {
            method: 'GET',
          });

          const data = await response.json();
          
          if (response.ok) {
            setResponse(data); // Sauvegarder la réponse (id et token)
            // Rediriger vers la page de login après avoir accepté l'invitation
            setTimeout(() => {
              router.push('/login');  // Redirige vers la page de connexion
            }, 2000);  // Délai de 2 secondes pour afficher un message de succès avant la redirection
          } else {
            setError(data.error || 'Erreur lors de l\'acceptation de l\'invitation');
          }
        } catch (error) {
          console.error('Erreur lors de la requête API', error);
          setError('Erreur serveur');
        }
      };

      fetchInvitationData();
    }
  }, [idFromUrl, router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Accepter l'Invitation</h1>
      {/* Afficher l'ID extrait */}
      <p>L'ID extrait du token est : {idFromUrl}</p>
      
      {/* Afficher la réponse de l'API */}
      {response && (
        <div>
          <p>ID reçu de l'API : {response.id}</p>
          <p>Token reçu de l'API : {response.token}</p>
          <p>Invitation acceptée avec succès ! Vous serez redirigé vers la page de connexion.</p>
        </div>
      )}

      {/* Afficher une erreur si elle existe */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default AcceptInvitation;
