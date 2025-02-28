// components/ContactHeader.tsx
'use client'
import * as React from "react";
import { useState, useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { FiSidebar } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"; // Assurez-vous que Toast est configuré
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Stage = "LEAD" | "WON";

const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listingorg\/([^\/]+)\/contact/);
  return match ? match[1] : null;
};

export default function ContactHeader() {
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("LEAD");
  const [tags, setTags] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [Adresse, setAdresse] = useState(""); // Nouveau champ
  const [Record, setRecord] = useState(""); // Nouveau champ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = window.location.pathname;
      const id = extractIdFromUrl(url);
      if (id) {
        setOrganisationId(id);
      } else {
        console.error("Aucun ID d'organisation trouvé dans l'URL");
      }
    }
  }, []);

  useEffect(() => {
    setFormValid(!!name && !!email && !!phone && !!logo && !!organisationId && !!Adresse && !!Record);
  }, [name, email, phone, logo, organisationId, Adresse, Record]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!organisationId) {
      console.error("Organisation ID is missing");
      setError("L'ID de l'organisation est manquant");
      return;
    }
  
    const tabsString = tags ? tags : "";
  
    const newContact = {
      name,
      email,
      phone,
      stage,
      tabs: tabsString,
      organisationIds: [organisationId],
      logo,
      Adresse,
      Record,
    };
  
    console.log("Données envoyées à l'API :", newContact); // Vérifier les données avant envoi
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch("/api/createcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });
  
      // Vérifier si la réponse est correcte
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur serveur : ${errorText || response.statusText}`);
      }
  
      // Vérifier si la réponse contient du JSON
      const responseData = await response.json();
      if (responseData?.message) {
        toast.success(responseData.message); // Affiche un message de succès
      } else {
        throw new Error("Réponse du serveur invalide, message manquant.");
      }
  
    } catch (error: any) {
      console.error("Erreur lors de la création du contact", error);
      setError(`Une erreur est survenue : ${error.message || "inconnue"}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <header className="w-full items-center gap-4 bg-background/95 py-4">
      <div className="flex items-center justify-between px-5">
      <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Contact</BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
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

        <div className="flex items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-black text-white">Ajouter un contact</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Ajouter un nouveau contact</SheetTitle>
              </SheetHeader>
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    placeholder="Entrez le nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Entrez l'email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Entrez le numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Select component for Stage */}
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={stage} onValueChange={(value) => setStage(value as Stage)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEAD">Lead</SelectItem>
                      <SelectItem value="WON">Gagné</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Entrez des tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                {/* Nouveau champ Adresse */}
                <div className="space-y-2">
                  <Label htmlFor="Adresse">Adresse</Label>
                  <Input
                    id="Adresse"
                    placeholder="Entrez l'adresse"
                    value={Adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                  />
                </div>

                {/* Nouveau champ Record */}
                <div className="space-y-2">
                  <Label htmlFor="Record">Record</Label>
                  <Input
                    id="Record"
                    placeholder="Entrez le record"
                    value={Record}
                    onChange={(e) => setRecord(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <UploadButton
                    endpoint="imageUploader"
                      className="ut-button:bg-[#F65F57] ut-button:ut-readying:bg-[#F65F57]/50"
                    onClientUploadComplete={(res: any) => {
                      if (res && res[0]) {
                        setLogo(res[0].ufsUrl);
                        toast.success("Upload du logo terminé !");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Erreur lors de l'upload: ${error.message}`);
                    }}
                  />
                </div>

                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading || !formValid}>
                  {loading ? "Sauvegarde..." : "Enregistrer le contact"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Separator className="mt-2" />
    </header>
  );
}
