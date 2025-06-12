"use client";
import { useEffect, useState } from "react";
import ContactHeader from "./components/ContactHeader";
import ContactsTables from "./components/ContactsTables";
import { useSidebar } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function Page() {
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const { state } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const getOrganisationIdFromUrl = () => {
      const urlPath = window.location.pathname;
      const regex = /\/listing-organisation\/([a-zA-Z0-9_-]+)\/contact/;
      const match = urlPath.match(regex);
      return match ? match[1] : null;
    };

    const id = getOrganisationIdFromUrl();
    setOrganisationId(id);
  }, []);

  const handleContactAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex">
      <div>
        <DashboardSidebar />
      </div>
      <div
        className={`w-full transition-all duration-200 ease-in-out ${state === "collapsed" ? "lg:ml-0" : ""}`}
      >
        <ContactHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onContactAdded={handleContactAdded}
        />
        {organisationId && (
          <ContactsTables
            key={refreshKey}
            initialContacts={[]}
            organisationId={organisationId}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}