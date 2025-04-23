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
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { CustomTabs } from "@/components/CustomTabs";
import { Settings, DollarSign, FileText, File } from 'lucide-react';
import Chargement from '@/components/Chargement';

interface OrganisationData {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  currency?: string;
  taxRate?: number;
  invoicePrefix?: string;
  quotePrefix?: string;
  invoiceFooter?: string;
  quoteFooter?: string;
  quoteConditions?: string[];
  quoteValidity?: number;
  quotePaymentTerms?: string;
  quoteNotes?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyRegistration?: string;
  companyTaxId?: string;
  bankDetails?: string;
}

const domains = [
  'AGRICULTURE', 'ENERGIE', 'LOGISTIQUE', 'NUMERIQUE', 'SECURITE',
  'TRANSPORT', 'INFORMATIQUE', 'SANTE', 'EDUCATION', 'FINANCE',
  'COMMERCE', 'CONSTRUCTION', 'ENVIRONNEMENT', 'TOURISME', 'INDUSTRIE',
  'TELECOMMUNICATIONS', 'IMMOBILIER', 'ADMINISTRATION', 'ART_CULTURE', 'ALIMENTATION',
];

export default function OrganisationForm() {
  const [organisationData, setOrganisationData] = useState<OrganisationData | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [enableLogo, setEnableLogo] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/listing-organisation\/([^/]+)\//);
    const orgId = match?.[1];

    if (orgId) {
      fetch(`/api/organisation?id=${orgId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrganisationData({
            ...data,
            currency: data.currency || 'EUR',
            taxRate: data.taxRate || 20,
            invoicePrefix: data.invoicePrefix || 'INV',
            quotePrefix: data.quotePrefix || 'DEV',
            invoiceFooter: data.invoiceFooter || '',
            quoteFooter: data.quoteFooter || ''
          });
          if (data.logo) {
            setLogo(data.logo);
            setEnableLogo(true);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Erreur lors du fetch de l'organisation", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
      currency: organisationData.currency,
      taxRate: organisationData.taxRate,
      invoicePrefix: organisationData.invoicePrefix,
      quotePrefix: organisationData.quotePrefix,
      invoiceFooter: organisationData.invoiceFooter,
      quoteFooter: organisationData.quoteFooter,
      quoteConditions: organisationData.quoteConditions,
      quoteValidity: organisationData.quoteValidity,
      quotePaymentTerms: organisationData.quotePaymentTerms,
      quoteNotes: organisationData.quoteNotes,
      companyAddress: organisationData.companyAddress,
      companyPhone: organisationData.companyPhone,
      companyEmail: organisationData.companyEmail,
      companyWebsite: organisationData.companyWebsite,
      companyRegistration: organisationData.companyRegistration,
      companyTaxId: organisationData.companyTaxId,
      bankDetails: organisationData.bankDetails,
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

  if (isLoading) {
    return <Chargement />;
  }

  if (!organisationData) {
    return <div className="p-6">Aucune organisation trouvée</div>;
  }

  const tabs = [
    {
      value: "general",
      label: "PARAMETRE GENERAUX",
      icon: <Settings className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label className="font-medium text-sm">Nom de l'organisation :</Label>
            <Input
              value={organisationData.name}
              onChange={(e) =>
                setOrganisationData({ ...organisationData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Logo de l'organisation :</Label>
            <div className="flex items-center gap-4">
              <UploadButton
                endpoint="imageUploader"
                className="ut-button:bg-[#7f1d1c] ut-button:ut-readying:bg-[#7f1d1c]/50"
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
              {logo && enableLogo && (
                <img src={logo} alt="Logo" className="w-20 h-20 object-contain rounded" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Switch
              checked={enableLogo}
              onCheckedChange={setEnableLogo}
              className="data-[state=checked]:bg-[#7f1d1c]"
            />
            <Label>Activer Logo</Label>
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Type d'organisation</Label>
            <Select
              value={organisationData.domain.toLowerCase()}
              onValueChange={(value) =>
                setOrganisationData({ ...organisationData, domain: value.toUpperCase() })
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {organisationData.domain.charAt(0).toUpperCase() + organisationData.domain.slice(1).toLowerCase()}
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
        </div>
      )
    },
    {
      value: "FINANCIER",
      label: "FINANCIER",
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label className="font-medium text-sm">Devise</Label>
            <Select
              value={organisationData.currency || 'EUR'}
              onValueChange={(value) =>
                setOrganisationData({ ...organisationData, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue>{organisationData.currency || 'EUR'}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">Euro (€)</SelectItem>
                <SelectItem value="USD">Dollar ($)</SelectItem>
                <SelectItem value="GBP">Livre (£)</SelectItem>
                <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Taux de TVA (%)</Label>
            <Input
              type="number"
              value={organisationData.taxRate || 20}
              onChange={(e) =>
                setOrganisationData({ ...organisationData, taxRate: Number(e.target.value) })
              }
            />
          </div>
        </div>
      )
    },
    {
      value: "DEV",
      label: "DEVIS",
      icon: <FileText className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6 p-4">
          <div className="space-y-4 border p-4 rounded-lg">
            <h3 className="font-medium">Paramètres devis</h3>
            
            <div className="space-y-2">
              <Label className="font-medium text-sm">Préfixe devis</Label>
              <Input
                value={organisationData.quotePrefix || 'DEV'}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, quotePrefix: e.target.value })
                }
              />
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Validité du devis (jours)</Label>
              <Input
                type="number"
                value={organisationData.quoteValidity || 30}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, quoteValidity: Number(e.target.value) })
                }
              />
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Conditions de paiement</Label>
              <Input
                value={organisationData.quotePaymentTerms || '50% à la commande, 50% à la livraison'}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, quotePaymentTerms: e.target.value })
                }
              />
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Notes/Remarques</Label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                value={organisationData.quoteNotes || ''}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, quoteNotes: e.target.value })
                }
                placeholder="Notes à afficher sur les devis"
              />
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Pied de page devis</Label>
              <Input
                value={organisationData.quoteFooter || ''}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, quoteFooter: e.target.value })
                }
                placeholder="Texte à afficher en bas des devis"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      value: "FAC",
      label: "FACTURE",
      icon: <File className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6 p-4">
          <div className="space-y-4 border p-4 rounded-lg">
            <h3 className="font-medium">Paramètres facture</h3>
            
            <div className="space-y-2">
              <Label className="font-medium text-sm">Préfixe facture</Label>
              <Input
                value={organisationData.invoicePrefix || 'INV'}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, invoicePrefix: e.target.value })
                }
              />
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Pied de page facture</Label>
              <Input
                value={organisationData.invoiceFooter || ''}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, invoiceFooter: e.target.value })
                }
                placeholder="Texte à afficher en bas des factures"
              />
            </div>
          </div>
    
          <div className="space-y-4 border p-4 rounded-lg">
            <h3 className="font-medium">Informations entreprise</h3>
            
            <div className="space-y-2">
              <Label className="font-medium text-sm">Adresse</Label>
              <Input
                value={organisationData.companyAddress || ''}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, companyAddress: e.target.value })
                }
              />
            </div>
    
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium text-sm">Téléphone</Label>
                <Input
                  value={organisationData.companyPhone || ''}
                  onChange={(e) =>
                    setOrganisationData({ ...organisationData, companyPhone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-sm">Email</Label>
                <Input
                  value={organisationData.companyEmail || ''}
                  onChange={(e) =>
                    setOrganisationData({ ...organisationData, companyEmail: e.target.value })
                  }
                />
              </div>
            </div>
    
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium text-sm">Site web</Label>
                <Input
                  value={organisationData.companyWebsite || ''}
                  onChange={(e) =>
                    setOrganisationData({ ...organisationData, companyWebsite: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-sm">Numéro d'enregistrement</Label>
                <Input
                  value={organisationData.companyRegistration || ''}
                  onChange={(e) =>
                    setOrganisationData({ ...organisationData, companyRegistration: e.target.value })
                  }
                />
              </div>
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Numéro fiscal</Label>
              <Input
                value={organisationData.companyTaxId || ''}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, companyTaxId: e.target.value })
                }
              />
            </div>
    
            <div className="space-y-2">
              <Label className="font-medium text-sm">Coordonnées bancaires</Label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                value={organisationData.bankDetails || ''}
                onChange={(e) =>
                  setOrganisationData({ ...organisationData, bankDetails: e.target.value })
                }
                placeholder="IBAN, nom de la banque, etc."
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  const getButtonText = () => {
    switch (activeTab) {
      case "general":
        return "Enregistrer les paramètres généraux";
      case "FINANCIER":
        return "Enregistrer les paramètres financiers";
      case "DEV":
        return "Enregistrer les paramètres devis";
      case "FAC":
        return "Enregistrer les paramètres facture";
      default:
        return "Enregistrer les modifications";
    }
  };

  return (
    <div className="w-full bg-white">
      <CustomTabs
        defaultValue="general"
        tabs={tabs}
        onTabChange={handleTabChange}
      />

      <div className='p-10'>
        <Button
          onClick={handleSubmit}
          className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}