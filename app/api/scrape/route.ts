import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

// Définition des types
interface SocialMediaLinks {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  youtube?: string
  whatsapp?: string
}

interface Business {
  name: string
  service: string
  phone: string
  phoneNumbers: string[]
  address: string
  email: string
  website: string
  socialMedia: SocialMediaLinks
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Un terme de recherche est requis" }, { status: 400 })
  }

  try {
    const searchUrl =`https://www.lepratiquedugabon.com/?s=${encodeURIComponent(query)}&post_type=annuaire`;


    // Configuration du fetch avec timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`Échec de la récupération: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const businesses: Business[] = []

    // Fonction pour nettoyer le texte
    const cleanText = (text: string | null | undefined): string => {
      if (!text) return "Non disponible"
      return text
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[\n\t]/g, "")
    }

    // Extraction principale - Cibler chaque div.acces qui contient les informations d'une entreprise
    $("#listcol1 .acces").each((index, element) => {
      // Récupérer le nom et le service depuis col-middle
      const colMiddle = $(element).find("div.col-middle")
      const name = cleanText(colMiddle.find("h3").text())
      const service = cleanText(colMiddle.find("span").text())

      const colRight = $(element).find("div.col-right")

      // Adresse
      const addressDiv = colRight.find("div.adresse")
      const addressParts: string[] = []
      addressDiv.find("p").each((i, p) => {
        const part = cleanText($(p).text())
        if (part && part !== "Non disponible") {
          addressParts.push(part)
        }
      })
      const address = addressParts.join(", ") || "Non disponible"

      // Téléphone
      const telephoneDiv = colRight.find("div.telephone")
      const fullPhoneInfo = cleanText(telephoneDiv.text())
      const phoneNumbers: string[] = []

      // Extraction des numéros
      telephoneDiv.find("a[href^='tel:']").each((i, tel) => {
        const num = cleanText($(tel).text())
        if (num && num !== "Non disponible") {
          phoneNumbers.push(num)
        }
      })

      // Email et site web
      const webmailDiv = colRight.find("div.webmail")
      const email = cleanText(webmailDiv.find("a[href^='mailto:']").text()) || "Non disponible"
      const website = cleanText(webmailDiv.find("a[href^='http']").attr("href")) || "Non disponible"

      // Réseaux sociaux
      const socialLinks: SocialMediaLinks = {}

      // Rechercher les liens sociaux dans toutes les sections possibles
      colRight.find("a").each((i, link) => {
        const href = $(link).attr("href") || ""
        const text = cleanText($(link).text()).toLowerCase()

        if (href.includes("facebook") || text.includes("facebook")) {
          socialLinks.facebook = href
        } else if (href.includes("instagram") || text.includes("instagram")) {
          socialLinks.instagram = href
        } else if (href.includes("twitter") || href.includes("x.com") || text.includes("twitter")) {
          socialLinks.twitter = href
        } else if (href.includes("linkedin") || text.includes("linkedin")) {
          socialLinks.linkedin = href
        } else if (href.includes("youtube") || text.includes("youtube")) {
          socialLinks.youtube = href
        } else if (href.includes("wa.me") || text.includes("whatsapp")) {
          socialLinks.whatsapp = href
        }
      })

      // Ajout de l'entreprise
      businesses.push({
        name,
        service,
        phone: fullPhoneInfo,
        phoneNumbers,
        address,
        email,
        website,
        socialMedia: socialLinks,
      })
    })

    // Formatage final des résultats
    const formattedResults = businesses.map((business) => ({
      ...business,
      phoneNumbers: business.phoneNumbers.filter((num) => num !== "Non disponible"),
      email: business.email === "Non disponible" ? "" : business.email,
      website: business.website === "Non disponible" ? "" : business.website,
    }))

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("Erreur de scraping:", error)
    return NextResponse.json(
      {
        error: "Une erreur s'est produite lors de l'extraction des données",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    )
  }
}

