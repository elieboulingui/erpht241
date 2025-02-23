"use client"
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const res = await fetch('/api/getorgmember');
        const data = await res.json();

        if (res.ok) {
          setOrganisations(data); // On met les organisations dans le state
        } else {
          setError(data.error); // Si une erreur se produit, on l'affiche
        }
      } catch (err) {
        setError('Erreur lors de la récupération des organisations');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisations();
  }, []);

  if (loading) {
    return <div>Chargement des organisations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Mes organisations</h1>
      <ul>
        {organisations.length > 0 ? (
          organisations.map((organisation: any) => (
            <li key={organisation.id}>{organisation.name}</li>
          ))
        ) : (
          <li>Aucune organisation trouvée.</li>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
