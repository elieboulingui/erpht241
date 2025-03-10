"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { createCategory } from "../action/CreatCategories";
import { createSubCategory } from "../action/CreateSubCategories";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Generateiacategorie } from "./generateiacategories";

interface FormData {
  logo?: string;
  subLogo?: string;
}

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [subCategoryData, setSubCategoryData] = useState({
    subName: "",
    subDescription: "",
    selectedCategoryId: null as string | null,
    subLogo: "",
  });

  const [categories, setCategories] = useState<any[]>([]); // Catégories principales
  const [isSubCategory, setIsSubCategory] = useState(false); // Permet de basculer entre le formulaire de catégorie principale et celui de sous-catégorie

  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  useEffect(() => {
    const orgId = extractOrganisationId();
    if (orgId) {
      setOrganisationId(orgId); // Définir l'ID de l'organisation
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (organisationId) {
        try {
          const response = await fetch(`/api/categorie?organisationId=${organisationId}`);
          const data = await response.json();
          setCategories(data);  // Stocker les catégories récupérées
        } catch (error) {
          console.error("Erreur lors de la récupération des catégories :", error);
        }
      }
    };
    if (organisationId) fetchCategories();
  }, [organisationId]);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Le nom de la catégorie est requis.");
      setLoading(false);
      return;
    }

    if (!organisationId) {
      toast.error("L'ID de l'organisation est requis.");
      setLoading(false);
      return;
    }

    try {
      const mainCategory = await createCategory({
        name: trimmedName,
        description: description.trim(),
        organisationId,
        logo: formData.logo || "",
      });

      if (!mainCategory?.id) throw new Error("Échec de la création de la catégorie principale");

      toast.success("Catégorie créée avec succès");

      // Réinitialiser le formulaire de catégorie
      setName("");
      setDescription("");
      setFormData({});
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Erreur lors de la création de la catégorie", {
        description: "Veuillez vérifier les données et réessayer",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { subName, subDescription, selectedCategoryId } = subCategoryData;
    const trimmedSubName = subName.trim();

    if (!trimmedSubName) {
      toast.error("Le nom de la sous-catégorie est requis.");
      setLoading(false);
      return;
    }

    if (!selectedCategoryId) {
      toast.error("La catégorie parente est requise.");
      setLoading(false);
      return;
    }

    try {
      const subCategory = await createSubCategory({
        name: trimmedSubName,
        description: subDescription.trim(),
        logo: formData.subLogo || "",
        parentId: selectedCategoryId,
        organisationId,
      });

      if (subCategory.data?.id) {
        toast.success("Sous-catégorie créée avec succès");
      } else {
        toast.error("Erreur lors de la création de la sous-catégorie");
      }

      // Réinitialiser le formulaire de sous-catégorie
      setSubCategoryData({
        subName: "",
        subDescription: "",
        selectedCategoryId: null,
        subLogo: "",
      });
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Erreur lors de la création de la sous-catégorie", {
        description: "Veuillez vérifier les données et réessayer",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSubCategoryData((prev) => ({ ...prev, selectedCategoryId: categoryId }));
  };

  const handleRemoveImage = (type: 'main' | 'sub') => {
    setFormData(prev => ({
      ...prev,
      [type === 'main' ? 'logo' : 'subLogo']: undefined
    }));
  };

  return (
    <div className="w-full">
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="text-black font-bold">Catégories</div>
          </div>

          <div> <Generateiacategorie/>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black">Ajouter une catégorie</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Nouvelle catégorie</SheetTitle>
                </SheetHeader>

                {/* Basculement pour afficher soit le formulaire de catégorie principale, soit celui de sous-catégorie */}
                <div className="mb-4">
                  <Label htmlFor="toggleCategory">Créer une catégorie ou une sous-catégorie</Label>
                  <div className="flex gap-4">
                    <div>
                      <input
                        type="radio"
                        id="category"
                        name="formToggle"
                        checked={!isSubCategory}
                        onChange={() => setIsSubCategory(false)}
                      />
                      <Label htmlFor="category">Catégorie</Label>
                    </div>
                    <div>
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
                </div>

                {/* Formulaire de catégorie principale */}
                {!isSubCategory && (
                  <form className="space-y-4 mt-4" onSubmit={handleCategorySubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de la catégorie principale *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la catégorie"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description de la catégorie"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>image de la catégorie principale</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setFormData(prev => ({ ...prev, logo: res[0].ufsUrl }));
                            toast.success("Logo de la catégorie principale téléchargé");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Erreur de téléchargement : ${error.message}`);
                        }}
                      />
                      {formData.logo && (
                        <div className="mt-2">
                          <img
                            src={formData.logo}
                            alt="Logo de la catégorie principale"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            className="mt-2 w-full"
                            onClick={() => handleRemoveImage('main')}
                          >
                            Supprimer le image de la catégorie principale
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-black hover:bg-black" disabled={loading}>
                      {loading ? "En cours..." : "Créer la catégorie"}
                    </Button>
                  </form>
                )}

                {/* Formulaire de sous-catégorie */}
                {isSubCategory && (
                  <form className="space-y-4 mt-4" onSubmit={handleSubCategorySubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="category">Sélectionner une catégorie parente *</Label>
                      <Select
                        value={subCategoryData.selectedCategoryId || ""}
                        onValueChange={handleCategorySelect}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une catégorie parente" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subName">Nom de la sous-catégorie *</Label>
                      <Input
                        id="subName"
                        value={subCategoryData.subName}
                        onChange={(e) => setSubCategoryData({ ...subCategoryData, subName: e.target.value })}
                        placeholder="Nom de la sous-catégorie"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subDescription">Description de la sous-catégorie</Label>
                      <Input
                        id="subDescription"
                        value={subCategoryData.subDescription}
                        onChange={(e) => setSubCategoryData({ ...subCategoryData, subDescription: e.target.value })}
                        placeholder="Description de la sous-catégorie"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>image de la sous-catégorie</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setFormData(prev => ({ ...prev, subLogo: res[0].ufsUrl }));
                            toast.success("image de la sous-catégorie téléchargé");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Erreur de téléchargement : ${error.message}`);
                        }}
                      />
                      {formData.subLogo && (
                        <div className="mt-2">
                          <img
                            src={formData.subLogo}
                            alt="image de la sous-catégorie"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            className="mt-2 w-full"
                            onClick={() => handleRemoveImage('sub')}
                          >
                            Supprimer le image de la sous-catégorie
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-black hover:bg-black" disabled={loading}>
                      {loading ? "En cours..." : "Créer la sous-catégorie"}
                    </Button>
                  </form>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
