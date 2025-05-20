"use client"

import { useState, useEffect, useCallback } from "react"
import DashboardSidebar from "@/components/DashboardSidebar"
import { Contact, Deal, Merchant } from "./components/types"
import { HeaderCRM } from "./components/HeaderCRM"
import { ListDeal } from "./components/list-deal"

export default function CRM() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getOrganisationId = useCallback(() => {
    const match = window.location.pathname.match(/listing-organisation\/([^/]+)/)
    return match ? match[1] : null
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organisationId = getOrganisationId()
        if (!organisationId) {
          throw new Error("ID d'organisation non trouvé")
        }

        const [merchantsRes, contactsRes] = await Promise.all([
          fetch(`/api/member?organisationId=${organisationId}`),
          fetch(`/api/contact?organisationId=${organisationId}`),
        ])

        if (!merchantsRes.ok || !contactsRes.ok) {
          throw new Error(`Erreur lors de la récupération des données`)
        }

        const [merchantsData, contactsData] = await Promise.all([
          merchantsRes.json(),
          contactsRes.json()
        ])

        setMerchants(merchantsData)
        setContacts(contactsData)
      } catch (error) {
        console.error("Erreur lors du chargement des données", error)
        setError(error instanceof Error ? error.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [getOrganisationId])

  if (error) {
    return (
      <div className="flex w-full overflow-hidden">
        <DashboardSidebar />
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-red-500 p-4 text-center">
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full overflow-hidden">
      <DashboardSidebar />
      
      <div className="w-full h-full overflow-hidden">
        <HeaderCRM />
        {/* Suppression du chargement conditionnel pour afficher tout en même temps */}
        <ListDeal 
          merchants={merchants} 
          contacts={contacts} 
          deals={deals} 
          isLoading={loading} 
        />
      </div>
    </div>
  )
}