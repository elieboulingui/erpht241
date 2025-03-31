import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction d'assistance pour extraire l'ID de l'URL
export const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listing-organisation\/([^/]+)\/contact/)
  return match ? match[1] : null
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in XAF
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace(/\s/g, " ")
}
