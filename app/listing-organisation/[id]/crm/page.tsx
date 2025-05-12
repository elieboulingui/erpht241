"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { HeaderCRM } from "./components/HeaderCRM";
import { ListDeal } from "./components/list-deal";
import { Merchant, Contact, Deal } from "./components/types";
import Chargement from "@/components/Chargement";

export default function CRM() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const match = window.location.pathname.match(/listing-organisation\/([^/]+)/);
        if (!match) throw new Error("ID d'organisation non trouvé");
        
        const organisationId = match[1];
        
        // Fetch merchants
        const merchantsRes = await fetch(`/api/member?organisationId=${organisationId}`);
        const merchantsData = await merchantsRes.json();
        setMerchants(merchantsData);
        
        // Fetch contacts
        const contactsRes = await fetch(`/api/contact?organisationId=${organisationId}`);
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
        
        // Fetch deals
        const dealsRes = await fetch(`/api/deal-stages?organisationId=${organisationId}`);
        const dealsData = await dealsRes.json();
        setDeals(dealsData);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex w-full overflow-hidden">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full h-full overflow-hidden">
        <HeaderCRM />
        
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Chargement />
          </div>
        ) : (
          <ListDeal 
          
          />
        )}
      </div>
    </div>
  );
}