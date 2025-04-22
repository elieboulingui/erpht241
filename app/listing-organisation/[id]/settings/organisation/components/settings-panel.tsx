'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UploadButton } from "@/utils/uploadthing"

import { toast } from "sonner"
import Chargement from '@/components/Chargement';

interface OrganisationData {
  id: string;
  name: string;
  logo?: string;
  domain: string;
}

export default function OrganisationForm() {
  const [organisationData, setOrganisationData] = useState<OrganisationData | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [enableLogo, setEnableLogo] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/listing-organisation\/([^/]+)\//);
    const orgId = match?.[1];

    if (orgId) {
      fetch(`/api/organisation?id=${orgId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrganisationData(data);
          if (data.logo) {
            setLogo(data.logo);
            setEnableLogo(true);
          }
        })
        .catch((err) => console.error("Erreur lors du fetch de l'organisation", err));
    }
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organisationData) {
      toast.error("Aucune donnée d'organisation trouvée");
      return;
    }

    const payload = {
      id: organisationData.id,
      name: organisationData.name,
      logo: enableLogo ? logo : null,
      domain: organisationData.domain,
    };

    try {
      const res = await fetch('/api/organisation/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Organisation mise à jour avec succès !");
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour de l'organisation");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'organisation");
    }
  };

  if (!organisationData) {
    return <Chargement />;
  }

  const domains = [
    'AGRICULTURE', 'ENERGIE', 'LOGISTIQUE', 'NUMERIQUE', 'SECURITE',
    'TRANSPORT', 'INFORMATIQUE', 'SANTE', 'EDUCATION', 'FINANCE',
    'COMMERCE', 'CONSTRUCTION', 'ENVIRONNEMENT', 'TOURISME', 'INDUSTRIE',
    'TELECOMMUNICATIONS', 'IMMOBILIER', 'ADMINISTRATION', 'ART_CULTURE', 'ALIMENTATION',
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl p-6 space-y-6">
      {/* Nom de l'organisation */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Nom de l'organisation :</Label>
        <Input
          value={organisationData.name}
          onChange={(e) =>
            setOrganisationData({ ...organisationData, name: e.target.value })
          }
        />
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Logo de l'organisation :</Label>
        <div className="flex items-center gap-4">
          {/* Upload Logo */}
          <div className="flex items-center justify-center hover:border-primary cursor-pointer">
            <label htmlFor="logo" className="cursor-pointer text-black p-4 text-center">
              <UploadButton
                endpoint="imageUploader"
                className="relative h-full w-full ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                onClientUploadComplete={(res: any) => {
                  console.log("Fichiers uploadés: ", res);
                  if (res && res[0]) {
                    setLogo(res[0].ufsUrl);
                    toast.success("Upload du logo terminé !");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Erreur lors de l'upload: ${error.message}`);
                }}
              />
            </label>
          </div>
          {logo && enableLogo && (
            <img src={logo} alt="Logo" className="w-20 h-20 object-contain rounded" />
          )}
        </div>
      </div>

      {/* Activer Logo */}
      <div className="flex items-center gap-4">
        <Switch
          checked={enableLogo}
          onCheckedChange={setEnableLogo}
          id="afficher-fiche"
          className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c]"
        />
        <Label htmlFor="afficher-fiche">Activer Logo</Label>
      </div>

      {/* Type d'organisation (domain) */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Type d'organisation</Label>
        <Select
          value={organisationData?.domain?.toLowerCase() ?? ''}
          onValueChange={(value) =>
            setOrganisationData((prev) =>
              prev ? { ...prev, domain: value } : prev
            )
          }
        >
          <SelectTrigger>
            <SelectValue>
              {organisationData.domain.charAt(0).toUpperCase() + organisationData.domain.slice(1)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain} value={domain.toLowerCase()}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Langue */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Langue</Label>
        <Select defaultValue="fr">
          <SelectTrigger>
            <SelectValue>Français</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">Anglais</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bouton enregistrer */}
      <div className="pt-4">
        <Button type="submit" className="bg-red-800 hover:bg-red-700 text-white">
          Enregistrée
        </Button>
      </div>
    </form>
  );
}
