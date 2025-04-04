"use client";

import type React from "react";
import { useChat } from "ai/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuoteGenerator from "./quote-generator";


export default function ChatModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientLocation, setClientLocation] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [lastProductMessageId, setLastProductMessageId] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, error, setMessages } =
    useChat({
      onError: (error) => {
        console.error("Chat error:", error);
        setErrorMessage(
          error.message ||
            "Une erreur s'est produite lors de la communication avec l'IA"
        );
      },
      onFinish: (message) => {
        if (message.content.includes("PRODUITS RECOMMANDÉS:")) {
          const products = parseRecommendedProducts(message.content);
          setRecommendedProducts(products.map((p) => ({ ...p, quantity: 1 })));
          setSelectedProducts([]);
          setLastProductMessageId(message.id);

          const clientInfoMatch = message.content.match(
            /Client: ([^,]+), ([^\n]+)/
          );
          if (clientInfoMatch) {
            setClientName(clientInfoMatch[1]);
            setClientLocation(clientInfoMatch[2]);
          }
        }

        if (input.toLowerCase().includes("genere le devis")) {
          if (selectedProducts.length === 0 && recommendedProducts.length > 0) {
            if (
              confirm(
                "Aucun produit sélectionné. Voulez-vous générer un devis avec tous les produits recommandés ?"
              )
            ) {
              setSelectedProducts(recommendedProducts);
            } else {
              return;
            }
          }
          setShowQuote(true);
        }
      },
    });

  // Extraction de l'ID de l'organisation depuis l'URL
  const getOrganisationId = () => {
    const url = window.location.href; // Récupère l'URL actuelle
    const regex = /contact\/([^/]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1]; // Retourne l'ID de l'organisation
    }
    return null; // Retourne null si l'ID n'est pas trouvé
  };

  // On récupère l'ID de l'organisation au démarrage
  useEffect(() => {
    const organisationId = getOrganisationId();
    if (organisationId) {
      console.log("Organisation ID:", organisationId);
      // Faire quelque chose avec l'ID de l'organisation si nécessaire
    }
  }, []); // Se déclenche une seule fois au montage du composant

  // Charger les produits depuis la base de données au démarrage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`/api/contacts?contactId=${getOrganisationId}`); // Utilisation de fetch() pour récupérer les produits
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }
        const products = await response.json();
        setRecommendedProducts(products); // Mise à jour des produits dans l'état
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };
  
    loadProducts(); // Appel de la fonction pour charger les produits au montage du composant
  }, []);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setMessages([]);
      setErrorMessage(null);
      setShowQuote(false);
      setClientName("");
      setClientLocation("");
      setSelectedProducts([]);
      setRecommendedProducts([]);
      setLastProductMessageId(null);
    }
  }, [open, setMessages]);

  // Check if we should clear products when new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.content.includes("PRODUITS RECOMMANDÉS:") && 
          lastMessage.id !== lastProductMessageId &&
          !lastMessage.content.toLowerCase().includes("genere le devis")) {
        setRecommendedProducts([]);
        setSelectedProducts([]);
      }
    }
  }, [messages, lastProductMessageId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Detect if this is a new request (contains "client" or different name)
    const isNewRequest = 
      input.toLowerCase().includes('client') || 
      (clientName && !input.includes(clientName)) ||
      /(nouveau|autre|différent)/i.test(input);

    if (isNewRequest) {
      setRecommendedProducts([]);
      setSelectedProducts([]);
      setLastProductMessageId(null);
    }

    originalHandleSubmit(e);
  };

  const parseRecommendedProducts = (content: string) => {
    const productSection = content.split("PRODUITS RECOMMANDÉS:")[1];
    if (!productSection) return [];

    const productLines = productSection
      .split("\n")
      .filter((line) => line.includes("|"));

    return productLines.map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      const priceText = parts[2].replace(/\D/g, "");
      return {
        name: parts[1],
        price: Number(priceText),
        category: parts[0],
        description: parts[3] || "",
      };
    });
  };

  const toggleProductSelection = (productName: string) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.name === productName);
      if (isSelected) {
        return prev.filter((p) => p.name !== productName);
      } else {
        const productToAdd = recommendedProducts.find(
          (p) => p.name === productName
        );
        return productToAdd
          ? [...prev, { ...productToAdd, quantity: 1 }]
          : prev;
      }
    });
  };

  const updateQuantity = (productName: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.name === productName
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  const shouldShowProducts = recommendedProducts.length > 0 && 
                           messages.some(m => m.id === lastProductMessageId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Assistant de génération des devis - HIGH TECH 241
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {errorMessage && (
            <div className="text-red-500 mt-2 p-2 bg-red-50 rounded border border-red-200">
              Error: {errorMessage}
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setErrorMessage(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}

          <div className="h-[50vh] overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-8">
                <p>Bienvenue dans l'assistant de devis HIGH TECH 241!</p>
                <p className="mt-2">Exemple de demande :</p>
                <p className="text-sm">
                  "Client Dupont de Libreville cherche un ordinateur portable
                  entre 300000 et 500000 XAF"
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${m.role === "user" ? "bg-[#7f1d1c] text-white mt-6" : "bg-gray-200 text-black"}`}
                  >
                    {m.content}
                  </span>
                </div>
              ))
            )}

            {shouldShowProducts && (
              <div className="mt-4 p-4 border rounded-lg bg-white">
                <h3 className="font-bold mb-2">Produits recommandés :</h3>
                <div className="space-y-4">
                  {recommendedProducts.map((product, index) => {
                    const isSelected = selectedProducts.some(
                      (p) => p.name === product.name
                    );
                    const selectedProduct = selectedProducts.find(
                      (p) => p.name === product.name
                    );

                    return (
                      <div key={index} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProductSelection(product.name)}
                          className="mr-2 mt-1 cursor-pointer w-4 h-4 border border-black rounded-full appearance-none checked:bg-black checked:border-black focus:outline-none focus:ring-0"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong>{product.name}</strong> -{" "}
                              {formatCurrency(product.price)}
                              <br />
                              <span className="text-sm text-gray-600">
                                {product.description}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      product.name,
                                      (selectedProduct?.quantity || 1) - 1
                                    )
                                  }
                                  disabled={
                                    (selectedProduct?.quantity || 1) <= 1
                                  }
                                >
                                  -
                                </Button>
                                <span className="mx-2 w-8 text-center">
                                  {selectedProduct?.quantity || 1}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      product.name,
                                      (selectedProduct?.quantity || 1) + 1
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm">
                    {selectedProducts.length} produit(s) sélectionné(s) |
                    Quantité totale:{" "}
                    {selectedProducts.reduce(
                      (sum, product) => sum + product.quantity,
                      0
                    )}
                  </span>
                  <Button
                    variant={"outline"}
                    className="bg-[#7f1d1c] text-white hover:text-white hover:bg-[#7f1d1c]"
                    onClick={() => setShowQuote(true)}
                    disabled={selectedProducts.length === 0}
                  >
                    Générer le devis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full space-x-2 mt-4">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Décrivez les besoins du client..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#7f1d1c] text-white hover:text-white hover:bg-[#7f1d1c]"
          >
            Envoyer
          </Button>
        </form>
      </DialogContent>
      {showQuote && selectedProducts.length > 0 && (
        <QuoteGenerator
          clientName={clientName}
          clientLocation={clientLocation}
          products={selectedProducts}
          onClose={() => setShowQuote(false)} organizationId={""}        />
      )}
    </Dialog>
  );
}
