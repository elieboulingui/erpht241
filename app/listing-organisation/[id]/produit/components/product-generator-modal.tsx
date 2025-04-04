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
import { createProduct } from "./actions/createproduit";
import { toast } from "sonner";

export interface ProductData {
  name: string;
  price: string;
  description: string;
  categories: string[];
  images: string[];
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
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [productDescription, setProductDescription] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [generatedProduct, setGeneratedProduct] = useState<ProductData | null>(
    null
  );
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const pathname = usePathname();

  // Extract organisation ID from URL
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

  // Fetch images based on product name
  const fetchImages = async (productName: string): Promise<string[]> => {
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;
    const cx = process.env.NEXT_PUBLIC_IMAGE_CX;
    const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(productName)}&key=${apiKey}&cx=${cx}&searchType=image&num=9`;

    try {
      const response = await fetch(imageSearchUrl);
      const data = await response.json();
      return data.items ? data.items.map((item: any) => item.link) : [];
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  // Handle AI product generation
  const handleGenerate = async (description: string) => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("API key is missing!");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const structuredPrompt = `Vous êtes un assistant IA expert en structuration de données produits.
        Je vous décris un produit. Vous devez générer un objet JSON qui inclut les informations suivantes :
        1. Le nom complet du produit (exemple : "iPhone 13")
        2. La description complète du produit (exemple : "Le dernier modèle de téléphone d'Apple.")
        3. La catégorie du produit (exemple : "Smartphone")
        4. Le prix en FCFA (exemple : "500000 FCFA")

        Voici la description du produit : "${description}"

        Format attendu :
        {
          "Nom": "Nom du produit",
          "Description": "Brève présentation du produit",
          "Catégorie": "Type de produit",
          "Prix": "Prix en FCFA"
        }`;

      const response = await model.generateContent(structuredPrompt);

      if (response?.response?.text) {
        const text = await response.response.text();
        const regex =
          /"Nom": "(.*?)",\s*"Description": "(.*?)",\s*"Catégorie": "(.*?)",\s*"Prix": "(.*?)"/;
        const match = text.match(regex);

        if (match) {
          const [, name, description, category, price] = match;

          const productData: ProductData = {
            name: name || "Nom du produit",
            description: description || "Brève présentation du produit",
            categories: category ? [category] : ["Non catégorisé"],
            price: price || "Prix en FCFA",
            images: [],
          };

          const images = await fetchImages(productData.name);

          setGeneratedProduct({
            ...productData,
            images: images.length
              ? images
              : Array(9).fill("/placeholder.svg?height=80&width=80"),
          });
        } else {
          console.error("No valid JSON found in AI response.");
        }
      }
    } catch (error) {
      console.error("Error generating product:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle category selection
  const handleCategorySelection = (categories: string[]) => {
    setSelectedCategories(categories);

    if (generatedProduct) {
      if (categories.length > 0) {
        setGeneratedProduct((prevProduct) => ({
          ...prevProduct!,
          categories: categories,
        }));
      }
    }
  };

  // Handle adding the generated product
  const handleAddProduct = async (updatedProduct: ProductData) => {
    if (!organisationId) {
      console.error("Organisation ID is missing");
      return;
    }

    if (
      !updatedProduct.name ||
      !updatedProduct.description ||
      !updatedProduct.price ||
      !updatedProduct.categories ||
      !updatedProduct.images
    ) {
      console.error("Generated product data is incomplete or missing!");
      return;
    }

    if (!updatedProduct.categories.length) {
      console.error("No categories selected for the product");
      return;
    }

    setIsAdding(true);
    try {
      const productData = {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        categories: updatedProduct.categories,
        images: updatedProduct.images,
        organisationId: organisationId,
      };

      await createProduct(productData);

      setIsOpen(false); // Use setIsOpen prop to close modal
      setIsAdding(false);
      setProductDescription("");
      setSelectedCategories([]);
      setGeneratedProduct(null);
    } catch (error) {
      console.error("Error adding product:", error);
      setIsAdding(false);
      toast.message(
        "An error occurred while adding the product. Please try again."
      );
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

        <div className="p-6">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                <Loader2 className="h-10 w-10 text-black animate-spin" />
                <p className="text-lg font-medium text-gray-700">
                  Génération en cours...
                </p>
              </div>
            </div>
          )}

          {isAdding && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
                <Loader2 className="h-10 w-10 text-black animate-spin" />
                <p className="text-lg font-medium text-gray-700">
                  Ajout en cours...
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
                    onUpdate={(updatedProduct) =>
                      setGeneratedProduct(updatedProduct)
                    }
                    onSave={handleAddProduct}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-10 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <p className="text-gray-400 text-center">
                    Décrivez votre produit et cliquez sur "Générer" pour voir le
                    résultat ici
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