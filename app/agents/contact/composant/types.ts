export type Niveau = "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT";
export type Sector =
  | "AGRICULTURE_ELEVAGE"
  | "AGRICULTURE_PECHE"
  | "AGRICULTURE_AGROINDUSTRIE"
  | "ENERGIE_RENOUVELABLE"
  | "ENERGIE_FOSSILE"
  | "ENERGIE_DISTRIBUTION"
  | "LOGISTIQUE_TRANSPORT"
  | "LOGISTIQUE_ENTREPOT"
  | "LOGISTIQUE_CHAINE_APPRO"
  | "NUMERIQUE_DEV"
  | "NUMERIQUE_DATA"
  | "NUMERIQUE_IA"
  | "NUMERIQUE_CYBERSECURITE"
  | "SECURITE_PRIVE"
  | "SECURITE_CIVILE"
  | "SECURITE_INFORMATIQUE"
  | "TRANSPORT_MARCHANDISE"
  | "TRANSPORT_PERSONNE"
  | "TRANSPORT_URBAIN"
  | "INFORMATIQUE_DEV"
  | "INFORMATIQUE_RESEAU"
  | "INFORMATIQUE_SUPPORT"
  | "SANTE_HOSPITALIER"
  | "SANTE_PHARMACEUTIQUE"
  | "SANTE_EQUIP_MEDICAL"
  | "EDUCATION_FORMATION"
  | "EDUCATION_EDTECH"
  | "EDUCATION_SUPERIEUR"
  | "FINANCE_BANQUE"
  | "FINANCE_ASSURANCE"
  | "FINANCE_FINTECH"
  | "COMMERCE_DETAIL"
  | "COMMERCE_GROS"
  | "COMMERCE_ECOMMERCE"
  | "CONSTRUCTION_BATIMENT"
  | "CONSTRUCTION_TRAVAUX_PUBLICS"
  | "CONSTRUCTION_MATERIAUX"
  | "ENVIRONNEMENT_GESTION_DECHETS"
  | "ENVIRONNEMENT_EAU"
  | "ENVIRONNEMENT_CLIMAT"
  | "TOURISME_CULTUREL"
  | "TOURISME_ECOTOURISME"
  | "TOURISME_HOTELLERIE"
  | "INDUSTRIE_TEXTILE"
  | "INDUSTRIE_AGROALIMENTAIRE"
  | "INDUSTRIE_CHIMIQUE"
  | "TELECOM_RESEAUX"
  | "TELECOM_INTERNET"
  | "TELECOM_SERVICES"
  | "IMMOBILIER_RESIDENTIEL"
  | "IMMOBILIER_COMMERCIAL"
  | "IMMOBILIER_GESTION"
  | "ADMINISTRATION_ETAT"
  | "ADMINISTRATION_TERRITORIALE"
  | "ADMINISTRATION_INSTITUTIONS"  
  | "ART_CULTURE_MUSIQUE"
  | "ART_CULTURE_PEINTURE"
  | "ART_CULTURE_SPECTACLE"
  | "ALIMENTATION_TRANSFORMATION"
  | "ALIMENTATION_RESTAURATION"
  | "ALIMENTATION_DISTRIBUTION";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  niveau: Niveau;
  tags: string;
  logo?: string | null;
  adresse: string;
  status_contact: string;
  sector: Sector;
}

export interface ContactData {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  adresse?: string;
  logo?: string;
}

export interface ExistingContact {
  name: string;
  email?: string;
}

export interface CompanyData {
  sector: Sector;
  companies: {
    Nom: string;
    Email: string;
    Telephone: string;
    Telephone2?: string;
    Telephone3?: string;
    Description: string;
    Adresse: string;
    website: string;
  }[];
}
