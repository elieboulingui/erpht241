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
import { UploadButton } from "@/utils/uploadthing"

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [organisationId, setOrganisationId] = useState(""); // L'ID de l'organisation
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<string | null>(null)

  // Fonction pour extraire l'ID depuis l'URL avec une regex
  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listingorg\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
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
                    Marque d'Appareil
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {" "}
                    <IoMdInformationCircleOutline
                      className="h-4 w-4"
                      color="gray"
                    />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black">Ajouter une maque</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Ajouter une nouvelle marque d'appareil</SheetTitle>
                </SheetHeader>
                <form className="space-y-4 mt-4" >
                  <div>
                    <Label htmlFor="name">Image</Label>
                    <UploadButton
                                          endpoint="imageUploader"
                                          className="ut-button:bg-[#F65F57] ut-button:ut-readying:bg-[#F65F57]/50"
                                          onClientUploadComplete={(res: any) => {
                                            if (res && res[0]) {
                                              setLogo(res[0].ufsUrl)
                                              toast.success("Upload du logo terminé !")
                                            }
                                          }}
                                          onUploadError={(error: Error) => {
                                            toast.error(`Erreur lors de l'upload: ${error.message}`)
                                          }}
                                        />
                  </div>
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
                  <div>
                    <Label htmlFor="price">Prix</Label>
                    <Input
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Entrez le prix"
                    />
                  </div>
             
                  <Button
                    type="submit"
                    className="bg-black w-full"
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
