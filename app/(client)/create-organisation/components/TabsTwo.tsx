"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"  // Importation pour la redirection avec Next.js 13+

// Domaines disponibles pour les organisations
const domains = [
  "AGRICULTURE",
  "ENERGIE",
  "LOGISTIQUE",
  "NUMERIQUE",
  "SECURITE",
  "TRANSPORT",
  "INFORMATIQUE",
  "SANTE",
  "EDUCATION",
  "FINANCE",
  "COMMERCE",
  "CONSTRUCTION",
  "ENVIRONNEMENT",
  "TOURISME",
  "INDUSTRIE",
  "TELECOMMUNICATIONS",
  "IMMOBILIER",
  "ADMINISTRATION",
  "ART_ET_CULTURE",
  "ALIMENTATION",
]

// Add a function to format domain names for display
const formatDomainName = (domain: string): string => {
  return domain
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

interface FormData {
  logo: string | null
  organizationName: string
  slug: string
  domain: string | null
  ownerId: string
}

interface DomainStepProps {
  formData: FormData
  setFormData: (data: FormData) => void
  onSubmit: () => void
  loading: boolean
}

export function DomainStep({ formData, setFormData, onSubmit, loading }: DomainStepProps) {
  const router = useRouter()  // Pour la redirection avec next/navigation
  // State to track current page of domains
  const [currentPage, setCurrentPage] = useState(0)
  // Number of domains to show per page (adjust based on screen size)
  const [domainsPerPage, setDomainsPerPage] = useState(3)

  // State to track if domain is selected
  const [domainError, setDomainError] = useState(false)

  // Calculate total number of pages
  const totalPages = Math.ceil(domains.length / domainsPerPage)

  // Get current domains to display
  const getCurrentDomains = () => {
    const start = currentPage * domainsPerPage
    const end = start + domainsPerPage
    return domains.slice(start, end)
  }

  // Handle domain selection
  const handleDomainSelect = (domain: string) => {
    setFormData({ ...formData, domain })
    setDomainError(false)  // Reset the error when domain is selected
  }

  // Navigation handlers
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // Update domains per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDomainsPerPage(1)
      } else if (window.innerWidth < 768) {
        setDomainsPerPage(2)
      } else {
        setDomainsPerPage(3)
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handle submit
  const handleSubmit = async () => {
    if (!formData.domain) {
      setDomainError(true)
      return
    }

    // Call the `onSubmit` function and handle successful organization creation
    await onSubmit()

    // If the creation is successful, navigate to the "listing-organisation" page
    router.push("/listing-organisation")  // Redirection vers la page de la liste des organisations
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Domaine d&apos;activité</h2>
        <p className="text-sm text-gray-500">Sélectionnez le domaine principal de votre organisation</p>
      </div>

      {/* Domain Selection Section with Navigation Buttons */}
      <div className="relative flex items-center">
        {/* Left Navigation Button */}
        <Button
          variant="outline"
          size="icon"
          className={`absolute left-0 z-10 rounded-full ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Précédent</span>
        </Button>

        {/* Domains Container */}
        <div className="w-full px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {getCurrentDomains().map((domain) => (
              <Card
                key={domain}
                className={`cursor-pointer transition-all hover:shadow-md border rounded-md ${formData.domain === domain ? "ring-2 ring-black border-transparent" : "border-gray-200 hover:border-gray-300"}`}
                onClick={() => handleDomainSelect(domain)}
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{formatDomainName(domain)}</CardTitle>
                    {formData.domain === domain && <Check className="h-5 w-5 text-black" />}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Navigation Button */}
        <Button
          variant="outline"
          size="icon"
          className={`absolute right-0 z-10 rounded-full ${currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Suivant</span>
        </Button>
      </div>

      {/* Page Indicator */}
      <div className="flex justify-center space-x-1 mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full ${currentPage === index ? "w-4 bg-black" : "w-1.5 bg-gray-300"}`}
          />
        ))}
      </div>

      {/* Error Message */}
      {domainError && <p className="text-red-500 text-sm">Veuillez sélectionner un domaine avant de soumettre.</p>}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="w-full py-3 bg-black hover:bg-black/90 text-white rounded-md"
        disabled={!formData.domain || loading}
      >
        {loading ? "Création en cours..." : "Créer l'organisation"}
      </Button>
    </div>
  )
}
