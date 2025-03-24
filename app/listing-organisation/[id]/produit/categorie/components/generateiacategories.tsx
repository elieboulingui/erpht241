"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { createCategory } from "../action/CreatCategories";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";

export function Generateiacategorie({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const pathname = usePathname();

  // Extract Organisation ID from the URL
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

  // Fetch categories from the API using Google Generative AI
  const fetchCategories = async (domain: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      toast.error("❌ API key is missing!");
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        const limitedCategories = jsonResponse.categories.slice(0, 7);
        setCategories(limitedCategories.map((cat: string) => ({ name: cat, checked: false })));
      } else {
        toast.error("❌ Format JSON invalide.");
      }
    } catch (error) {
      toast.error("⚠️ Erreur lors de la requête AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle checkbox selection (toggle between checked and unchecked)
  const handleCheckboxChange = (index: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, i) =>
        i === index ? { ...category, checked: !category.checked } : category
      )
    );
  };

  // Submit selected categories to the server
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
        await createCategory({
          name: category.name,
          organisationId,
        });
      }

      toast.success("Catégories créées avec succès !");
      onClose(); // Close the dialog after successful submission
    } catch (error) {
      toast.error("Erreur lors de la création des catégories.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg p-4 rounded-lg z-50 max-h-[80vh] overflow-auto">
        <DialogHeader className="text-xl font-semibold">Générer des catégories</DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              className="pr-10 bg-white"
              placeholder="Entrez un domaine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isGenerating}
            />
            <Button
              onClick={() => fetchCategories(searchQuery)}
              className="bg-black hover:bg-black/80 text-white"
              disabled={isGenerating}
            >
              Générer les catégories
            </Button>
          </div>

          {isGenerating && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Génération en cours...</span>
            </div>
          )}

          {categories.length > 0 && !isGenerating && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between bg-white p-4 rounded-md border border-gray-300 cursor-pointer"
                  onClick={() => handleCheckboxChange(index)}
                >
                  <span>{category.name}</span>
                  <input
                    type="checkbox"
                    checked={category.checked}
                    onChange={(e) => e.stopPropagation()}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          {categories.some((cat) => cat.checked) && (
            <Button
              onClick={handleSubmitCategories}
              className="bg-black w-full hover:bg-black/80 text-white"
              disabled={isAdding}
            >
              {isAdding ? "Ajout en cours..." : "Valider"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
