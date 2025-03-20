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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { UploadButton } from "@/utils/uploadthing";
import { Sparkles } from "lucide-react";
import { creatcategory } from "../action/createmarque"; // Import the API function
import { CategoryGenerator } from "./Generateiacategories";

export function MarqueHeader() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined); // Change logo to string | undefined
  const [organisationId, setOrganisationId] = useState<string>(""); // To store organisationId
  const [loading, setLoading] = useState(false);

  // Extract the organisationId from the URL
  useEffect(() => {
    const pathname = window.location.pathname;
    const regex = /\/listing-organisation\/([a-zA-Z0-9-]+)\/produit\/marque/;
    const match = pathname.match(regex);
    
    if (match) {
      setOrganisationId(match[1]); // Set the organisationId if regex matches
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!organisationId) {
      toast.error("Organisation ID est manquant.");
      setLoading(false);
      return;
    }

    try {
      // Call the creatcategory API to create the brand
      await creatcategory({
        name,
        description,
        organisationId,
        logo, // logo is now undefined or string, matching the expected type
      });
      toast.success("Marque créée avec succès!");
      // Reset form fields
      setName("");
      setDescription("");
      setLogo(undefined); // Reset to undefined
    } catch (error) {
      toast.error("Erreur lors de la création de la marque.");
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
                    Marque
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

          {/* Container for Category Generator and Add Brand Button */}
          <div className="flex gap-4 items-center">
            <CategoryGenerator />

            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black">
                  Ajouter une marque
                </Button>
              </SheetTrigger>

              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Ajouter une nouvelle marque</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Entrez le nom"
                      required
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
                  <div>
                    <Label htmlFor="logo">Image</Label>
                    <UploadButton
                      endpoint="imageUploader"
                      className="relative h-full w-full ut-button:bg-black text-white"
                      onClientUploadComplete={(res: any) => {
                        if (res && res[0]) {
                          setLogo(res[0].ufsUrl);
                          toast.success("Upload du logo terminé !");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(
                          `Erreur lors de l'upload: ${error.message}`
                        );
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-black w-full hover:bg-black"
                    disabled={loading}
                  >
                    {loading ? "Enregistrement..." : "Enregistrer la marque"}
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
