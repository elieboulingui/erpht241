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
import { createCategory } from "../action/CreatCategories"; // Assurez-vous que ce chemin est correct
import { toast } from "sonner";

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState(""); // L'ID de l'organisation
  const [loading, setLoading] = useState(false);

  // Fonction pour extraire l'ID depuis l'URL avec une regex
  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listingorg\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  // Utilisation de useEffect pour récupérer l'ID lorsque le composant est monté
  useEffect(() => {
    const orgId = extractOrganisationId();
    setOrganisationId(orgId);
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Appel à la fonction serveur pour créer la catégorie
      const response = await createCategory({
        name,
        description,
        organisationId,  // Passer l'ID de l'organisation ici
      });

      if (response) {
        toast.success("Catégorie ajoutée avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la catégorie:", );
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end p-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-black">Ajouter une catégorie</Button>
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
            {/* <div className="space-y-2">
              <Label htmlFor="organisationId">ID de l'organisation</Label>
              <Input
                id="organisationId"
                value={organisationId}
                onChange={(e) => setOrganisationId(e.target.value)}
                placeholder="ID de l'organisation"
                disabled
              />
            </div> */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer la catégorie"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
