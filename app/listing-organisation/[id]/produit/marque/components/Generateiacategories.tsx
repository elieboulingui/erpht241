"use client";
import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createmarque } from "../action/createmarque";

export function CategoryGenerator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [domain, setDomain] = useState(""); // Domaine d'activité
  const [selectAll, setSelectAll] = useState(false);
  const [organisationId, setOrganisationId] = useState<string | null>(null); // ID de l'organisation
  const [isOpen, setIsOpen] = useState(false); // Pour contrôler l'ouverture du dialogue

  useEffect(() => {
    const extractOrganisationId = () => {
      const pathname = window.location.pathname;
      const regex = /listing-organisation\/([a-zA-Z0-9]+)/;
      const match = pathname.match(regex);
      return match ? match[1] : null;
    };

    const id = extractOrganisationId();
    setOrganisationId(id);
  }, []);

  const fetchCategories = async (domain: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      toast.error("❌ API key is missing!");
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const structuredPrompt = `
      Vous êtes un assistant IA qui génère une liste de marques liées à un domaine donné.
      Exemple de réponse attendue : 
      {
        "categories": ["Marque 1", "Marque 2", "Marque 3"]
      }

      marque: "${domain}"
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
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(cleanedText);
      } catch (error) {
        toast.error("❌ Format JSON invalide.");
        return;
      }

      if (!jsonResponse?.categories || !Array.isArray(jsonResponse.categories)) {
        toast.error("❌ Réponse invalide : La réponse n'inclut pas un tableau de marques.");
        return;
      }

      const limitedCategories = jsonResponse.categories.slice(0, 7);
      setCategories(limitedCategories.map((cat: string) => ({ name: cat, checked: false })));
    } catch (error) {
      toast.error("⚠️ Erreur lors de la requête AI:");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectChange = (index: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category, i) =>
        i === index ? { ...category, checked: !category.checked } : category
      )
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({ ...category, checked: !selectAll }))
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
      const promises = selectedCategories.map((category) =>
        createmarque({
          name: category.name,
          organisationId,
        })
      );

      await Promise.all(promises);

      toast.success("Catégories créées avec succès !");
      setCategories([]);
      setIsOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout des catégories.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-white text-black hover:bg-white font-medium px-6 py-2.5" disabled={isGenerating}>
            <Sparkles className="mr-2 h-4 w-4" />
            Ouvrir le générateur de marque
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-lg p-6 rounded-lg z-50 max-h-[80vh] overflow-auto">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Générer des marques</h2>
            <p className="text-sm">Entrez un domaine pour générer des marques</p>
          </DialogHeader>

          <div className="space-y-4">
            {/* Input and Button in flex layout */}
            <div className="flex items-center space-x-4">
              <Input
                className="pr-10 focus:outline-none focus:ring-0 border-2 border-gray-300 rounded-md"
                placeholder="Entrez un domaine"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isGenerating}
              />
              <Button
                onClick={() => fetchCategories(domain)}
                className="bg-black text-white hover:bg-black/80"
                disabled={isGenerating}
              >
                {isGenerating ? "Génération en cours..." : "Générer des marques"}
              </Button>
            </div>

           

            {categories.length > 0 && (
              <div className="flex gap-4 flex-wrap mt-6">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white p-3 rounded-md border border-gray-300 cursor-pointer"
                    onClick={() => handleSelectChange(index)} // Clic sur la carte
                  >
                   
                    <span>{category.name}</span>
                    <Checkbox
                      checked={category.checked}
                      onChange={() => handleSelectChange(index)} // Clic sur la case à cocher
                      className="mr-3"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {categories.length > 0 && categories.some((cat) => cat.checked) && (
            <DialogFooter className="flex justify-start pt-2">
              <Button
                onClick={handleSubmitCategories}
                className="w-full bg-black hover:bg-black/80 text-white"
                disabled={isAdding || categories.every((cat) => !cat.checked)}
              >
                {isAdding ? "Ajout en cours..." : "Ajouter les marques"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
