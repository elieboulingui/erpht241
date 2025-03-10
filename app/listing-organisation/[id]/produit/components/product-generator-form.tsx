import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import React from 'react';

interface ProductGeneratorFormProps {
  productName: string; // Add productName prop
  productDescription: string;
  setProductDescription: (description: string) => void;
  onGenerate: (description: string) => void;
  isGenerating: boolean;
}

export const ProductGeneratorForm: React.FC<ProductGeneratorFormProps> = ({
  productName,
  productDescription,
  setProductDescription,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        {/* Display the selected product name */}
        {productName && (
          <p className="text-lg font-semibold mb-2">Produit sélectionné : {productName}</p>
        )}
        <Input
          placeholder="Décrivez le produit à générer..."
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          className="pr-4 rounded-xl h-12 border-2 border-gray-200 focus:border-tranparent focus:ring-2 focus:ring-transparent transition-all duration-200 shadow-sm"
        />
      </div>
      <Button
        onClick={() => onGenerate(productDescription)}
        disabled={isGenerating || !productDescription.trim()}
        className="bg-black hover:bg-black text-white rounded-xl text-lg font-bold h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200 min-w-[120px]"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Générer
      </Button>
    </div>
  );
};
