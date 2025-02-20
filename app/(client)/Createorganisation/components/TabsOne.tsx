"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";

interface OrganizationStepProps {
  formData: {
    logo: string | null;
    organizationName: string;
    slug: string; // Assurez-vous que ownerId est passé depuis le parent
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

export function OrganizationStep({ formData, setFormData, onNext }: OrganizationStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, logo: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    // Log des données du formulaire avant l'envoi
    console.log("Données soumises : ", {
      organizationName: formData.organizationName,
      slug: formData.slug,
      logo: formData.logo,
    });

    setLoading(true);
    setError(null);

    // Créer un objet JSON à envoyer
    const body = {
      name: formData.organizationName,
      slug: formData.slug,
      logo: formData.logo,
    };

    try {
      const response = await fetch("/api/createorg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // On définit l'en-tête pour indiquer que l'on envoie du JSON
        },
        body: JSON.stringify(body), // On envoie les données en JSON
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Réponse du serveur:", result); // Log de la réponse du serveur
        onNext();
      } else {
        const errorData = await response.json();
        console.error("Erreur serveur:", errorData); // Log de l'erreur du serveur
        setError(errorData.error || "Une erreur s'est produite lors de la création de l'organisation.");
      }
    } catch (error) {
      console.error("Erreur de communication avec le serveur:", error); // Log d'erreur de communication
      setError("Erreur de communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Ajouter une organisation</h2>
        <p className="text-sm text-gray-500">
          Nous avons simplement besoin de quelques informations de base pour configurer votre organisation. Vous pourrez
          les modifier ultérieurement.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="logo">Logo *</Label>
          <div className="mt-2">
            <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg hover:border-primary cursor-pointer">
              <label htmlFor="logo" className="cursor-pointer p-4 text-center">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: any) => {
                    console.log("Fichiers uploadés: ", res); // Log des fichiers uploadés
                    if (res && res[0]) {
                      setFormData({ ...formData, logo: res[0].ufsUrl });
                      alert("Upload terminé !");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Erreur lors de l'upload: ${error.message}`);
                  }}
                />
                <span className="mt-2 block text-xs text-gray-500">
                  Téléchargez votre logo Fichiers *.png, *.jpeg jusqu&apos;à 5 Mo
                </span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="organizationName">Nom de l&apos;organisation *</Label>
          <Input
            id="organizationName"
            value={formData.organizationName}
            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (Nom unique) *</Label>
          <div className="mt-2 flex items-center">
            <span className="text-gray-500">/organisation/</span>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        onClick={handleSubmit}
        className="w-full bg-black "
        disabled={!formData.organizationName || !formData.slug || loading || !formData.logo}
      >
        {loading ? "Chargement..." : "Etape suivante"}
      </Button>
    </div>
  );
}
