"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing"; // Assurez-vous que le chemin est correct
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Ajustez le chemin si nécessaire
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { createCategory } from "../action/CreatCategories"; // Assurez-vous que ce chemin est correct

interface FormData {
  logo?: string;
}

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState(""); // ID de l'organisation
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({}); // Initialiser avec le type correct

  // Extraire l'ID de l'organisation depuis l'URL
  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  // Récupérer l'ID de l'organisation au montage du composant
  useEffect(() => {
    const orgId = extractOrganisationId();
    setOrganisationId(orgId);
  }, []);

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // S'assurer qu'aucun champ n'est indéfini ou nul
      const categoryPayload = {
        name: name || "", // Assurez-vous que le nom n'est pas vide
        description: description || "", // Facultatif, mais fournir une valeur par défaut
        organisationId: organisationId || "", // S'assurer que l'ID de l'organisation est valide
        logo: formData.logo || "", // Assurez-vous que le logo soit une chaîne vide ou une URL
      };

      const response = await createCategory(categoryPayload);

      if (response) {
        toast.success("Catégorie ajoutée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer l'image téléchargée
  const handleRemoveImage = () => {
    setFormData({ ...formData, logo: undefined });
  };

  return (
    <div className="w-full">
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-black font-bold" href="#">
                    Catégories
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black">Ajouter une catégorie</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Ajouter une nouvelle catégorie</SheetTitle>
                </SheetHeader>
                <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Entrez le nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Entrez la description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo</Label>
                    <UploadButton
                      endpoint="imageUploader" // Endpoint du serveur pour le téléchargement
                      className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                      onClientUploadComplete={(res: any) => {
                        if (res && res[0]) {
                          setFormData({
                            ...formData,
                            logo: res[0].ufsUrl, // Enregistrer l'URL du logo téléchargé
                          });
                          toast.success("Upload du logo terminé !");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Erreur lors de l'upload: ${error.message}`);
                      }}
                    />
                    {/* Prévisualisation de l'image téléchargée */}
                    {formData.logo && (
                      <div className="mt-2">
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="w-32 h-32 object-cover rounded"
                        />
                        <Button
                          className="mt-2 w-full bg-red-600 hover:bg-red-700"
                          onClick={handleRemoveImage}
                        >
                          Supprimer l'image
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="bg-black hover:bg-black w-full"
                    disabled={loading}
                  >
                    {loading ? "Enregistrement..." : "Enregistrer la catégorie"}
                  </Button>
                </form>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Separator className="mt-2" />
      </header>
    </div>
  );
}
