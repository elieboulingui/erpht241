"use client"
import { useEffect, useState } from "react";
import { auth } from "@/auth"; 
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";

export default function Tabs({ userId, onNextStep }: any) {
  const [orgName, setOrgName] = useState("");
  const [slug, setSlug] = useState("");
  const [ownerId, setOwnerId] = useState<string | null>(null); 
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadOwnerId = async () => {
        setOwnerId(userId); 
      };
      loadOwnerId();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ownerId) {
      alert("Vous devez être connecté pour créer une organisation.");
      return;
    }

    if (!orgName || !slug || !logoUrl) {
      alert("Tous les champs sont obligatoires !");
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name: orgName,
        slug: slug,
        logo: logoUrl,
        ownerId: ownerId,
      };
      console.log("Request body:", requestBody);

      const response = await fetch("/api/createorganisation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'organisation");
      }

      alert("Organisation créée avec succès !");
      onNextStep(); // Move to next step
    } catch (error) {
      console.error("Erreur dans la requête:", error);
      alert("Une erreur s'est produite lors de la création de l'organisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-[600px] space-y-8 py-8">
        <div className="flex justify-center">
          <img
            src="/images/ht241.png"
            alt="H241 HIGH TECH Logo"
            width={120}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Step 1 sur 2</p>
          <div className="h-1 w-full bg-gray-200 rounded-full">
            <div className="h-1 w-1/2 bg-black rounded-full" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Ajouter une organisation</h1>
            <p className="text-muted-foreground mt-2">
              Nous avons simplement besoin de quelques informations de base pour configurer votre organisation. Vous
              pourrez les modifier ultérieurement.
            </p>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">
              Logo <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res: any) => {
                  console.log("Fichiers uploadés: ", res);
                  if (res && res[0]) {
                    setLogoUrl(res[0].ufsUrl); 
                    alert("Upload terminé !");
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Erreur lors de l'upload: ${error.message}`);
                }}
              />
            </div>
            {logoUrl && (
              <div className="mt-2">
                <img src={logoUrl} alt="Logo de l'organisation" className="w-32 h-32 object-contain mx-auto" />
              </div>
            )}
          </div>

          {/* Organisation Name */}
          <div className="space-y-2">
            <Label htmlFor="org-name">
              Nom de l&apos;organisation <span className="text-red-500">*</span>
            </Label>
            <Input
              id="org-name"
              type="text"
              className="h-11"
              placeholder="Entrez le nom de votre organisation"
              value={orgName}
              onChange={(e: any) => setOrgName(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug ( Nom unique ) <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground">
                /organisation/
              </span>
              <Input
                id="slug"
                type="text"
                className="h-11 rounded-l-none"
                placeholder="votre-organisation"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gray-800 hover:bg-gray-700 text-white mt-4"
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Etape suivante"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
