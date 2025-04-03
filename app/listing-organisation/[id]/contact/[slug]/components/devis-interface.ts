export interface Devis {
  id: string;
  devisNumber: string;
  totalAmount: number;
  taxAmount: number;
  taxType: string;
  totalWithTax: number;
  status: string;
  dateFacturation?: string;
  dateEcheance?: string;
  date?: string | Date; // Si le champ s'appelle 'date'
  createdAt?: string | Date; // Si le champ s'appelle 'createdAt'
  emissionDate?: string | Date; // Si le champ a un autre nom
  client?: {
    name: string;
    email: string;
    address: string;
  };
  products?: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    total: number;
  }>;
  creationDate?: string;
  dueDate?: string;
  paymentMethod?: string;
  sendLater?: boolean;
  terms?: string;
}

export const ALL_TAXES = ["TVA", "Hors Taxe"];
export const ALL_STATUSES = ["Validé", "Facturé", "ATTENTE", "Annulé"];

export const getStatusClass = (status: string): string => {
  switch (status) {
    case "Validé":
      return "bg-amber-100 text-amber-800";
    case "Facturé":
      return "bg-green-100 text-green-800";
    case "ATTENTE":
      return "bg-pink-200 text-pink-800";
    case "Annulé":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const extractUrlParams = (
  pathname: string
): { organisationId: string; contactSlug: string } => {
  const regex = /\/listing-organisation\/([^/]+)\/contact\/([^/]+)/;
  const match = pathname.match(regex);

  return {
    organisationId: match?.[1] || "",
    contactSlug: match?.[2] || "",
  };
};
