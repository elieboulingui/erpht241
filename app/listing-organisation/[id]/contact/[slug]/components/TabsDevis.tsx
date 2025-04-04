"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import PaginationGlobal from "@/components/paginationGlobal"

import AddDevisButton from "./add-devis-button"
import ActiveFilters from "./active-filters"
import DevisDataTable from "./devis-data-table"
import UrlWarning from "./url-warning"
import DevisSearchBar from "./devis-search-bar"
import DevisFilters from "./devis-filters"
import { getDevisTableColumns } from "./devis-table-columns"
import { ALL_TAXES, type Devis, extractUrlParams } from "./devis-interface"
import DevisDetailsModal from "../ajout-devis/devis-details-modal"
import EditDevisModal from "../ajout-devis/edit-devis-modal"
import { DeleteDevisDialog } from "../ajout-devis/archive-devis-dialog"
import Chargement from "@/components/Chargement"

const DevisTable = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { organisationId, contactSlug } = extractUrlParams(pathname)
  const [isSaving, setIsSaving] = useState(false)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [idFilter, setIdFilter] = useState("")
  const [taxesFilter, setTaxesFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({})

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDevisId, setSelectedDevisId] = useState<string | null>(null)

  // Data state
  const [data, setData] = useState<Devis[]>([])

  // Ajouter un état de chargement
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data
  useEffect(() => {
    const fetchDevis = async () => {
      setIsLoading(true)
      try {
        // Extract contactId from the URL using regex
        const url = window.location.href
        const regex = /\/contact\/([a-zA-Z0-9]+)/
        const match = url.match(regex)

        if (!match || !match[1]) {
          console.error("Contact ID not found in URL")
          toast.error("Contact ID non trouvé dans l'URL")
          setIsLoading(false)
          return
        }

        const contactId = match[1]

        // Construct the API URL with the necessary query parameters
        const response = await fetch(`/api/tabsdevis?contactId=${contactId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const responseData = await response.json()
        console.log("Données brutes API :", responseData)

        // Handle different response formats
        let devisData = []
        if (responseData.results && Array.isArray(responseData.results)) {
          devisData = responseData.results
        } else if (responseData.data && Array.isArray(responseData.data)) {
          devisData = responseData.data
        } else if (Array.isArray(responseData)) {
          devisData = responseData
        }

        setData(devisData)
      } catch (error) {
        console.error("Erreur lors de la récupération des devis:", error)
        toast.error("Erreur lors de la récupération des devis")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevis()
  }, [currentPage, rowsPerPage])

  // URL validation
  useEffect(() => {
    if (!organisationId || !contactSlug) {
      console.error("Paramètres manquants dans l'URL:", {
        organisationId,
        contactSlug,
        pathname,
      })
      toast.error("Format d'URL invalide - Impossible d'extraire les paramètres", { position: "bottom-right" })
    }
  }, [organisationId, contactSlug, pathname])

  // Event handlers
  const handleStatusChange = async (devisId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/devis/${devisId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      setData(data.map((devis) => (devis.id === devisId ? { ...devis, status: newStatus } : devis)))

      toast.success("Statut du devis mis à jour", {
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // Use Promise.all to handle multiple delete requests in parallel
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/devis/${id}`, {
            method: "DELETE",
          }),
        ),
      )

      setData(data.filter((item) => !ids.includes(item.id)))
      toast.success("Devis supprimés avec succès", {
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erreur lors de la suppression des devis:", error)
      toast.error("Erreur lors de la suppression des devis")
    }
  }

  const handleAddDevis = (type: "manual" | "ai") => {
    if (!organisationId || !contactSlug) {
      toast.error(
        `Paramètres manquants:
        Organisation: ${organisationId || "Non trouvé"}
        Contact: ${contactSlug || "Non trouvé"}`,
        { position: "bottom-right" },
      )
      return
    }

    if (type === "manual") {
      router.push(`/listing-organisation/${organisationId}/contact/${contactSlug}/ajout-devis`)
    } else {
      setIsAIGeneratorOpen(true)
    }
  }

  const handleSaveNewDevis = async (devisData: any) => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/devis?organisationId=${organisationId}&contactId=${contactSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(devisData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const newDevis = await response.json()
      setData((prev) => [...prev, newDevis])
      setIsAIGeneratorOpen(false)

      toast.success("Devis créé avec succès", {
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error)
      toast.error("Erreur lors de la création du devis")
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewDetails = (devisId: string) => {
    setSelectedDevisId(devisId)
    setIsDetailsModalOpen(true)
  }

  const handleEditDevis = (devisId: string) => {
    if (!organisationId || !contactSlug) {
      toast.error("Impossible de modifier - paramètres d'URL manquants", {
        position: "bottom-right",
      })
      return
    }

    setSelectedDevisId(devisId)
    setIsEditModalOpen(true)
  }

  const handleUpdateDevis = async (updatedData: any) => {
    try {
      const response = await fetch(`/api/devis/${updatedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Update the data in the state with proper type handling
      setData(
        data.map((devis) =>
          devis.id === updatedData.id
            ? {
                ...devis,
                ...updatedData,
                dateFacturation: updatedData.creationDate
                  ? new Date(updatedData.creationDate).toLocaleDateString("fr-FR")
                  : devis.dateFacturation || "",
                dateEcheance: updatedData.dueDate
                  ? new Date(updatedData.dueDate).toLocaleDateString("fr-FR")
                  : devis.dateEcheance || "",
                taxType: updatedData.products?.some((p: any) => p.tax > 0) ? "TVA" : "Hors Taxe",
              }
            : devis,
        ),
      )

      toast.success("Devis mis à jour avec succès", {
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erreur lors de la mise à jour du devis:", error)
      toast.error("Erreur lors de la mise à jour du devis")
    }
  }

  const handleDeleteDevis = (devisId: string) => {
    setSelectedDevisId(devisId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteDevis = async () => {
    if (!selectedDevisId) return

    try {
      const response = await fetch(`/api/devis/${selectedDevisId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      setData(data.filter((devis) => devis.id !== selectedDevisId))
      setIsDeleteDialogOpen(false)

      toast.success("Devis supprimé avec succès", {
        position: "bottom-right",
        duration: 3000,
      })
    } catch (error) {
      console.error("Erreur lors de la suppression du devis:", error)
      toast.error("Erreur lors de la suppression du devis")
    }
  }

  // Filter functions
  const addFilter = (type: string, value: string) => {
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters([...activeFilters, `${type}:${value}`])
    }
    setCurrentPage(1)
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
    const [type, value] = filter.split(":")
    if (type === "taxes") setTaxesFilter(taxesFilter.filter((t) => t !== value))
    else if (type === "statut") setStatusFilter(statusFilter.filter((s) => s !== value))
    else if (type === "id") setIdFilter("")
    else if (type === "date") setDateFilter({})
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setIdFilter("")
    setTaxesFilter([])
    setStatusFilter([])
    setDateFilter({})
    setCurrentPage(1)
  }

  const toggleTaxesFilter = (tax: string) => {
    if (taxesFilter.includes(tax)) {
      setTaxesFilter(taxesFilter.filter((t) => t !== tax))
      removeFilter(`taxes:${tax}`)
    } else {
      setTaxesFilter([...taxesFilter, tax])
      addFilter("taxes", tax)
    }
  }

  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status))
      removeFilter(`statut:${status}`)
    } else {
      setStatusFilter([...statusFilter, status])
      addFilter("statut", status)
    }
  }

  const applyIdFilter = () => {
    if (idFilter) {
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("id:")))
      addFilter("id", idFilter)
    }
  }

  // Filter data
  const filteredData = data?.filter((devis) => {
    // Filtre par recherche globale
    const matchesSearch =
      searchTerm === "" ||
      devis.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.devisNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (devis.status?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (devis.taxType?.toLowerCase() || "").includes(searchTerm.toLowerCase())

    // Filtre par ID
    const matchesId = idFilter === "" || devis.id?.includes(idFilter) || devis.devisNumber?.includes(idFilter)

    // Filtre par taxes
    const matchesTaxes = taxesFilter.length === 0 || taxesFilter.includes(devis.taxType)

    // Filtre par statut
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(devis.status)

    // Filtre par date
    const matchesDate =
      !dateFilter.start ||
      !dateFilter.end ||
      (devis.dateFacturation &&
        new Date(devis.dateFacturation) >= dateFilter.start &&
        new Date(devis.dateFacturation) <= dateFilter.end)

    return matchesSearch && matchesId && matchesTaxes && matchesStatus && matchesDate
  })

  // Get table columns
  const columns = getDevisTableColumns({
    handleBulkDelete,
    handleStatusChange,
    handleViewDetails,
    handleEditDevis,
    handleDeleteDevis,
    // dateFilter,
    // setDateFilter,
    addFilter,
    removeFilter,
    taxesFilter,
    toggleTaxesFilter,
    statusFilter,
    toggleStatusFilter,
    ALL_TAXES,
  })

  const totalItems = filteredData?.length || 0
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  return (
    <div className="relative pb-16">
      <UrlWarning organisationId={organisationId} contactSlug={contactSlug} pathname={pathname} />

      <Tabs defaultValue="devis">
        <TabsContent value="devis" className="p-0">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-2 flex-1">
                <DevisSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />

                <DevisFilters
                  idFilter={idFilter}
                  setIdFilter={setIdFilter}
                  taxesFilter={taxesFilter}
                  setTaxesFilter={setTaxesFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  // dateFilter={dateFilter}
                  // setDateFilter={setDateFilter}
                  addFilter={addFilter}
                  removeFilter={removeFilter}
                  toggleTaxesFilter={toggleTaxesFilter}
                  toggleStatusFilter={toggleStatusFilter}
                  applyIdFilter={applyIdFilter}
                />
              </div>

              <AddDevisButton
                organisationId={organisationId}
                contactSlug={contactSlug}
                handleAddDevis={handleAddDevis}
              />
            </div>

            <ActiveFilters
              activeFilters={activeFilters}
              removeFilter={removeFilter}
              clearAllFilters={clearAllFilters}
            />
          </div>

          {isLoading ? <Chargement /> : <DevisDataTable data={filteredData as any} columns={columns} />}
        </TabsContent>
      </Tabs>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />

      {selectedDevisId && (
        <>
          <DevisDetailsModal open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} devisId={selectedDevisId} />

          <EditDevisModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            devisId={selectedDevisId}
            organisationId={organisationId}
            contactSlug={contactSlug}
            onSaveDevis={handleUpdateDevis}
          />

          <DeleteDevisDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDeleteDevis}
            devisId={selectedDevisId}
          />
        </>
      )}
    </div>
  )
}

export default DevisTable

