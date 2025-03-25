"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, UserPen, Sparkles } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { createmarque } from "../action/createmarque"; // Import brand creation API
import { CategoryGenerator } from "./Generateiacategories";

interface FormData {
  logo?: string;
}

export default function Iageneratemarque() {
  const [isOpen, setIsOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [organisationId, setOrganisationId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | undefined>(undefined); // Brand logo state
  const [loading, setLoading] = useState(false);

  // Extract organisation ID from URL
  useEffect(() => {
    const orgId = window.location.pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/)?.[1];
    if (orgId) setOrganisationId(orgId);
  }, []);

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!organisationId) {
      toast.error("Organisation ID est manquant.");
      setLoading(false);
      return;
    }

    try {
      await createmarque({
        name,
        description,
        organisationId,
        logo, // Sending logo along with other details
      });
      toast.success("Marque créée avec succès!");
      setName("");
      setDescription("");
      setLogo(undefined); // Reset logo
    } catch (error) {
      toast.error("Erreur lors de la création de la marque.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Dropdown Menu for form selection */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg">
            <Plus className="h-2 w-2" /> Ajouter une marque
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full">
          <DropdownMenuItem onClick={() => setIsManual(true)}>
            <UserPen className="h-4 w-4 mr-2" /> Manuellement
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAI(true)}>
            <Sparkles className="h-2 w-2" /> Générer via IA
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sheet Modal for Manual Form */}
      <Sheet open={isManual} onOpenChange={setIsManual}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Ajouter une marque</SheetTitle>
          </SheetHeader>

          {/* Brand Form */}
          <form onSubmit={handleBrandSubmit}>
            <div>
              <Label htmlFor="name">Nom de la marque *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label>Logo de la marque</Label>
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-black text-white"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setLogo(res[0].ufsUrl);
                    toast.success("Upload du logo terminé !");
                  }
                }}
              />
            </div>
            <Button type="submit" className="w-full bg-black hover:bg-black/80" disabled={loading}>
              {loading ? "Enregistrement..." : "Créer la marque"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* AI Generated Category Dialog */}
      <Dialog open={isAI} onOpenChange={setIsAI}>
        <CategoryGenerator onClose={() => setIsAI(false)} />
      </Dialog>
    </>
  );
}
