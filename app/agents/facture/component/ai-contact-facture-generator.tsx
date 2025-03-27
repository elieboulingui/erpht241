"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Sparkles,
  Plus,
  Minus,
  ShoppingCart,
  X,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FactureForm from "./facture-form";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface FactureData {
  client: {
    name: string;
    email: string;
    address: string;
  };
  paymentMethod: string;
  sendLater: boolean;
  terms: string;
  creationDate: string;
  dueDate: string;
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    total: number;
  }>;
  totalAmount: number;
}

const AVAILABLE_PRODUCTS: Omit<Product, "quantity">[] = [
  { id: 1, name: "Ordinateur portable HP", price: 450000 },
  { id: 2, name: "Ordinateur portable Dell", price: 500000 },
  { id: 3, name: "PC Bureau Gaming", price: 650000 },
  { id: 4, name: "Imprimante HP LaserJet", price: 250000 },
  { id: 5, name: "Imprimante Epson Multifonction", price: 300000 },
  { id: 6, name: "Chargeur USB-C 65W", price: 15000 },
  { id: 7, name: "Chargeur sans fil Qi", price: 25000 },
  { id: 8, name: "Souris sans fil Logitech", price: 20000 },
  { id: 9, name: "Souris Gaming RGB", price: 35000 },
  { id: 10, name: "Clavier mécanique", price: 40000 },
  { id: 11, name: 'Écran 24" Full HD', price: 180000 },
  { id: 12, name: "Disque dur externe 1To", price: 60000 },
  { id: 13, name: "SSD 500Go", price: 50000 },
  { id: 14, name: "Casque Bluetooth", price: 35000 },
  { id: 15, name: "Webcam HD", price: 45000 },
  { id: 16, name: "Câble HDMI 2.0", price: 8000 },
  { id: 17, name: "Onduleur 1000VA", price: 90000 },
  { id: 18, name: 'Tablette Android 10"', price: 150000 },
  { id: 19, name: "Carte mémoire 128Go", price: 25000 },
  { id: 20, name: "Adaptateur USB-C vers HDMI", price: 12000 },
];

interface FactureAIGeneratorProps {
  organisationId: string;
  contactSlug: string;
  onSaveSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveFacture: (facture: any) => void;
}

export default function FactureAIGenerator({
  organisationId,
  contactSlug,
  onSaveSuccess,
  open,
  onOpenChange,
  onSaveFacture,
}: FactureAIGeneratorProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [factureData, setFactureData] = useState<FactureData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const resetModal = () => {
    setPrompt("");
    setIsGenerating(false);
    setIsSaving(false);
    setFactureData(null);
    setError(null);
    setSelectedProducts([]);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetModal();
  };

  const handleAddProduct = (product: Omit<Product, "quantity">) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    const existingProduct = selectedProducts.find((p) => p.id === productId);

    if (existingProduct && existingProduct.quantity > 1) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    }
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    } else {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === productId ? { ...p, quantity } : p
        )
      );
    }
  };

  const generateFacture = async () => {
    if (selectedProducts.length === 0) {
      setError("Veuillez sélectionner au moins un produit");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 30);

      const factureProducts = selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        discount: 0,
        tax: 0,
        total: product.price * product.quantity
      }));

      const totalAmount = factureProducts.reduce((sum, product) => sum + product.total, 0);

      const mockData: FactureData = {
        client: {
          name: "Aymard Steve",
          email: "",
          address: "Libreville, Akanda rue Sherco",
        },
        paymentMethod: "carte",
        sendLater: false,
        terms: "",
        creationDate: today.toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
        products: factureProducts,
        totalAmount
      };

      setFactureData(mockData);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur s'est produite lors de la génération de la facture");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFacture = async (factureData: FactureData) => {
    setIsSaving(true);

    try {
      const factureId = `facture_${Date.now()}`;
      
      const completeFactureData = {
        ...factureData,
        id: factureId,
        status: "Validé",
        products: factureData.products.map((p) => ({
          ...p,
          total: p.price * p.quantity
        })),
        totalAmount: factureData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
      };

      localStorage.setItem(factureId, JSON.stringify(completeFactureData));
      onSaveFacture(completeFactureData);

      toast.success("Facture créée avec succès", {
        position: "bottom-right",
        icon: <CheckCircle className="text-[#7f1d1c] animate-bounce" />,
      });

      onOpenChange(false);
      resetModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde de la facture");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetModal();
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((total, product) => total + product.quantity, 0);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Créer une nouvelle facture</DialogTitle>
          <DialogDescription className="text-gray-600">
            Sélectionnez les produits et services à inclure dans la facture
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!factureData ? (
            <Card className="p-6 border border-gray-200 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border-r pr-4">
                  <h3 className="font-medium mb-4">Produits disponibles</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {AVAILABLE_PRODUCTS.map((product) => (
                      <div key={product.id} className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 p-1 rounded">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.price.toLocaleString("fr-FR")} FCFA
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddProduct(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Produits sélectionnés</h3>
                      <div className="flex items-center text-sm bg-red-50 text-red-800 px-2 py-1 rounded">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {getTotalItems()} article(s)
                      </div>
                    </div>

                    {selectedProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 border border-dashed rounded-md hover:bg-gray-50">
                        Aucun produit sélectionné
                      </div>
                    ) : (
                      <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2">
                        {selectedProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between bg-gray-50 p-2 rounded hover:bg-gray-100">
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {product.price.toLocaleString("fr-FR")} FCFA
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveProduct(product.id)}
                                className="h-7 w-7 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => updateProductQuantity(product.id, Number(e.target.value))}
                                className="w-16 h-8 text-center"
                                min="1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddProduct(product)}
                                className="h-7 w-7 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt" className="text-base font-medium">
                        Informations client (optionnel)
                      </Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ex: Facture pour le client Aymard Steve à Libreville"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 h-24"
                      />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                      onClick={generateFacture}
                      disabled={isGenerating || selectedProducts.length === 0}
                      className="w-full bg-gradient-to-r from-red-800 to-red-600 text-white hover:from-red-700 hover:to-red-500"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          <span className="font-medium">Générer la facture</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Facture générée</h2>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    <X className="h-4 w-4 mr-2" />
                    Remettre à zéro
                  </Button>
                </div>
              </div>
              <FactureForm initialData={factureData} onSave={handleSaveFacture} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}