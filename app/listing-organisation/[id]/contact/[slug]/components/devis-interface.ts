export interface Devis {
    id: string;
    devisNumber: string;
    totalAmount: number;
    taxAmount: number;
    taxType: string;
    totalWithTax: number;
    status: string;
  }
  
  export const ALL_STATUSES = ["Attente", "Validé", "Facturé", "Archivé"]
  export const ALL_TAXES = ["TVA", "Hors Taxe"]
  
  export const getStatusClass = (status: string) => {
    switch (status) {
      case "Validé":
        return "bg-amber-100 text-amber-800"
      case "Facturé":
        return "bg-green-100 text-green-800"
      case "Attente":
        return "bg-pink-200 text-pink-800"
      case "Archivé":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  export const extractUrlParams = (path: string) => {
    const regex = /\/listing-organisation\/([^/]+)\/contact\/([^/]+)/
    const match = path.match(regex)
  
    if (!match) {
      console.error("URL format invalide:", path)
      return { organisationId: "", contactSlug: "" }
    }
  
    return {
      organisationId: match[1],
      contactSlug: match[2],
    }
  }
  
  