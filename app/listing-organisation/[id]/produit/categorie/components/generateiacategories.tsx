import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { createSubCategory } from "../action/CreateSubCategories";  // Import the createSubCategory function
import { getCategoriesByOrganisationId } from "../action/getCategoriesByOrganisationId";  // Import the getCategoriesByOrganisationId function

export function Generateiacategorie() {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [domain, setDomain] = useState(""); // Domaine d'activité
  const [categories, setCategories] = useState<{ name: string; checked: boolean }[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [existingCategories, setExistingCategories] = useState<any[]>([]); // To hold existing categories
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // For selecting an existing category

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
        fetchExistingCategories(id); // Fetch existing categories when the organisation ID is found
      } else {
        toast.error("Organisation ID not found in the URL.");
      }
    }
  }, [pathname]);

  // Fetch existing categories for the organisation
  const fetchExistingCategories = async (organisationId: string) => {
    try {
      const fetchedCategories = await getCategoriesByOrganisationId(organisationId);
      setExistingCategories(fetchedCategories); // Set the existing categories
    } catch (error) {
      toast.error("Erreur lors de la récupération des catégories existantes.");
    }
  };

  // Appel à l'IA pour générer les catégories liées à un domaine donné
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
      Répondez uniquement avec un JSON valide contenant une clé "categories" avec un tableau de catégories.

      Domaine: "${domain}"

      Réponse attendue :
      {
        "categories": ["Catégorie 1", "Catégorie 2", "Catégorie 3"]
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
        setCategories(jsonResponse.categories.map((cat: string) => ({ name: cat, checked: false })));
        setDomain(domain);  // Set the domain as entered if categories are generated
      } else {
        toast.error("❌ Format JSON invalide :", jsonResponse);
      }
    } catch (error) {
      toast.error("⚠️ Erreur lors de la requête AI:");
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

  // Soumettre les catégories sélectionnées ou la nouvelle catégorie
  const handleSubmitCategories = async () => {
    if (!organisationId) {
      toast.error("Impossible de récupérer l'ID de l'organisation.");
      return;
    }

    setIsAdding(true);

    try {
      // Si aucune catégorie n'est sélectionnée dans le menu déroulant
      if (!selectedCategoryId) {
        // Créer une nouvelle catégorie principale
        for (const category of categories.filter((cat) => cat.checked)) {
          await createSubCategory({
            name: category.name,
            organisationId,
            parentId: "", // Pas de parent pour cette catégorie
          });
        }
        toast.success("Catégorie(s) principale(s) créée(s) avec succès !");
      } else {
        // Créer des sous-catégories pour les catégories sélectionnées
        for (const category of categories.filter((cat) => cat.checked)) {
          await createSubCategory({
            name: category.name,
            organisationId,
            parentId: selectedCategoryId, // Utiliser la catégorie sélectionnée comme parent
          });
        }
        toast.success("Sous-catégories créées avec succès !");
      }

      // Réinitialiser les champs après la soumission
      setCategories([]); // Clear categories after successful submission
      setSelectedCategoryId(null); // Clear selected category
      setOpen(false);  // Close the dialog
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
        Générer des catégories
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`bg-white shadow-xl border-0 p-6 overflow-hidden max-w-4xl rounded-xl 
            ${isGenerating || categories.length > 0 ? 'max-h-[80vh]' : 'w-96'} 
            min-h-[40vh] transition-all duration-500 ease-in-out`}
        >
          <DialogHeader className="text-center font-semibold text-lg">Création des catégories</DialogHeader>

          <div className={`flex gap-8 ${isGenerating ? 'grid grid-cols-2' : ''}`}>
            {/* Section Domaine d'activité à gauche */}
            <div className="flex flex-col w-full">
              <label
                htmlFor="domain"
                className="block text-lg font-semibold mb-2 text-center"
              >
                Domaine d'activité
              </label>
              <div
                className={`overflow-y-auto ${isGenerating ? "mt-8" : ""}`}
              >
                <Input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={handleDomainChange}
                  className="w-full p-3 border rounded-md text-center"
                  placeholder="Entrez un domaine d'activité..."
                  disabled={isGenerating} // Disable input when generating
                />
                <Button
                  onClick={() => fetchCategories(domain)}
                  className="mt-4 w-full bg-black hover:bg-black text-white"
                  disabled={isGenerating} // Disable button during generation
                >
                  Générer les catégories
                </Button>
              </div>
            </div>

            {/* Section Catégories générées à droite */}
            {categories.length > 0 && !isGenerating && (
              <div className="flex flex-col max-h-[60vh] w-full bg-gray-50 rounded-lg p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-3 text-center">Catégories générées</h2>
                <div className="flex flex-col gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-md">
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

                {/* Sélection de la catégorie parente */}
                <div className="mt-4">
                  <label htmlFor="selectCategory" className="block text-sm font-medium">Sélectionner une catégorie parente (optionnel)</label>
                  <select
                    id="selectCategory"
                    value={selectedCategoryId || ""}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full p-3 mt-2 border rounded-md"
                  >
                    <option value="">Sélectionner une catégorie existante</option>
                    {existingCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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

          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                <Loader2 className="h-10 w-10 text-black animate-spin" />
                <p className="text-lg font-medium text-gray-700">Génération en cours...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
