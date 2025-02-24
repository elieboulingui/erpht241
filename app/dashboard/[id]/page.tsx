"use client"
import React, { useEffect, useState } from 'react';
import { getorganisation } from './action/getorganisation';  // Ensure this path is correct

interface Organisation {
  name: string;
  logo: string | null;  // logo can be either a string or null
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganisation = async () => {
      try {
        // Unwrap the Promise and get the ID
        const { id } = await params;

        const response = await getorganisation(id);  // Fetch the organisation data based on ID
        
        if (!response) {
          throw new Error('No data found for this organisation');
        }

        setOrganisation(response);  // Set the fetched data into state
      } catch (err) {
        setError((err as Error).message);  // Set error message in case of failure
      } finally {
        setLoading(false);  // Set loading state to false once data is fetched
      }
    };

    fetchOrganisation();
  }, [params]);  // Dependency on params so the effect runs when the Promise resolves

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Organisation</h1>
      {organisation ? (
        <pre>{JSON.stringify(organisation, null, 2)}</pre>  // Display the data
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}
