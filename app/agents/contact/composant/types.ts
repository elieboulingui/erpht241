export type Niveau = "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT"

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  niveau: Niveau
  tags: string
  logo?: string | null
  adresse: string
  status_contact: string
}

export interface ContactData {
  name: string
  description?: string
  email?: string
  phone?: string
  adresse?: string
  logo?: string
}

export interface ExistingContact {
  name: string
  email?: string
}

export interface CompanyData {
  sector: string
  companies: {
    Nom: string
    Email: string
    Telephone: string
    Telephone2?: string
    Telephone3?: string
    Description: string
    Adresse: string
    website: string
  }[]
}

