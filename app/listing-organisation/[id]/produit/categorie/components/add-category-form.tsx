"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { createCategory } from "../action/CreatCategories";
import { createSubCategory } from "../action/CreateSubCategories"; // Nouvelle importation
import { SidebarTrigger } from "@/components/ui/sidebar";

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

  const [isSubCategory, setIsSubCategory] = useState(false); // Etat pour contrôler l'affichage des formulaires

  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  useEffect(() => {
    const orgId = extractOrganisationId();
    if (orgId) {
      setOrganisationId(orgId); // Mettre à jour organisationId
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (organisationId) {
        try {
          const response = await fetch(`/api/categories?organisationId=${organisationId}`);
          const data = await response.json();
          setCategories(data);  // Stocker les catégories récupérées dans l'état
        } catch (error) {
          console.error("Erreur de récupération des catégories:", error);
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

      // Réinitialisation du formulaire de catégorie principale
      setName("");
      setDescription("");
      setFormData({});
    } catch (error) {
      console.error("Erreur globale:", error);
      toast.error("Erreur de création de la catégorie", {
        description: "Vérifiez les données et réessayez",
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

      // Réinitialisation du formulaire de sous-catégorie
      setSubCategoryData({
        subName: "",
        subDescription: "",
        selectedCategoryId: null,
        subLogo: "",
      });
    } catch (error) {
      console.error("Erreur globale:", error);
      toast.error("Erreur de création de la sous-catégorie", {
        description: "Vérifiez les données et réessayez",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId: string) => {
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

          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black">Ajouter une catégorie</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Nouvelle catégorie</SheetTitle>
                </SheetHeader>

                {/* Toggle pour afficher l'un des formulaires */}
                <div className="mb-4">
                  <Label htmlFor="toggleCategory">Créer une catégorie ou sous-catégorie</Label>
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

                {/* Formulaire de la catégorie principale */}
                {!isSubCategory && (
                  <form className="space-y-4 mt-4" onSubmit={handleCategorySubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom principal *</Label>
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
                      <Label>Logo principal</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setFormData(prev => ({ ...prev, logo: res[0].ufsUrl }));
                            toast.success("Logo principal uploadé");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Erreur upload: ${error.message}`);
                        }}
                      />
                      {formData.logo && (
                        <div className="mt-2">
                          <img
                            src={formData.logo}
                            alt="Logo principal"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            className="mt-2 w-full"
                            onClick={() => handleRemoveImage('main')}
                          >
                            Supprimer logo principal
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "En cours..." : "Créer la catégorie"}
                    </Button>
                  </form>
                )}

                {/* Formulaire de sous-catégorie */}
                {isSubCategory && (
                  <form className="space-y-4 mt-4" onSubmit={handleSubCategorySubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="category">Sélectionner une catégorie parente *</Label>
                      <select
                        id="category"
                        value={subCategoryData.selectedCategoryId || ""}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        required
                      >
                        <option value="">Choisir une catégorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subName">Nom sous-catégorie *</Label>
                      <Input
                        id="subName"
                        value={subCategoryData.subName}
                        onChange={(e) => setSubCategoryData({ ...subCategoryData, subName: e.target.value })}
                        placeholder="Nom de la sous-catégorie"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subDescription">Description sous-catégorie</Label>
                      <Input
                        id="subDescription"
                        value={subCategoryData.subDescription}
                        onChange={(e) => setSubCategoryData({ ...subCategoryData, subDescription: e.target.value })}
                        placeholder="Description de la sous-catégorie"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Logo sous-catégorie</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setFormData(prev => ({ ...prev, subLogo: res[0].ufsUrl }));
                            toast.success("Logo sous-catégorie uploadé");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Erreur upload: ${error.message}`);
                        }}
                      />
                      {formData.subLogo && (
                        <div className="mt-2">
                          <img
                            src={formData.subLogo}
                            alt="Logo sous-catégorie"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            className="mt-2 w-full"
                            onClick={() => handleRemoveImage('sub')}
                          >
                            Supprimer logo sous-catégorie
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
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
