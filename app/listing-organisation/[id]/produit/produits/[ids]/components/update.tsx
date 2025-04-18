"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductGeneratorForm } from "./product-generator-form";
import { ProductGenerationResult } from "./product-generation-result";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProductCategoriesSelector } from "./product-categories-selector";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { usePathname } from "next/navigation";
import { createProduct } from "./actions/createproduit";
import { ProductGeneratorForms } from "./updatebtn";

export interface ProductData {
  id?: string;
  name: string;
  price: string;
  description: string;
  categories: string[];
  images: string[];
  brandName?: string;
}

export function ProductGeneratorModalupade() {
  const [open, setOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [generatedProduct, setGeneratedProduct] = useState<ProductData | null>(null);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [productName, setProductName] = useState<string>("");
  const [productId, setProductId] = useState<string | null>(null);

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

  const handleGenerate = async (description: string) => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) throw new Error("API key is missing!");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const structuredPrompt = `
        Vous êtes un assistant IA expert en structuration de données produits.
        Je vous décris un produit. Vous devez générer un objet JSON qui inclut les informations suivantes :
        1. Le nom complet du produit (exemple : "iPhone 13")
        2. La description complète du produit (exemple : "Le dernier modèle de téléphone d'Apple.")
        3. La catégorie du produit (exemple : "Smartphone")
        4. Le prix en FCFA (exemple : "500000 FCFA")
        5. Le nom de la marque du produit (exemple : "Apple")

        Voici la description du produit : "${description}"

        Format attendu :
        {
          "Nom": "Nom du produit",
          "Description": "Brève présentation du produit",
          "Catégorie": "Type de produit",
          "Prix": "Prix en FCFA",
          "Marque": "Nom de la marque"
        }
      `;

      const response = await model.generateContent(structuredPrompt);

      if (response?.response?.text) {
        const text = await response.response.text();
        const regex = /"Nom": "(.*?)",\s*"Description": "(.*?)",\s*"Catégorie": "(.*?)",\s*"Prix": "(.*?)",\s*"Marque": "(.*?)"/;
        const match = text.match(regex);

        if (match) {
          const [, name, description, category, price, brandName] = match;

          const productData: ProductData = {
            name: name || "Nom du produit",
            description: description || "Brève présentation du produit",
            categories: category ? [category] : ["Non catégorisé"],
            price: price || "Prix en FCFA",
            brandName: brandName || "Marque inconnue",
            images: [],
            id: Math.random().toString(36).substring(2),
          };

          const images = await fetchImages(productData.name);

          setGeneratedProduct({
            ...productData,
            images: images.length ? images : Array(9).fill("/placeholder.svg?height=80&width=80"),
          });

          setProductName(name);
          setProductId(productData.id as any);
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

  const handleCategorySelection = (categories: string[]) => {
    setSelectedCategories(categories);
    if (generatedProduct) {
      setGeneratedProduct(prevProduct => ({
        ...prevProduct!,
        categories: categories,
      }));
    }
  };

  const handleAddProduct = async (updatedProduct: ProductData) => {
    if (!organisationId) {
      console.error("Organisation ID is missing");
      return;
    }

    if (!updatedProduct.name || !updatedProduct.description || !updatedProduct.price || !updatedProduct.categories || !updatedProduct.images) {
      console.error("Generated product data is incomplete or missing!");
      return;
    }

    if (!updatedProduct.categories.length) {
      console.error("No categories selected for the product");
      return;
    }

    if (!updatedProduct.brandName) {
      console.error("Brand name is missing");
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
        productId: updatedProduct.id,
        brandName: updatedProduct.brandName,
      };

      await createProduct(productData);

      setOpen(false);
      setIsAdding(false);
      setProductDescription("");
      setSelectedCategories([]);
      setGeneratedProduct(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Une erreur est survenue lors de l'ajout du produit. Veuillez réessayer.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-black text-center">
            Mettre à jour le produit
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
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
              <ProductGeneratorForms
                productName={productName}
                productDescription={productDescription}
                setProductDescription={setProductDescription}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              <ProductCategoriesSelector
                selectedCategories={selectedCategories}
                setSelectedCategories={handleCategorySelection}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">Résultat</h2>
              {generatedProduct ? (
                <div className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
                  <ProductGenerationResult
                    product={generatedProduct}
                    onUpdate={(updatedProduct) => setGeneratedProduct(updatedProduct)} 
                    onSave={handleAddProduct} 
                  />
                </div>
              ) : (
                <div className="p-4 bg-gray-100 border rounded-lg shadow-sm">Aucun produit généré</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
