"use server"

import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien configuré

// Enumération des niveaux possibles pour validation
type NiveauEnum = "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT"
type StatutContactEnum = "PERSONNE" | "COMPAGNIE" | "GROSSISTE"
type Sector =
  // AGRICULTURE
  | "AGRICULTURE_ELEVAGE"
  | "AGRICULTURE_PECHE"
  | "AGRICULTURE_AGROINDUSTRIE"

  // ENERGIE
  | "ENERGIE_RENOUVELABLE"
  | "ENERGIE_FOSSILE"
  | "ENERGIE_DISTRIBUTION"

  // LOGISTIQUE
  | "LOGISTIQUE_TRANSPORT"
  | "LOGISTIQUE_ENTREPOT"
  | "LOGISTIQUE_CHAINE_APPRO"

  // NUMERIQUE
  | "NUMERIQUE_DEV"
  | "NUMERIQUE_DATA"
  | "NUMERIQUE_IA"
  | "NUMERIQUE_CYBERSECURITE"

  // SECURITE
  | "SECURITE_PRIVE"
  | "SECURITE_CIVILE"
  | "SECURITE_INFORMATIQUE"

  // TRANSPORT
  | "TRANSPORT_MARCHANDISE"
  | "TRANSPORT_PERSONNE"
  | "TRANSPORT_URBAIN"

  // INFORMATIQUE
  | "INFORMATIQUE_DEV"
  | "INFORMATIQUE_RESEAU"
  | "INFORMATIQUE_SUPPORT"

  // SANTE
  | "SANTE_HOSPITALIER"
  | "SANTE_PHARMACEUTIQUE"
  | "SANTE_EQUIP_MEDICAL"

  // EDUCATION
  | "EDUCATION_FORMATION"
  | "EDUCATION_EDTECH"
  | "EDUCATION_SUPERIEUR"

  // FINANCE
  | "FINANCE_BANQUE"
  | "FINANCE_ASSURANCE"
  | "FINANCE_FINTECH"

  // COMMERCE
  | "COMMERCE_DETAIL"
  | "COMMERCE_GROS"
  | "COMMERCE_ECOMMERCE"

  // CONSTRUCTION
  | "CONSTRUCTION_BATIMENT"
  | "CONSTRUCTION_TRAVAUX_PUBLICS"
  | "CONSTRUCTION_MATERIAUX"

  // ENVIRONNEMENT
  | "ENVIRONNEMENT_GESTION_DECHETS"
  | "ENVIRONNEMENT_EAU"
  | "ENVIRONNEMENT_CLIMAT"

  // TOURISME
  | "TOURISME_CULTUREL"
  | "TOURISME_ECOTOURISME"
  | "TOURISME_HOTELLERIE"

  // INDUSTRIE
  | "INDUSTRIE_TEXTILE"
  | "INDUSTRIE_AGROALIMENTAIRE"
  | "INDUSTRIE_CHIMIQUE"

  // TELECOMMUNICATIONS
  | "TELECOM_RESEAUX"
  | "TELECOM_INTERNET"
  | "TELECOM_SERVICES"

  // IMMOBILIER
  | "IMMOBILIER_RESIDENTIEL"
  | "IMMOBILIER_COMMERCIAL"
  | "IMMOBILIER_GESTION"

  // ADMINISTRATION
  | "ADMINISTRATION_ETAT"
  | "ADMINISTRATION_TERRITORIALE"
  | "ADMINISTRATION_INSTITUTIONS"

  // ART & CULTURE
  | "ART_CULTURE_MUSIQUE"
  | "ART_CULTURE_PEINTURE"
  | "ART_CULTURE_SPECTACLE"

  // ALIMENTATION
  | "ALIMENTATION_TRANSFORMATION"
  | "ALIMENTATION_RESTAURATION"
  | "ALIMENTATION_DISTRIBUTION";

// Fonction pour mettre à jour un contact en fonction de son ID
export async function UpdateContact(
  contactId: string,
  updatedData: {
    name?: string
    email?: string
    phone?: string
    niveau?: NiveauEnum
    tags?: string
    adresse?: string
    logo?: string
    status_contact?: StatutContactEnum
    sector?: Sector
  },
) {
  if (!contactId) {
    throw new Error("L'ID du contact est requis.")
  }

  // Vérification de la validité des données de niveau
  if (updatedData.niveau && !["PROSPECT_POTENTIAL", "PROSPECT", "CLIENT"].includes(updatedData.niveau)) {
    throw new Error("Le niveau fourni est invalide.")
  }

  // Validation de l'email si un email est fourni
  if (updatedData.email && !validateEmail(updatedData.email)) {
    throw new Error("L'email fourni n'est pas valide.")
  }

  try {
    // Mise à jour du contact avec les nouvelles données
    const updatedContact = await prisma.contact.update({
      where: {
        id: contactId, // Utiliser l'ID du contact pour la mise à jour
      },
      data: {
        name: updatedData.name, // Mettre à jour le nom
        email: updatedData.email, // Mettre à jour l'email
        phone: updatedData.phone, // Mettre à jour le téléphone
        niveau: updatedData.niveau, // Mettre à jour le niveau
        tags: updatedData.tags ? JSON.stringify(updatedData.tags) : undefined, // Si 'tags' est fourni, mettre à jour
        status_contact: updatedData.status_contact ? updatedData.status_contact : undefined, // Si 'status_contact' est fourni, mettre à jour
        sector: updatedData.sector, // mettre à jour le secteur
      },
    })

    if (!updatedContact) {
      throw new Error("Le contact n'a pas pu être mis à jour.")
    }

    return updatedContact // Retourner le contact mis à jour
  } catch (error) {
    // Amélioration de la gestion des erreurs
    console.error("Erreur lors de la mise à jour du contact:", error)
    throw new Error("Une erreur est survenue lors de la mise à jour du contact.")
  }
}

// Fonction de validation d'email
function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,4}$/
  return re.test(email)
}
