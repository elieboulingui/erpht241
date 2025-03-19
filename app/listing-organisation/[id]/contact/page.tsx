"use client"
import { useEffect, useState } from "react"
import ContactHeader from "./components/ContactHeader"
import ContactsTables from "./components/ContactsTables"
import { useSidebar } from "@/components/ui/sidebar"

export default function Page() {
  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const { state } = useSidebar()

  useEffect(() => {
    // Fonction pour extraire l'ID de l'organisation à partir de l'URL
    const getOrganisationIdFromUrl = () => {
      const urlPath = window.location.pathname
      const regex = /\/listing-organisation\/([a-zA-Z0-9_-]+)\/contact/
      const match = urlPath.match(regex)
      return match ? match[1] : null
    }

    const id = getOrganisationIdFromUrl()
    setOrganisationId(id)
  }, [])

  return (
    <div className={`w-full transition-all duration-200 ease-in-out ${state === "collapsed" ? "lg:ml-0" : ""}`}>
      <ContactHeader />
      {organisationId && <ContactsTables initialContacts={[]} organisationId={organisationId} />}
    </div>
  )
}

