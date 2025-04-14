import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { createmarque } from "../action/createmarque";

export function CategoryGenerator({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [domain, setDomain] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [organisationId, setOrganisationId] = useState<string | null>(null);

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
      onClose(); // Close the dialog on success
    } catch (error) {
      toast.error("Erreur lors de l'ajout des catégories.");
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <h2 className="text-xl font-semibold">Générer des marques</h2>
        <p className="text-sm">Entrez un domaine pour générer des marques</p>
      </DialogHeader>

      <div className="space-y-4">
  {/* Input for domain */}
  <div className="flex items-center space-x-4">
    <Input
      className="pr-10 focus:outline-none focus:ring-0 border-2 border-gray-300 rounded-md"
      placeholder="Entrez une marque"
      value={domain}
      onChange={(e) => setDomain(e.target.value)}
      disabled={isGenerating}
    />
    <Button
      onClick={() => fetchCategories(domain)}
      className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white"
      disabled={isGenerating || domain.trim() === ""} // Disable if domain is empty or just spaces
    >
      {isGenerating ? "Génération en cours..." : "Générer"}
    </Button>
  </div>



        {/* Categories list */}
        {categories.length > 0 && (
          <div className="flex gap-4 flex-wrap mt-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white p-3 rounded-md border border-gray-300 cursor-pointer"
                onClick={() => handleSelectChange(index)}
              >
                <span>{category.name}</span>
                <Checkbox
                  checked={category.checked}
                  onChange={() => handleSelectChange(index)}
                  className="mr-3"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {categories.some((cat) => cat.checked) && (
        <DialogFooter className="flex justify-start pt-2">
          <Button
            onClick={handleSubmitCategories}
            className="w-full bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white"
            disabled={categories.every((cat) => !cat.checked)}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      )}
    </DialogContent>
  );
}
