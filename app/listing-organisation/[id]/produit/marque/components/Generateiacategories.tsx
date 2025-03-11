"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { creatcategory } from "../action/createmarque";

export function Generateiacategories() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [domain, setDomain] = useState(""); // Domaine d'activité
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([]);
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
        toast.error("Organisation ID not found in the URL.");
      }
    }
  }, [pathname]);

  // Appel à l'IA pour générer les catégories liées à un domaine donné
  const fetchCategories = async (domain: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      toast.error("❌ API key is missing!");
      toast.error("Clé API manquante. Vérifiez votre configuration.");
      return;
    }
  
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const structuredPrompt = `
    Vous êtes un assistant IA qui génère une liste de marques liées à un domaine donné.
    Si le domaine est "vêtements", répondez avec une liste complète de marques de vêtements du monde entier.
  
    Exemple de réponse attendue : 
    {
      "categories": ["Nike", "Adidas", "Puma", "Zara", "H&M", ...]
    }
  
    marque: "${domain}"
  
    Réponse attendue :
    {
      "categories": ["Marque 1", "Marque 2", "Marque 3", ...]
    }
  `;
  
  
    try {
      setIsGenerating(true);
  
      const response = await model.generateContent(structuredPrompt);
  
      if (!response) {
        toast.error("❌ Aucune réponse de l'IA.");
        toast.error("L'IA n'a pas répondu. Réessayez plus tard.");
        return;
      }
  
      const textResponse = await response.response.text();
      const cleanedText = textResponse.replace(/```json|```/g, "").trim();
  
      try {
        const jsonResponse = JSON.parse(cleanedText);
  
        // Validate that categories are present and it's an array
        if (jsonResponse?.categories && Array.isArray(jsonResponse.categories)) {
          setCategories(jsonResponse.categories.map((cat: string) => ({ name: cat, checked: false })));
        } else {
          toast.error("❌ Format JSON invalide : La réponse n'inclut pas un tableau de catégories.");
        }
      } catch (jsonParseError) {
        toast.error("❌ Format JSON invalide : ");
      }
    } catch (error) {
      toast.error("⚠️ Erreur lors de la requête AI:");
      toast.error("Une erreur est survenue. Vérifiez la console pour plus de détails.");
    } finally {
      setIsGenerating(false);
    }
  };
  

  // Gérer l'entrée du domaine
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
  };

  // Mettre à jour l'état de la checkbox
  const handleCheckboxChange = (index: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, i) =>
        i === index ? { ...category, checked: !category.checked } : category
      )
    );
  };

  // Soumettre les catégories sélectionnées à l'API
  const handleSubmitCategories = async () => {
    if (!organisationId) {
      toast.error("Impossible de récupérer l'ID de l'organisation.");
      return;
    }

    // Filtrer les catégories sélectionnées
    const selectedCategories = categories.filter((cat) => cat.checked);

    if (selectedCategories.length === 0) {
      toast.error("Aucune catégorie sélectionnée !");
      return;
    }

    setIsAdding(true);

    try {
      for (const category of selectedCategories) {
        // Appeler la fonction creatcategory pour chaque catégorie sélectionnée
        await creatcategory({
          name: category.name,
          organisationId,
        });
      }

      toast.success("Catégories créées avec succès !");
      setCategories([]);  // Clear categories after successful submission
      setOpen(false);  // Close the dialog after submission
    } catch (error) {
      toast.error("Erreur:");
      toast.error("Une erreur est survenue.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-white hover:bg-white text-black font-medium px-6 py-2.5"
        disabled={isGenerating || isAdding}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Générer des marque
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-96 h-[60vh] bg-white shadow-2xl border-0 p-6 overflow-hidden overflow-y-auto">
          <DialogHeader></DialogHeader>

          <div className="p-6 flex flex-col items-center">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                  <Loader2 className="h-10 w-10 text-black animate-spin" />
                  <p className="text-lg font-medium text-gray-700">Génération en cours...</p>
                </div>
              </div>
            )}

            {/* Formulaire pour saisir le domaine d'activité */}
            <div className="w-full max-w-lg relative">
              <label
                htmlFor="domain"
                className="block text-lg font-semibold mb-2 text-center sticky top-0 bg-white p-2 z-10"
              >
                marque
              </label>
              <div className="overflow-y-auto max-h-[60vh]">
                <Input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={handleDomainChange}
                  className="w-full p-3 border rounded-md text-center"
                  placeholder="Entrez un domaine d'activité..."
                />
                <Button
                  onClick={() => fetchCategories(domain)}
                  className="mt-4 w-full bg-black hover:bg-black text-white"
                  disabled={isGenerating}
                >
                  Générer des marques
                </Button>
              </div>
            </div>

            {/* Affichage des catégories générées */}
            {categories.length > 0 && (
              <div className="mt-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-3 text-center">marques générées</h2>
                <div className="flex flex-col items-center gap-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between w-full bg-gray-100 p-3 rounded-md">
                      <input
                        type="text"
                        value={category.name}
                        readOnly
                        className="w-full bg-transparent text-center"
                      />
                      <input
                        type="checkbox"
                        checked={category.checked}
                        onChange={() => handleCheckboxChange(index)}
                        className="ml-4 w-5 h-5 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleSubmitCategories}
                  className="mt-4 w-full bg-black hover:bg-black text-white"
                  disabled={isAdding}
                >
                  {isAdding ? "Ajout en cours..." : "Créer les catégories sélectionnées"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


