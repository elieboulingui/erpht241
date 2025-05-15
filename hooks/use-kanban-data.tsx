"use client"

import { DealStag } from "@/app/listing-organisation/[id]/crm/components/types"
import { useState, useRef, useEffect, useCallback } from "react"

type CardType = {
  id: string
  title: string
  description?: string
  amount?: number
  deadline?: string
  merchantId?: string | null
  contactId?: string | null
  tags?: string[]
}

type ListType = {
  id: string
  label: string
  title: string
  color?: string
  cards: CardType[]
  archived?: boolean
}

export function useKanbanData() {
  const [lists, setLists] = useState<ListType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const stagesCache = useRef<Map<string, DealStag[]>>(new Map())

  const getOrganisationId = useCallback(() => {
    const match = window.location.href.match(/\/listing-organisation\/([^/]+)\/crm/)
    return match ? match[1] : null
  }, [])

  const formatStagesData = (data: DealStag[]) => {
    return data.map((stage) => ({
      id: stage.id,
      label: stage.label,
      title: stage.label,
      color: stage.color || undefined,
      cards: stage.opportunities.map(
        (opp: {
          id: any
          label: any
          description: any
          amount: any
          deadline: any
          merchantId: any
          contactId: any
          tags: any
        }) => ({
          id: opp.id,
          title: opp.label,
          description: opp.description,
          amount: opp.amount,
          deadline: opp.deadline,
          merchantId: opp.merchantId,
          contactId: opp.contactId,
          tags: opp.tags || [],
        }),
      ),
    }))
  }

  const fetchStages = useCallback(async (organisationId: string) => {
    try {
      setLoading(true)

      // Check if we have cached data
      if (stagesCache.current.has(organisationId)) {
        const cachedData = stagesCache.current.get(organisationId)
        if (cachedData) {
          const formattedLists = formatStagesData(cachedData)
          setLists(formattedLists)
          setLoading(false)
          return
        }
      }

      const res = await fetch(`/api/deal-stages?organisationId=${organisationId}`)

      if (!res.ok) {
        const responseBody = await res.json()
        throw new Error(`Échec de la récupération des étapes de deal: ${JSON.stringify(responseBody)}`)
      }

      const data: DealStag[] = await res.json()

      // Cache the data
      stagesCache.current.set(organisationId, data)

      const formattedLists = formatStagesData(data)
      setLists(formattedLists)
      setError(null)
    } catch (e) {
      console.error("Erreur lors de la récupération des étapes de deal", e)
      setError(e instanceof Error ? e.message : "Échec de la récupération des données")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const organisationId = getOrganisationId()
    if (!organisationId) {
      setError("ID de l'organisation non trouvé dans l'URL")
      setLoading(false)
      return
    }

    fetchStages(organisationId)
  }, [fetchStages, getOrganisationId])

  return {
    lists,
    setLists,
    loading,
    error,
    isUpdating,
    setIsUpdating,
    fetchStages,
    getOrganisationId,
    stagesCache,
  }
}
