"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, PenIcon, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadButton } from "@/utils/uploadthing"
import { toast } from "sonner"
import { createCategory } from "../action/CreatCategories"
import { createSubCategory } from "../action/CreateSubCategories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Generateiacategorie } from "./generateiacategories"
import { useRouter } from "next/navigation"

interface FormData {
  logo?: string
  subLogo?: string
  subCategoryId?: string
}

export default function ContactAddButton() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isManual, setIsManual] = useState(false)
  const [isAI, setIsAI] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [organisationId, setOrganisationId] = useState<string>("")
  const [isSubCategory, setIsSubCategory] = useState(false)
  const [formData, setFormData] = useState<FormData>({})
  const [categoryName, setCategoryName] = useState("") // For main category name
  const [subCategoryName, setSubCategoryName] = useState("") // For sub-category name
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Extract organisation ID from the URL
  useEffect(() => {
    const orgId = window.location.pathname.match(/\/listing-organisation\/([^/]+)/)?.[1]
    if (orgId) {
      setOrganisationId(orgId)
    }
  }, [])

  // Fetch categories for selecting parent category in sub-category form
  useEffect(() => {
    if (organisationId) {
      const fetchCategories = async () => {
        try {
          const response = await fetch(`/api/categorie?organisationId=${organisationId}`)
          const data = await response.json()
          setCategories(data)
        } catch (error) {
          console.error("Failed to fetch categories:", error)
        }
      }
      fetchCategories()
    }
  }, [organisationId])

  // Reset form fields
  const resetForm = () => {
    setCategoryName("")
    setSubCategoryName("")
    setDescription("")
    setFormData({})
  }

  // Handle form submission for main category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = categoryName.trim()
    if (!trimmedName || !organisationId) {
      toast.error("Nom de catégorie et organisation requis.")
      return
    }

    setIsSubmitting(true)

    try {
      await createCategory({
        name: trimmedName,
        description: description.trim(),
        organisationId,
        logo: formData.logo || "",
      })

      toast.success("Catégorie créée avec succès.")
      resetForm()
      setIsManual(false) // Close the sheet

      // Remplacer router.refresh() par:
      window.dispatchEvent(new Event("category-updated"))
    } catch (error) {
      toast.error("Erreur lors de la création de la catégorie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission for sub-category
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedSubName = subCategoryName.trim()
    const selectedCategoryId = formData.subCategoryId || ""
    if (!trimmedSubName || !selectedCategoryId) {
      toast.error("Nom et catégorie parente requis.")
      return
    }

    setIsSubmitting(true)

    try {
      await createSubCategory({
        name: trimmedSubName,
        description: description.trim(),
        logo: formData.subLogo || "",
        parentId: selectedCategoryId,
        organisationId,
      })

      toast.success("Sous-catégorie créée avec succès.")
      resetForm()
      setIsManual(false) // Close the sheet

      // Remplacer router.refresh() par:
      window.dispatchEvent(new Event("category-updated"))
    } catch (error) {
      toast.error("Erreur lors de la création de la sous-catégorie.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Dropdown Menu for manual/AI selection */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg">
            <Plus className="h-2 w-2 mr-2" /> Ajouter une catégorie
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[212px]">
          <DropdownMenuItem onClick={() => setIsManual(true)} className="cursor-pointer">
            <PenIcon className="h-4 w-4 mr-2" /> Manuellement
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAI(true)} className="cursor-pointer">
            <Sparkles className="h-4 w-4 mr-2" /> Via IA
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sheet Modal for creating category */}
      <Sheet
        open={isManual}
        onOpenChange={(open) => {
          if (!isSubmitting) setIsManual(open)
        }}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Création de catégorie</SheetTitle>
          </SheetHeader>

          <div className="mb-4">
            <Label>Catégorie ou Sous-catégorie</Label>
            <div className="flex gap-4">
  <input
    type="radio"
    id="category"
    className={`custom-radio appearance-none w-5 h-5 rounded-full border-2 ${
      !isSubCategory ? "border-black bg-black" : "border-black"
    }`}
    name="formToggle"
    checked={!isSubCategory}
    onChange={() => setIsSubCategory(false)}
  />
  <Label htmlFor="category" className="text-black">Catégorie</Label>

  <input
    type="radio"
    id="subcategory"
    className={`custom-radio appearance-none w-5 h-5 rounded-full border-2 ${
      isSubCategory ? "border-black bg-black" : "border-black"
    }`}
    name="formToggle"
    checked={isSubCategory}
    onChange={() => setIsSubCategory(true)}
  />
  <Label htmlFor="subcategory" className="text-black">Sous-catégorie</Label>
</div>

          </div>

          {/* Main Category Form */}
          {!isSubCategory && (
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <Label htmlFor="name">Nom de la catégorie *</Label>
                <Input id="name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
              </div>

              <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="mb-4">
                <Label>Logo de la catégorie</Label>
                <UploadButton
                  endpoint="imageUploader"
                  className="ut-button:bg-[#7f1d1c] text-white ut-button:ut-readying:bg-[#7f1d1c]"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setFormData((prev) => ({ ...prev, logo: res[0].ufsUrl }))
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center hover:bg-[#7f1d1c] bg-[#7f1d1c]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer la catégorie"
                )}
              </Button>
            </form>
          )}

          {/* Sub-category Form */}
          {isSubCategory && (
            <form onSubmit={handleSubCategorySubmit}>
              <div className="mb-4">
                <Label htmlFor="parentCategory">Catégorie parente *</Label>
                <Select
                  value={formData.subCategoryId}
                  onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label htmlFor="subName">Nom de la sous-catégorie *</Label>
                <Input
                  id="subName"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="subDescription">Description</Label>
                <Input id="subDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="mb-4">
                <Label>Logo de la sous-catégorie</Label>
                <UploadButton
                  endpoint="imageUploader"
                  className="ut-button:bg-[#7f1d1c] text-white ut-button:ut-readying:bg-[#7f1d1c]"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setFormData((prev) => ({ ...prev, subLogo: res[0].ufsUrl }))
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center hover:bg-[#7f1d1c] bg-[#7f1d1c]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer la sous-catégorie"
                )}
              </Button>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* AI Generated Category Dialog */}
      <Dialog open={isAI} onOpenChange={setIsAI}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une catégorie via IA</DialogTitle>
          </DialogHeader>
          <Generateiacategorie onClose={() => setIsAI(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}

