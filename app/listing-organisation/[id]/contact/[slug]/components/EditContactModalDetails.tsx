"use client";

import type React from "react";
import { useState } from "react";
import { Building2, Mail, MapPin, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  niveau: string;
  status_contact: string; // Doit être une string, pas un array
  sector: string;
}

interface EditContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Contact) => Promise<void>;
}

export function EditContactModalDetails({
  contact,
  isOpen,
  onClose,
  onSave,
}: EditContactModalProps) {
  const [formData, setFormData] = useState<Contact>({ ...contact });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Modifier les informations du contact</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">

            <div className="flex items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right flex items-center justify-end"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="email"
                className="text-right flex items-center justify-end"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="phone"
                className="text-right flex items-center justify-end"
              >
                <Phone className="h-4 w-4 mr-2" />
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="address"
                className="text-right flex items-center justify-end"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="status_contact"
                className="text-right flex items-center justify-end"
              >
                <User className="h-4 w-4 mr-2" />
                Type
              </Label>

              <Input id="status_contact" name="status_contact" value={formData.status_contact} onChange={handleChange} className="col-span-3" disabled />

            </div>




            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="text-right flex items-center justify-end">
                <Building2 className="h-4 w-4 mr-2" />
                Secteur
              </Label>
              <Select
                disabled
                value={formData.sector}
                onValueChange={(value) => setFormData({ ...formData, sector: value as string })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGRICULTURE_ELEVAGE">Agriculture élevage</SelectItem>
                  <SelectItem value="AGRICULTURE_PECHE">Agriculture pêche</SelectItem>
                  <SelectItem value="AGRICULTURE_AGROINDUSTRIE">Agriculture agriculture industrielle</SelectItem>
                  <SelectItem value="ENERGIE_RENOUVELABLE">Energie renouvelable</SelectItem>
                  <SelectItem value="ENERGIE_FOSSILE">Energie fossile</SelectItem>
                  <SelectItem value="ENERGIE_DISTRIBUTION">Energie distribution</SelectItem>
                  <SelectItem value="LOGISTIQUE_TRANSPORT">Logistique transport</SelectItem>
                  <SelectItem value="LOGISTIQUE_ENTREPOT">Logistique entrepot</SelectItem>
                  <SelectItem value="LOGISTIQUE_CHAINE_APPRO">Logistique chaîne d'approvisionnement</SelectItem>
                  <SelectItem value="NUMERIQUE_DEV">Numérique développement</SelectItem>
                  <SelectItem value="NUMERIQUE_DATA">Numérique données</SelectItem>
                  <SelectItem value="NUMERIQUE_IA">Numérique IA</SelectItem>
                  <SelectItem value="NUMERIQUE_CYBERSECURITE">Numérique cybersécurité</SelectItem>
                  <SelectItem value="SECURITE_PRIVE">Sécurité privée</SelectItem>
                  <SelectItem value="SECURITE_CIVILE">Sécurité civile</SelectItem>
                  <SelectItem value="SECURITE_INFORMATIQUE">Sécurité informatique</SelectItem>
                  <SelectItem value="TRANSPORT_MARCHANDISE">Transport marchandise</SelectItem>
                  <SelectItem value="TRANSPORT_PERSONNE">Transport personne</SelectItem>
                  <SelectItem value="TRANSPORT_URBAIN">Transport urbain</SelectItem>
                  <SelectItem value="INFORMATIQUE_DEV">Informatique développement</SelectItem>
                  <SelectItem value="INFORMATIQUE_RESEAU">Informatique réseau</SelectItem>
                  <SelectItem value="INFORMATIQUE_SUPPORT">Informatique support</SelectItem>
                  <SelectItem value="SANTE_HOSPITALIER">Santé hospitalier</SelectItem>
                  <SelectItem value="SANTE_PHARMACEUTIQUE">Santé pharmaceutique</SelectItem>
                  <SelectItem value="SANTE_EQUIP_MEDICAL">Santé équipe médicale</SelectItem>
                  <SelectItem value="EDUCATION_FORMATION">Education formation</SelectItem>
                  <SelectItem value="EDUCATION_EDTECH">Education éducation technique</SelectItem>
                  <SelectItem value="EDUCATION_SUPERIEUR">Education supérieur</SelectItem>
                  <SelectItem value="FINANCE_BANQUE">Finance banque</SelectItem>
                  <SelectItem value="FINANCE_ASSURANCE">Finance assurance</SelectItem>
                  <SelectItem value="FINANCE_FINTECH">Finance fintech</SelectItem>
                  <SelectItem value="COMMERCE_DETAIL">Commerce détail</SelectItem>
                  <SelectItem value="COMMERCE_GROS">Commerce gros</SelectItem>
                  <SelectItem value="COMMERCE_ECOMMERCE">Commerce éco-commerce</SelectItem>
                  <SelectItem value="CONSTRUCTION_BATIMENT">Construction bâtiment</SelectItem>
                  <SelectItem value="CONSTRUCTION_TRAVAUX_PUBLICS">Construction travaux publics</SelectItem>
                  <SelectItem value="CONSTRUCTION_MATERIAUX">Construction matériaux</SelectItem>
                  <SelectItem value="ENVIRONNEMENT_GESTION_DECHETS">Environnement gestion déchets</SelectItem>
                  <SelectItem value="ENVIRONNEMENT_EAU">Environnement eau</SelectItem>
                  <SelectItem value="ENVIRONNEMENT_CLIMAT">Environnement climat</SelectItem>
                  <SelectItem value="TOURISME_CULTUREL">Tourisme culturel</SelectItem>
                  <SelectItem value="TOURISME_ECOTOURISME">Tourisme éco-tourisme</SelectItem>
                  <SelectItem value="TOURISME_HOTELLERIE">Tourisme hôtellerie</SelectItem>
                  <SelectItem value="INDUSTRIE_TEXTILE">Industrie textile</SelectItem>
                  <SelectItem value="INDUSTRIE_AGROALIMENTAIRE">Industrie agroalimentaire</SelectItem>
                  <SelectItem value="INDUSTRIE_CHIMIQUE">Industrie chimique</SelectItem>
                  <SelectItem value="TELECOM_RESEAUX">Télécom réseaux</SelectItem>
                  <SelectItem value="TELECOM_INTERNET">Télécom internet</SelectItem>
                  <SelectItem value="TELECOM_SERVICES">Télécom services</SelectItem>
                  <SelectItem value="IMMOBILIER_RESIDENTIEL">Immobilier résidentiel</SelectItem>
                  <SelectItem value="IMMOBILIER_COMMERCIAL">Immobilier commercial</SelectItem>
                  <SelectItem value="IMMOBILIER_GESTION">Immobilier gestion</SelectItem>
                  <SelectItem value="ADMINISTRATION_ETAT">Administration état</SelectItem>
                  <SelectItem value="ADMINISTRATION_TERRITORIALE">Administration territoriale</SelectItem>
                  <SelectItem value="ADMINISTRATION_INSTITUTIONS">Administration institutions</SelectItem>
                  <SelectItem value="ART_CULTURE_MUSIQUE">Arts & culture musicale</SelectItem>
                  <SelectItem value="ART_CULTURE_PEINTURE">Arts & culture peinture</SelectItem>
                  <SelectItem value="ART_CULTURE_SPECTACLE">Arts & culture spectacle</SelectItem>
                  <SelectItem value="ALIMENTATION_TRANSFORMATION">Alimentation transformation</SelectItem>
                  <SelectItem value="ALIMENTATION_RESTAURATION">Alimentation restauration</SelectItem>
                  <SelectItem value="ALIMENTATION_DISTRIBUTION">Alimentation distribution</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>

          <SheetFooter className="mt-6 flex justify-end space-x-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </SheetClose>
            <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}