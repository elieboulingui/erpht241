"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Sparkles, UserPen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { createCategory } from "../action/CreatCategories";
import { createSubCategory } from "../action/CreateSubCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Dialog import for AI form
import { Generateiacategorie } from "./generateiacategories";

interface FormData {
  logo?: string;
  subLogo?: string;
  subCategoryId?: string; // Added for selecting a parent category for sub-categories
}

export default function ContactAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isManual, setIsManual] = useState(false); // Controls the form mode
  const [isAI, setIsAI] = useState(false); // AI generated form control
  const [categories, setCategories] = useState<any[]>([]); // List of categories
  const [organisationId, setOrganisationId] = useState<string>("");

  const [isSubCategory, setIsSubCategory] = useState(false); // Toggle between category and sub-category forms
  const [formData, setFormData] = useState<FormData>({}); // Form data to store logo URLs and category selections
  const [name, setName] = useState(""); // Name of category or sub-category
  const [description, setDescription] = useState(""); // Description of category or sub-category

  // Extract organisation ID from the URL
  useEffect(() => {
    const orgId = window.location.pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/)?.[1];
    if (orgId) {
      setOrganisationId(orgId); // Set the organisation ID
    }
  }, []);

  // Fetch categories for selecting parent category in sub-category form
  useEffect(() => {
    const fetchCategories = async () => {
      if (organisationId) {
        try {
          const response = await fetch(`/api/categorie?organisationId=${organisationId}`);
          const data = await response.json();
          setCategories(data); // Set the categories in state
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      }
    };
    fetchCategories();
  }, [organisationId]);

  // Handle form submission for main category
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !organisationId) {
      toast.error("Nom de catégorie et organisation requis.");
      return;
    }

    try {
      await createCategory({
        name: trimmedName,
        description: description.trim(),
        organisationId,
        logo: formData.logo || "",
      });
      toast.success("Catégorie créée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la création de la catégorie.");
    }
  };

  // Handle form submission for sub-category
  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSubName = name.trim();
    const selectedCategoryId = formData.subCategoryId || "";
    if (!trimmedSubName || !selectedCategoryId) {
      toast.error("Nom et catégorie parente requis.");
      return;
    }

    try {
      await createSubCategory({
        name: trimmedSubName,
        description: description.trim(),
        logo: formData.subLogo || "",
        parentId: selectedCategoryId,
        organisationId,
      });
      toast.success("Sous-catégorie créée avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la création de la sous-catégorie.");
    }
  };

  return (
    <>
      {/* Dropdown Menu for manual/AI selection */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
  <DropdownMenuTrigger asChild>
    <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg">
      <Plus className="h-2 w-2" /> Ajouter une catégorie
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-full"> {/* Appliquez w-full ici */}
    <DropdownMenuItem onClick={() => setIsManual(true)} className="cursor-pointer">
      <UserPen className="h-4 w-4 mr-2" /> manuellement
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setIsAI(true)} className="cursor-pointer">
      <Sparkles className="h-2 w-2" /> Générer via IA
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


      {/* Sheet Modal for creating category */}
      <Sheet open={isManual} onOpenChange={setIsManual}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Création de catégorie</SheetTitle>
          </SheetHeader>

          {/* Toggle for main category or sub-category */}
          <div className="mb-4">
            <Label>Catégorie ou Sous-catégorie</Label>
            <div className="flex gap-4">
              <input
                type="radio"
                id="category"
                name="formToggle"
                checked={!isSubCategory}
                onChange={() => setIsSubCategory(false)}
              />
              <Label htmlFor="category">Catégorie</Label>
              <input
                type="radio"
                id="subcategory"
                name="formToggle"
                checked={isSubCategory}
                onChange={() => setIsSubCategory(true)}
              />
              <Label htmlFor="subcategory">Sous-catégorie</Label>
            </div>
          </div>

          {/* Main Category Form */}
          {!isSubCategory && (
            <form onSubmit={handleCategorySubmit}>
              <div>
                <Label htmlFor="name">Nom de la catégorie *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <Label>Logo de la catégorie</Label>
                <UploadButton
                  endpoint="imageUploader"
                  className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setFormData((prev) => ({ ...prev, logo: res[0].ufsUrl }));
                    }
                  }}
                />
              </div>

              <Button type="submit" className="w-full flex items-center justify-center hover:bg-black bg-black" disabled={false}>Créer la catégorie</Button>
            </form>
          )}

          {/* Sub-category Form */}
          {isSubCategory && (
            <form onSubmit={handleSubCategorySubmit}>
              <div>
                <Label htmlFor="parentCategory">Catégorie parente *</Label>
                <Select value={formData.subCategoryId} onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}>
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

              <div>
                <Label htmlFor="subName">Nom de la sous-catégorie *</Label>
                <Input id="subName" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="subDescription">Description</Label>
                <Input id="subDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <Label>Logo de la sous-catégorie</Label>
                <UploadButton
                  endpoint="imageUploader"
                  className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setFormData((prev) => ({ ...prev, subLogo: res[0].ufsUrl }));
                    }
                  }}
                />
              </div>

              <Button type="submit" className="w-full flex items-center justify-center hover:bg-black bg-black" disabled={false}>Créer la sous-catégorie</Button>
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
  );
}
