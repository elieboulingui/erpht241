"use client"
import { useState, useCallback, type JSX, useEffect } from "react"
import useSWR from "swr"
import { useRouter, useParams } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { deleteCategoryById } from "../action/deleteCategoryById"
import { updateCategoryById } from "../action/Update"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Chargement from "@/components/Chargement"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import PaginationGlobal from "@/components/paginationGlobal"
import { ArrowDownUp, Loader2 } from "lucide-react"
import { UploadButton } from "@/utils/uploadthing"
import { DialogHeader } from "@/components/ui/dialog"
import { DeleteCategoryDialog } from "./DeleteCategoryDialog"

interface Category {
  id: string
  name: string
  description?: string
  productCount: number
  parentId?: string | null
  children?: Category[]
  logo?: string
}

interface ProductCategoriesSelectorProps {
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  searchTerm: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ProductCategoriesSelector({
  selectedCategories,
  setSelectedCategories,
  searchTerm,
}: ProductCategoriesSelectorProps) {
  // State hooks
  const [organisationId, setOrganisationId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      setOrganisationId(id as string)
    } else {
      const path = window.location.pathname
      const match = path.match(/\/listing-organisation\/([^/]+)\/produit\/categorie/)
      setOrganisationId(match ? match[1] : null)
    }
  }, [id])

  // Fetching data with SWR
  const categoriesUrl = organisationId ? `/api/categorieofia?organisationId=${organisationId}` : null
  const productsUrl = organisationId ? `/api/produict?organisationId=${organisationId}` : null

  const {
    data: categories,
    error: categoriesError,
    mutate: mutateCategories,
  } = useSWR(categoriesUrl, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const { data: products, error: productsError } = useSWR(productsUrl, fetcher)

  // Toggle selected categories
  const toggleCategory = useCallback(
    (categoryId: string) => {
      const newSelectedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId]
      setSelectedCategories(newSelectedCategories)
    },
    [selectedCategories, setSelectedCategories],
  )

  // Count products in each category
  const countProductsInCategories = (categories: Category[], products: any[]) => {
    return categories.map((category) => {
      const productCount =
        products?.filter((product: { categories: { id: string }[] }) =>
          product.categories?.some((cat) => cat.id === category.id),
        ).length || 0
      return { ...category, productCount }
    })
  }

  // Filter categories based on the search term
  const filteredCategories = categories?.filter((category: { name: string; description: string }) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      category.name.toLowerCase().includes(searchLower) ||
      (category.description && category.description.toLowerCase().includes(searchLower))
    )
  })

  // Render categories (with children if any)
  const renderCategory = useCallback(
    (category: Category, depth = 0, parentCategory: Category | null = null): JSX.Element => (
      <>
        <TableRow key={category.id}>
          <TableCell className="p-4">
            <Checkbox
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onCheckedChange={() => toggleCategory(category.id)}
            />
          </TableCell>
          <TableCell className="p-4 text-sm font-medium text-gray-700">
            {depth > 0 ? (
              <span className="flex items-center">
                {category.name}
                <span className="bg-[#7f1d1c] text-white font-semibold px-1 py-0.5 rounded mx-1">
                  Sous-catégories de {parentCategory?.name || "Inconnu"}
                </span>
              </span>
            ) : (
              <Link
                href={`/listing-organisation/${organisationId}/produit/categorie/${category.id}`}
                className="text-gray-700 hover:text-gray-900"
              >
                {category.name}
              </Link>
            )}
          </TableCell>
          <TableCell className="p-4 text-sm text-gray-500">{category.description || "Pas de description"}</TableCell>
          <TableCell className="p-4 text-sm text-gray-500">{category.productCount}</TableCell>
          <TableCell className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-600 hover:text-gray-800">
                  <span className="material-icons">...</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleUpdateCategory(category)}>Modifier</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategoryConfirmation(category)}>
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {category.children?.map((child) => renderCategory(child, depth + 1, category))}
      </>
    ),
    [selectedCategories, toggleCategory, organisationId],
  )

  // Handle updating category
  const handleUpdateCategory = (category: Category) => {
    setCategoryToUpdate(category)
    setIsSheetOpen(true)
  }

  const handleCategoryUpdate = async () => {
    if (categoryToUpdate) {
      setIsUpdating(true)

      const updatedData = {
        name: categoryToUpdate.name || "",
        description: categoryToUpdate.description || "",
        logo: categoryToUpdate.logo || null,
      }

      try {
        await updateCategoryById(categoryToUpdate.id, updatedData)
        setIsSheetOpen(false)
        toast.success("Catégorie mise à jour avec succès")
        mutateCategories(undefined, { revalidate: true })
        window.dispatchEvent(new Event("category-updated"))
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de la catégorie")
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleLogoUpdate = (res: any[]) => {
    setCategoryToUpdate((prev) => {
      if (prev) {
        return { ...prev, logo: res[0].ufsUrl }
      }
      return prev
    })
  }

  // Handle deleting category
  const handleDeleteCategoryConfirmation = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      setIsDeleting(true)
      try {
        await deleteCategoryById(categoryToDelete.id)
        toast.success("Catégorie supprimée avec succès")
        setIsDeleteDialogOpen(false)
        mutateCategories(undefined, { revalidate: true })
        window.dispatchEvent(new Event("category-updated"))
      } catch (error) {
        toast.error("Erreur lors de la suppression de la catégorie")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const refreshData = () => {
    mutateCategories()
  }

  // Loading and error states
  const loading = !categories || !products
  const error = categoriesError || productsError

  // Check if categories is an array before using slice
  const isCategoriesValid = Array.isArray(categories)

  // Pagination logic
  const totalItems = isCategoriesValid ? filteredCategories?.length || 0 : 0
  const totalPages = Math.ceil(totalItems / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage

  // Safely slice categories if valid
  const paginatedCategories = isCategoriesValid
    ? countProductsInCategories(filteredCategories?.slice(startIndex, startIndex + rowsPerPage) || [], products || [])
    : []

  useEffect(() => {
    const handleCategoryUpdate = () => {
      mutateCategories()
    }

    window.addEventListener("category-updated", handleCategoryUpdate)
    return () => {
      window.removeEventListener("category-updated", handleCategoryUpdate)
    }
  }, [mutateCategories])

  return (
    <>
      <Table className="w-full border-t border-b border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <TableCaption></TableCaption>
        <TableHeader className="bg-gray-300 text-white">
          <TableRow>
            <TableHead>
              <div className="flex items-center">
                <Checkbox className="h-4 w-4 ml-2" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Nom de la catégorie
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Description
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Nombre de produits
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                <Chargement />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Une erreur s'est produite lors du chargement des données.
              </TableCell>
            </TableRow>
          ) : !isCategoriesValid || categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                Aucune catégorie trouvée.
              </TableCell>
            </TableRow>
          ) : (
            paginatedCategories.map((category) => renderCategory(category, 0))
          )}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems || 0}
      />

      {/* Sheet to Update Category */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!isUpdating) setIsSheetOpen(open)
        }}
      >
        <SheetTrigger asChild>
          <button className="hidden">Open</button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Modifier la catégorie</SheetTitle>
            <SheetDescription>Modifiez les informations de cette catégorie.</SheetDescription>
          </SheetHeader>
          {categoryToUpdate && (
            <div className="p-4">
              <Label htmlFor="category-name">Nom:</Label>
              <Input
                id="category-name"
                type="text"
                value={categoryToUpdate.name}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Label htmlFor="category-description" className="mt-4">
                Description:
              </Label>
              <textarea
                id="category-description"
                value={categoryToUpdate.description || ""}
                onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, description: e.target.value })}
                rows={3}
                style={{ resize: "none" }}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Label htmlFor="category-logo" className="mt-4">
                Logo de la catégorie:
              </Label>
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-[#7f1d1c] text-white ut-button:ut-readying:bg-[#7f1d1c]"
                onClientUploadComplete={handleLogoUpdate}
                onUploadError={(error) => {
                  toast.error(`Erreur de téléchargement : ${error.message}`)
                }}
              />
              {categoryToUpdate.logo && (
                <div className="mt-4">
                  <img
                    src={categoryToUpdate.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              )}
              <Button
                onClick={handleCategoryUpdate}
                className="mt-4 w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        categoryToDelete={categoryToDelete || undefined}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCategory}
      />
    </>
  )
}