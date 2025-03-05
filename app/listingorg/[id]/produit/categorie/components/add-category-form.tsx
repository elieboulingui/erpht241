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
import { UploadButton } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Adjust path to your api helper
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
import { createCategory } from "../action/CreatCategories";

interface FormData {
  logo?: string;
}

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState(""); // Organisation ID
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({}); // Initialize with the correct type

  // Extract Organisation ID from URL using regex
  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listingorg\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  // Fetch Organisation ID on component mount
  useEffect(() => {
    const orgId = extractOrganisationId();
    setOrganisationId(orgId);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Ensure no field is undefined or null
      const categoryPayload = {
        name: name || "", // Ensure name is not empty
        description: description || "", // Optional, but provide a fallback
        organisationId: organisationId || "", // Ensure organisationId is valid
        logo: formData.logo || "", // Ensure logo is either a string or empty string
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
                      endpoint="imageUploader"
                      className=" bg-black  "
                      onClientUploadComplete={(res: any) => {
                        if (res && res[0]) {
                          setFormData({
                            ...formData,
                            logo: res[0].ufsUrl, // Save the logo URL
                          });
                          toast.success("Upload du logo terminé !");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Erreur lors de l'upload: ${error.message}`);
                      }}
                    />
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
