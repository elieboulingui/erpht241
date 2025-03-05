import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction d'assistance pour extraire l'ID de l'URL
export const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listingorg\/([^/]+)\/contact/)
  return match ? match[1] : null
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

