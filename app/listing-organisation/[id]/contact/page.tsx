"use client"
import React, { useEffect, useState } from "react";
import ContactdHeader from "@/app/listing-organisation/[id]/contact/components/ContactHeader";
import ContactsTables from "./components/ContactsTables";

export default function Page() {
  const [organisationId, setOrganisationId] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour extraire l'ID de l'organisation à partir de l'URL
    const getOrganisationIdFromUrl = () => {
      const urlPath = window.location.pathname;
      const regex = /\/listing-organisation\/([a-zA-Z0-9_-]+)\/contact/;
      const match = urlPath.match(regex);
      return match ? match[1] : null;
    };

    const id = getOrganisationIdFromUrl();
    setOrganisationId(id);
  }, []);

  return (
    <div>
      <ContactdHeader />
      {organisationId && <ContactsTables initialContacts={[]} organisationId={organisationId} />}
    </div>
  );
}
