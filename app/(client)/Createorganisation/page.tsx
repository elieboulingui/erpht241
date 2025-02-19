"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";

export default  function OrganisationSetup() {


  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-[600px] space-y-8 py-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/images/ht241.png"
            alt="H241 HIGH TECH Logo"
            width={120}
            height={60}
            className="h-12 w-auto"
          />
        </div>
        

        {/* Progress */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Step 1 sur 2</p>
          <div className="h-1 w-full bg-gray-200 rounded-full">
            <div className="h-1 w-1/2 bg-black rounded-full" />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
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
                onClientUploadComplete={(res) => {
                  console.log("Fichiers uploadés: ", res);
                  alert("Upload terminé !");
                }}
                onUploadError={(error: Error) => {
                  alert(`Erreur lors de l'upload: ${error.message}`);
                }}
              />
            </div>
          </div>

          {/* Organisation Name */}
          <div className="space-y-2">
            <Label htmlFor="org-name">
              Nom de l&apos;organisation <span className="text-red-500">*</span>
            </Label>
            <Input id="org-name" type="text" className="h-11" placeholder="Entrez le nom de votre organisation" />
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
              <Input id="slug" type="text" className="h-11 rounded-l-none" placeholder="votre-organisation" />
            </div>
          </div>

          {/* Submit Button */}
          <Button className="w-full h-11 bg-gray-800 hover:bg-gray-700 text-white mt-4">
            Etape suivante
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
