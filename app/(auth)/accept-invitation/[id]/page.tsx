"use client"
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const AcceptInvitation = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Get the 'token' query parameter from URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;

    const acceptInvitation = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/api/accept-invitation', { token });

        if (response.status === 200) {
          setSuccess(true);
        } else {
          setError('Une erreur est survenue lors de l\'acceptation de l\'invitation.');
        }
      } catch (error) {
        setError('Une erreur est survenue lors de l\'acceptation de l\'invitation.');
      } finally {
        setLoading(false);
      }
    };

    acceptInvitation();
  }, [token]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Accepter l'Invitation</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>L'invitation a été acceptée avec succès !</p>}
      {!loading && !success && !error && (
        <p>Nous vérifions votre invitation...</p>
      )}
    </div>
  );
};

export default AcceptInvitation;
