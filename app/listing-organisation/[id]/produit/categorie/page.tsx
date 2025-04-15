"use client"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Chargement from "@/components/Chargement"
import DashboardSidebar from "@/components/DashboardSidebar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import ContactAddButton from "./components/ContactAddButton"
import { ProductCategoriesSelector } from "./components/ProductCategoriesSelector"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { IoMdInformationCircleOutline } from "react-icons/io"
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader"

// Type definitions for Category
interface Category {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  organisationId: string
  logo?: string | null
  productCount: number
  parentCategoryId?: string | null
  parentCategoryName?: string | null
}

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0) // Add a refresh key to force re-render

  // Extract organisation ID from URL
  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/)
    setOrganisationId(match ? match[1] : null)
  }, [pathname])

  // Fetch categories when organisationId changes or refreshKey changes
  useEffect(() => {
    if (organisationId) {
      setLoading(true)
      fetch(`/api/categories?organisationId=${organisationId}`)
        .then((res) => res.json())
        .then((data) => {
          setCategories(data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [organisationId, refreshKey])

  // Remplacer l'effet qui utilise MutationObserver par:

  // Supprimer cet effet qui cause des requêtes infinies
  useEffect(() => {
    // Écouter les événements de navigation pour rafraîchir les données
    const handleRouteChange = () => {
      if (organisationId) {
        setLoading(true)
        fetch(`/api/categories?organisationId=${organisationId}`)
          .then((res) => res.json())
          .then((data) => {
            setCategories(data)
            setLoading(false)
          })
          .catch(() => {
            setLoading(false)
          })
      }
    }

    // Créer un canal d'événements personnalisé pour la communication entre composants
    window.addEventListener("category-updated", handleRouteChange)

    return () => {
      window.removeEventListener("category-updated", handleRouteChange)
    }
  }, [organisationId])

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <BreadcrumbHeader
          title="Catégories"
          withSearch
          searchPlaceholder="Rechercher par catégorie..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        >
          <ContactAddButton />
        </BreadcrumbHeader>

        {/* Show loading spinner or categories */}
        <div className="p-3 flex-1">
          {loading ? (
            <Chargement />
          ) : (
            <ProductCategoriesSelector
              key={refreshKey} // Add key to force re-render when refreshKey changes
              selectedCategories={[]}
              setSelectedCategories={(categories: string[]) => { }}
              searchTerm={searchTerm}
            />
          )}
        </div>
      </div>
    </div>
  )
}

