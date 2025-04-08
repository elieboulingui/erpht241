import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

interface Business {
  name: string;
  service: string;
  phone: string;
  phoneNumbers: string[];
  address: string;
  email: string;
  website: string;
  socialMedia: SocialMediaLinks;
}

const MAX_RETRIES = 3;
const TIMEOUT_DURATION = 15000;

async function fetchWithRetry(url: string, options: any, retryCount = 0): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeout);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retry ${retryCount + 1} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return fetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
}

function cleanText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[\n\t]/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: "Veuillez fournir un terme de recherche d'au moins 3 caractères" },
      { status: 400 }
    );
  }

  try {
    const searchUrl = `https://www.lepratiquedugabon.com/?s=${encodeURIComponent(query)}&post_type=annuaire`;
    
    const response = await fetchWithRetry(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      next: { revalidate: 3600 } // Cache de 1 heure
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const businesses: Business[] = [];

    $("#listcol1 .acces").each((index, element) => {
      const $el = $(element);
      const name = cleanText($el.find("div.col-middle h3").text());
      const service = cleanText($el.find("div.col-middle span").text());
      const colRight = $el.find("div.col-right");

      // Extraction des données
      const address = cleanText(colRight.find("div.adresse").text());
      const phone = cleanText(colRight.find("div.telephone").text());
      
      const phoneNumbers: string[] = [];
      colRight.find("a[href^='tel:']").each((i, tel) => {
        phoneNumbers.push(cleanText($(tel).text()));
      });

      const email = cleanText(colRight.find("a[href^='mailto:']").text());
      const website = cleanText(colRight.find("a[href^='http']").attr("href"));

      const socialLinks: SocialMediaLinks = {};
      colRight.find("a").each((i, link) => {
        const href = $(link).attr("href") || "";
        if (href.includes("facebook.com")) socialLinks.facebook = href;
        if (href.includes("instagram.com")) socialLinks.instagram = href;
        if (href.includes("twitter.com") || href.includes("x.com")) socialLinks.twitter = href;
        if (href.includes("linkedin.com")) socialLinks.linkedin = href;
      });

      businesses.push({
        name,
        service,
        phone,
        phoneNumbers,
        address,
        email,
        website: website || "",
        socialMedia: socialLinks,
      });
    });

    return NextResponse.json(businesses.filter(b => b.name));
  } catch (error) {
    console.error("Scraping error:", error);
    
    const errorMessage = error instanceof Error ? 
      (error.name === 'AbortError' ? 
        "Le serveur a mis trop de temps à répondre" : 
        error.message) : 
      "Erreur inconnue";

    return NextResponse.json(
      { 
        error: "Échec de la recherche",
        message: errorMessage,
        suggestion: "Veuillez essayer avec des termes différents ou réessayer plus tard"
      },
      { status: 500 }
    );
  }
}