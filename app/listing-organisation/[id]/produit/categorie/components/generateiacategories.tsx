"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Loader2, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { creatcategory } from "../action/creatcategory";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"; // Import Dialog components

export function Generateiacategorie() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog open state

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

  const fetchCategories = async (domain: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      toast.error("❌ API key is missing!");
      return;
    }
  
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    // Update the prompt to request exactly 7 categories
    const structuredPrompt = `
      Vous êtes un assistant IA qui génère une liste de catégories en fonction du domaine donné.
      Répondez uniquement avec un JSON valide contenant une clé "categories" avec exactement 7 catégories.
  
      Domaine: "${domain}"
  
      Réponse attendue :
      {
        "categories": ["Catégorie 1", "Catégorie 2", "Catégorie 3", "Catégorie 4", "Catégorie 5", "Catégorie 6", "Catégorie 7"]
      }
    `;
  
    try {
      setIsGenerating(true);
      const response = await model.generateContent(structuredPrompt);
  
      if (!response) {
        toast.error("❌ Aucune réponse de l'IA.");
        return;
      }
  
      const textResponse = await response.response.text();
      const cleanedText = textResponse.replace(/```json|```/g, "").trim();
      const jsonResponse = JSON.parse(cleanedText);
  
      if (jsonResponse?.categories && Array.isArray(jsonResponse.categories)) {
        // Ensure only 7 categories are added
        const limitedCategories = jsonResponse.categories.slice(0, 7);
        setCategories(limitedCategories.map((cat: string) => ({ name: cat, checked: false })));
      } else {
        toast.error("❌ Format JSON invalide :", jsonResponse);
      }
    } catch (error) {
      toast.error("⚠️ Erreur lors de la requête AI:");
    } finally {
      setIsGenerating(false);
    }
  };
  

  const handleCheckboxChange = (index: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, i) =>
        i === index ? { ...category, checked: !category.checked } : category
      )
    );
  };

  const handleSubmitCategories = async () => {
    if (!organisationId) {
      toast.error("Impossible de récupérer l'ID de l'organisation.");
      return;
    }

    const selectedCategories = categories.filter((cat) => cat.checked);

    if (selectedCategories.length === 0) {
      toast.error("Aucune catégorie sélectionnée !");
      return;
    }

    setIsAdding(true);

    try {
      for (const category of selectedCategories) {
        await creatcategory({
          name: category.name,
          organisationId,
        });
      }

      toast.success("Catégories créées avec succès !");
      setCategories([]);  // Clear categories after successful submission
      setIsDialogOpen(false); // Close the dialog after submission
    } catch (error) {
      toast.error("Erreur lors de la création des catégories.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Button to open the dialog */}
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-white text-black hover:bg-white font-medium px-6 py-2.5"
        disabled={isGenerating || isAdding}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Générer des catégories
      </Button>

      {/* Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="w-full max-w-md bg-gray-200/80 p-6 rounded-lg hover:bg-white"
        >
          <DialogHeader className="text-xl font-semibold  hover:bg-white">Générer des catégories</DialogHeader>

          <div className="space-y-4">
            {/* Domain input */}
            <div className="relative">
              <Input
                className="pr-10 bg-white"
                placeholder="Entrez un domaine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isGenerating}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <Button
              onClick={() => fetchCategories(searchQuery)}
              className="w-full bg-black hover:bg-black/80 text-white"
              disabled={isGenerating}
            >
              Générer les catégories
            </Button>

            {isGenerating && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Génération en cours...</span>
              </div>
            )}

            {/* Display categories once generated */}
            {categories.length > 0 && !isGenerating && (
  <div className="grid grid-cols-3 gap-3 mt-4"> {/* Changed to grid-cols-3 */}
    {categories.map((category, index) => (
      <div
        key={index}
        className="flex items-center gap-2 bg-white p-3 rounded-md border border-gray-300"
      >
        <span>{category.name}</span>
        <input
          type="checkbox"
          checked={category.checked}
          onChange={() => handleCheckboxChange(index)}
          className="ml-auto w-5 h-5 cursor-pointer"
        />
      </div>
    ))}
  </div>
)}

          </div>

          {/* Render the submit button only if there are selected categories */}
          {categories.some((cat) => cat.checked) && (
            <CardFooter className="flex justify-start pt-2">
              <Button
                onClick={handleSubmitCategories}
                className="bg-black hover:bg-black/80 text-white"
                disabled={isAdding}
              >
                {isAdding ? "Ajout en cours..." : "Valider"}
              </Button>
            </CardFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
