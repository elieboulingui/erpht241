import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProductGeneratorFormProps {
  productName: string;
  setProductName: (name: string) => void;
  productDescription: string;
  setProductDescription: (description: string) => void;
  onGenerate: (description: string) => void;
  isGenerating: boolean;
}

export const ProductGeneratorForms: React.FC<ProductGeneratorFormProps> = ({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  onGenerate,
  isGenerating,
}) => {
  const [loading, setLoading] = useState(true); // State to track the loading process
  const [localStorageProductName, setLocalStorageProductName] = useState<string | null>(null);

  useEffect(() => {
    const storedProductName = localStorage.getItem("selectedProductName");
    if (storedProductName) {
      setLocalStorageProductName(storedProductName); // Update localStorageProductName state
      setProductName(storedProductName); // Set the product name if it exists in localStorage
    }

    // Simulate loading process until the product name is fetched
    const timeout = setTimeout(() => setLoading(false), 500); // Simulate a delay for fetching data

    return () => clearTimeout(timeout);
  }, [setProductName]);

  // Disable the form until loading is complete and productName is set
  const isFormDisabled = loading || !productName || !productDescription.trim();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-xl font-semibold">Chargement...</div>
        {/* Or use a loading spinner */}
        {/* <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-200"></div> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
   

      <div className="relative flex-1">
        <Input
          placeholder="Décrivez le produit à générer..."
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)} // Update the productDescription state
          className="pr-4 rounded-xl h-12 border-2 border-gray-200 focus:border-transparent focus:ring-2 focus:ring-transparent transition-all duration-200 shadow-sm"
        />
      </div>

      <Button
        onClick={() => onGenerate(productDescription)}
        disabled={isFormDisabled || isGenerating}
        className="bg-black hover:bg-black text-white rounded-xl text-lg font-bold h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200 min-w-[120px]"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Générer
      </Button>
    </div>
  );
};
