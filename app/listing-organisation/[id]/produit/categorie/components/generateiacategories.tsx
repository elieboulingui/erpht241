"use client"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { usePathname } from "next/navigation";

export function Generateiacategorie() {
  const [open, setOpen] = useState(false); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [domain, setDomain] = useState(""); // Domaine d'activité
  const [categories, setCategories] = useState<string[]>([]); // Catégories générées par l'IA
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const pathname = usePathname();

  const extractOrganisationId = (url: string): string | null => {
    const regex = /listing-organisation\/([a-zA-Z0-9_-]+)\/produit/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (pathname) {
      const id = extractOrganisationId(pathname);
      if (id) {
        setOrganisationId(id);
      } else {
        console.error("Organisation ID not found in the URL.");
      }
    }
  }, [pathname]);

  // Appel à l'IA pour générer les catégories liées à un domaine donné
  const fetchCategories = async (domain: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) throw new Error("API key is missing!");
  
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const structuredPrompt = `
      Vous êtes un assistant IA qui génère une liste de catégories en fonction du domaine donné.
      Je vais vous donner un domaine d'activité, et vous devez répondre uniquement avec un tableau JSON
      contenant les catégories associées à ce domaine.
  
      Domaine: "${domain}"
  
      Format attendu (JSON valide) :
      [
        "Catégorie 1",
        "Catégorie 2",
        "Catégorie 3"
      ]
    `;
  
    try {
      const response = await model.generateContent(structuredPrompt);
      
      if (response?.response?.text) {
        const text = await response.response.text();
  
        console.log("AI Response:", text); // Log the raw response for debugging
  
        // Clean the response text (strip unnecessary characters or spaces)
        const cleanedText = text.trim().replace(/^\[|\]$/g, "").replace(/\n/g, "");
  
        try {
          // Try parsing the cleaned text as JSON
          const categoriesList = JSON.parse(`[${cleanedText}]`);  // Wrap the cleaned text in brackets to ensure it’s a valid JSON array
  
          if (Array.isArray(categoriesList)) {
            setCategories(categoriesList); // Populate categories
          } else {
            console.error("Invalid format: expected an array of categories.");
            alert("La réponse de l'IA n'est pas un tableau valide. Veuillez réessayer.");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("La réponse de l'IA n'est pas dans un format valide. Veuillez réessayer.");
        }
      }
    } catch (error) {
      console.error("Error generating categories:", error);
      alert("Une erreur est survenue lors de la génération des catégories. Veuillez réessayer.");
    }
  };
  
  


  // Gérer l'entrée du domaine
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-black hover:bg-black text-white font-medium px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={isGenerating || isAdding}
      >
        Générer des catégories
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl h-[50vh] bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-black text-center">
              Génération un domain d activite
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                  <Loader2 className="h-10 w-10 text-black animate-spin" />
                  <p className="text-lg font-medium text-gray-700">Génération en cours...</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Formulaire pour saisir le domaine d'activité */}
                <div>
                  <label htmlFor="domain" className="block text-lg font-semibold mb-2">
                    Domaine d'activité
                  </label>
                  <input
                    type="text"
                    id="domain"
                    value={domain}
                    onChange={handleDomainChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Entrez un domaine d'activité..."
                  />
                  <Button
                    onClick={() => fetchCategories(domain)}
                    className="mt-4 w-full bg-blue-600 text-white"
                    disabled={isGenerating}
                  >
                    Générer les catégories
                  </Button>
                </div>

                {/* Affichage des catégories générées */}
                {categories.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-3">Catégories générées</h2>
                    {categories.map((category, index) => (
                      <div key={index} className="mb-4">
                        <input
                          type="text"
                          value={category}
                          readOnly
                          className="w-full p-3 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
