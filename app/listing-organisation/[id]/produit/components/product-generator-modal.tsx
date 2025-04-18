"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductGeneratorForm } from "./product-generator-form";
import { ProductGenerationResult } from "./product-generation-result";
import { Loader2 } from "lucide-react";
import { ProductCategoriesSelector } from "./product-categories-selector";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { createProduct } from "./actions/createproduit";

export interface ProductData {
  name: string;
  price: string;
  description: string;
  categories: string[];
  images: string[];
  brand: string;
  brandName: string;
}

interface ProductGeneratorModalProps {
  isAI: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ProductGeneratorModal({
  isAI,
  isOpen,
  setIsOpen,
}: ProductGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [generatedProduct, setGeneratedProduct] = useState<ProductData | null>(null);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const pathname = usePathname();

  // Extraction de l'ID de l'organisation depuis l'URL
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

  // Fonction pour récupérer les images via l'API Google
  const fetchImages = async (productName: string): Promise<string[]> => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;
    const cx = process.env.NEXT_PUBLIC_IMAGE_CX;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      productName
    )}&key=${apiKey}&cx=${cx}&searchType=image&num=9`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.items ? data.items.map((item: any) => item.link) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
      return [];
    }
  };

  const handleGenerate = async (description: string) => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("API key is missing!");
  
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `Vous êtes un assistant IA expert en structuration de données produits.
  Je vous décris un produit. Vous devez générer un objet JSON qui inclut :
  {
    "Nom": "Nom du produit",
    "Description": "Brève présentation du produit",
    "Catégorie": "Type de produit",
    "Marque": "Marque du produit",
    "Prix": "Prix en FCFA"
  }
  
  Voici la description du produit : "${description}"`;
  
      const response = await model.generateContent(prompt);
  
      if (response?.response?.text) {
        const text = await response.response.text();
        console.log("AI Response:", text); // Log full response
  
        // Supprimer les backticks et toute autre mise en forme pour récupérer le JSON brut
        const cleanedText = text.replace(/```json\n|\n```/g, "").trim();
  
        // Vérification que la chaîne nettoyée est un JSON valide
        try {
          const parsed = JSON.parse(cleanedText);
  
          const { Nom, Description, Catégorie, Marque, Prix } = parsed;
  
          const productData: ProductData = {
            name: Nom,
            description: Description,
            categories: [Catégorie],
            brand: Marque,
            brandName: Marque,
            price: Prix.toString(), // Assurez-vous que le prix est une chaîne
            images: [],
          };
  
          const images = await fetchImages(productData.name);
  
          setGeneratedProduct({
            ...productData,
            images: images.length
              ? images
              : Array(9).fill("/placeholder.svg?height=80&width=80"),
          });
        } catch (error) {
          console.error("Erreur lors du parsing du JSON:", error);
        }
      }
    } catch (err) {
      console.error("Erreur pendant la génération :", err);
    } finally {
      setIsGenerating(false);
    }
  };
  

  // Mise à jour des catégories sélectionnées
  const handleCategorySelection = (categories: string[]) => {
    setSelectedCategories(categories);
    if (generatedProduct) {
      setGeneratedProduct((prev) => ({
        ...prev!,
        categories,
      }));
    }
  };

  // Fonction d'ajout du produit à la base de données
  const handleAddProduct = async (updatedProduct: ProductData) => {
    if (!organisationId) {
      console.error("Organisation ID is missing");
      return;
    }

    if (
      !updatedProduct.name ||
      !updatedProduct.description ||
      !updatedProduct.price ||
      !updatedProduct.categories.length ||
      !updatedProduct.images.length ||
      !updatedProduct.brandName // Use brandName here
    ) {
      console.error("Product data is incomplete");
      return;
    }

    setIsAdding(true);
    try {
      await createProduct({
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        categories: updatedProduct.categories,
        images: updatedProduct.images,
        brandName: updatedProduct.brandName, // Ensure you're passing brandName
        organisationId,
      });

      setIsOpen(false);
      setProductDescription("");
      setSelectedCategories([]);
      setGeneratedProduct(null);
    } catch (error) {
      console.error("Error while adding product:", error);
      toast.message("Une erreur est survenue lors de l’ajout du produit.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-7xl bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-black text-center">
            Génération de produit
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 relative">
          {(isGenerating || isAdding) && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                <Loader2 className="h-10 w-10 text-black animate-spin" />
                <p className="text-lg font-medium text-gray-700">
                  {isGenerating ? "Génération en cours..." : "Ajout en cours..."}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ProductGeneratorForm
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                productName={generatedProduct?.name || ""}
              />

              <ProductCategoriesSelector
                selectedCategories={selectedCategories}
                setSelectedCategories={handleCategorySelection}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Résultat</h2>
              {generatedProduct ? (
                <div className="space-y-6 animate-in fade-in-50 duration-300 max-h-[400px] overflow-y-auto">
                  <ProductGenerationResult
                    product={generatedProduct}
                    onUpdate={setGeneratedProduct}
                    onSave={handleAddProduct}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-10 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <p className="text-gray-400 text-center">
                    Décrivez  produit et cliquez sur "Générer" pour voir le
                    résultat ici.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
