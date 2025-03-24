import type { ContactData, ExistingContact } from "./types"

export const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listing-organisation\/([^/]+)\/contact/)
  return match ? match[1] : null
}

export async function generateCompanyContactsFromLocalData(prompt: string): Promise<ContactData[]> {
  // Normalize the prompt for better matching
  const normalizedPrompt = prompt.toLowerCase().trim()

  try {
    // Fetch the data.json file
    const response = await fetch("/data.json")
    if (!response.ok) {
      throw new Error("Impossible de charger les données")
    }

    const data = await response.json()

    // Find the most relevant sector based on the prompt
    let relevantSector = data.find((sector: any) => normalizedPrompt.includes(sector.sector.toLowerCase()))

    // If no exact match, try to find partial matches
    if (!relevantSector) {
      relevantSector = data.find(
        (sector: any) =>
          sector.sector.toLowerCase().includes(normalizedPrompt) ||
          normalizedPrompt.includes(sector.sector.toLowerCase().split(" ")[0]),
      )
    }

    // If still no match or if the sector has no companies, throw a specific error
    if (!relevantSector) {
      throw new Error("SECTOR_NOT_FOUND")
    }

    // Get up to 6 companies from the relevant sector
    const companies = relevantSector.companies.filter((company: any) => Object.keys(company).length > 0).slice(0, 6)

    // If no companies found in the sector, throw a specific error
    if (companies.length === 0) {
      throw new Error("NO_COMPANIES_FOUND")
    }

    // Transform the data to match the expected format
    const companiesWithLogos = await Promise.all(
      companies.map(async (company: any) => {
        // Generate a placeholder logo based on company name
        const logo = await generateLogoPlaceholder(company.Nom)

        return {
          name: company.Nom || "",
          description: company.Description || "",
          email: company.Email || "",
          phone: company.Telephone || "",
          phone2: company.Telephone2 || "",
          phone3: company.Telephone3 || "",
          adresse: company.Adresse || "",
          website: company.website || "",
          logo: logo,
        }
      }),
    )

    return companiesWithLogos
  } catch (error: any) {
    console.error("Erreur lors de la récupération des données:", error)

    // Handle specific errors
    if (error.message === "SECTOR_NOT_FOUND") {
      throw new Error("Secteur non trouvé dans notre base de données")
    } else if (error.message === "NO_COMPANIES_FOUND") {
      throw new Error("Aucune entreprise trouvée dans ce secteur")
    }

    throw new Error("Impossible de générer les contacts")
  }
}

export async function generateLogoPlaceholder(companyName: string): Promise<string> {
  // Get initials from company name
  const initials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  // Generate random color
  const colors = [
    "#4F46E5",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#F97316",
    "#14B8A6",
    "#6366F1",
  ]
  const bgColor = colors[Math.floor(Math.random() * colors.length)]

  // Create SVG logo
  const svgLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="${bgColor}" rx="20" />
      <text x="100" y="115" fontFamily="Arial" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle">${initials}</text>
    </svg>
  `

  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgLogo)}`
  return dataUrl
}

export function isDuplicateContact(newContact: ContactData, existingContacts: ExistingContact[]): boolean {
  return existingContacts.some(
    (contact) =>
      contact.name.toLowerCase() === newContact.name.toLowerCase() ||
      (newContact.email && contact.email && contact.email.toLowerCase() === newContact.email.toLowerCase()),
  )
}

