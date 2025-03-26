"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Send, Printer } from "lucide-react";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface DevisFormProps {
  initialData: {
    client: {
      name: string;
      email: string;
      address: string;
    };
    paymentMethod: string;
    sendLater: boolean;
    terms: string;
    products: Array<{
      id: number;
      name: string;
      quantity: number;
      price: number;
      discount: number;
      tax: number;
    }>;
  };
  onSave: (data: any) => void;
}

export default function DevisForm({ initialData, onSave }: DevisFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [client, setClient] = useState({
    name: initialData.client.name || "",
    email: initialData.client.email || "",
    address: initialData.client.address || "",
  });

  const [sendLater, setSendLater] = useState(initialData.sendLater || false);
  const [paymentMethod, setPaymentMethod] = useState(
    initialData.paymentMethod || "carte"
  );
  const [creationDate, setCreationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [terms, setTerms] = useState(initialData.terms || "");

  const [products, setProducts] = useState<Product[]>(() => {
    return initialData.products.map((product) => ({
      ...product,
      total: calculateProductTotal(product),
    }));
  });

  const [searchProduct, setSearchProduct] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");

  function calculateProductTotal(product: any): number {
    const subtotal = product.quantity * product.price;
    const discountAmount = subtotal * (product.discount / 100);
    const taxAmount = (subtotal - discountAmount) * (product.tax / 100);
    return subtotal - discountAmount + taxAmount;
  }

  const updateProduct = (
    id: number,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const updatedProduct = {
            ...product,
            [field]:
              typeof value === "string" && field !== "name"
                ? Number.parseFloat(value as string) || 0
                : value,
          };
          updatedProduct.total = calculateProductTotal(updatedProduct);
          return updatedProduct;
        }
        return product;
      })
    );
  };

  const addProductLine = () => {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    setProducts([
      ...products,
      {
        id: newId,
        name: "",
        quantity: 0,
        price: 0,
        discount: 0,
        tax: 0,
        total: 0,
      },
    ]);
  };

  const removeProductLine = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const clearAllLines = () => {
    setProducts([
      { id: 1, name: "", quantity: 0, price: 0, discount: 0, tax: 0, total: 0 },
    ]);
  };

  const addProduct = () => {
    if (searchProduct.trim() && searchQuantity.trim()) {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      const newProduct = {
        id: newId,
        name: searchProduct,
        quantity: Number.parseInt(searchQuantity) || 1,
        price: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };
      setProducts([...products, newProduct]);
      setSearchProduct("");
      setSearchQuantity("");
    }
  };

  const getTotalAmount = () => {
    return products.reduce((sum, product) => sum + product.total, 0);
  };

  const handlePreview = () => {
    alert("Prévisualisation du devis");
  };

  const handleSave = () => {
    setIsSaving(true);
    
    const devisData = {
      client,
      paymentMethod,
      sendLater,
      terms,
      creationDate,
      dueDate,
      products,
      totalAmount: getTotalAmount(),
    };
    
    // Simule un délai pour le chargement (remplacez par votre appel API réel)
    setTimeout(() => {
      onSave(devisData);
      setIsSaving(false);
    }, 1000);
  };

  const handleSaveAndSend = () => {
    const devisData = {
      client,
      paymentMethod,
      sendLater,
      terms,
      creationDate,
      dueDate,
      products,
      totalAmount: getTotalAmount(),
    };
    
    onSave(devisData);
    alert("Devis sauvegardé et envoyé");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-end mb-6">
        <div className="text-right text-[#7f1d1c] text-3xl font-bold mb-2">
          Solde à payer
          <div className="text-3xl font-bold text-black">
            {getTotalAmount().toLocaleString("fr-FR")} Fcfa
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Label htmlFor="client" className="text-sm font-medium">
                Client
              </Label>
              <div className="ml-1 text-gray-400">ⓘ</div>
            </div>
            <Input
              id="client"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="address" className="text-sm font-medium">
              Adresse
            </Label>
            <Input
              id="address"
              value={client.address}
              onChange={(e) =>
                setClient({ ...client, address: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Client
              </Label>
              <div className="ml-1 text-gray-400">ⓘ</div>
            </div>
            <Input
              id="email"
              type="email"
              value={client.email}
              onChange={(e) => setClient({ ...client, email: e.target.value })}
              className="w-full"
              placeholder="Facultatif"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <Checkbox
                id="sendLater"
                checked={sendLater}
                onCheckedChange={(checked) => setSendLater(checked as boolean)}
              />
              <Label htmlFor="sendLater" className="ml-2 text-sm">
                Envoyer plutard
              </Label>
            </div>
          </div>

          <div className="mb-4">
            <Label className="text-sm font-medium">Paiement</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex flex-col space-y-1 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="carte" id="carte" />
                <Label htmlFor="carte" className="text-sm">
                  Carte
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfert" id="transfert" />
                <Label htmlFor="transfert" className="text-sm">
                  Transfert bancaire
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="text-sm">
                  Cash
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Label htmlFor="termes" className="text-sm font-medium">
                Termes
              </Label>
              <div className="ml-1 text-gray-400">ⓘ</div>
            </div>
            <select
              id="termes"
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            >
              <option value="">Sélectionner</option>
              <option value="net15">Net 15</option>
              <option value="net30">Net 30</option>
              <option value="net45">Net 45</option>
              <option value="net60">Net 60</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="creationDate" className="text-sm font-medium">
              Date de création
            </Label>
            <Input
              id="creationDate"
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Date d'échéance
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-sm font-medium">Rechercher un produit</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            placeholder="Rechercher"
            className="flex-1"
          />
          <Input
            type="number"
            value={searchQuantity}
            onChange={(e) => setSearchQuantity(e.target.value)}
            placeholder="Quantité"
            className="w-32"
          />
          <Button
            onClick={addProduct}
            className="bg-red-800 hover:bg-red-700 text-white"
          >
            Ajouter produit
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm">
              <th className="py-2 px-2 w-10">#</th>
              <th className="py-2 px-2">
                Nom Produit <span className="text-gray-400">ⓘ</span>
              </th>
              <th className="py-2 px-2">Quantité</th>
              <th className="py-2 px-2">Prix</th>
              <th className="py-2 px-2">Réduction</th>
              <th className="py-2 px-2">Taxe</th>
              <th className="py-2 px-2">Total</th>
              <th className="py-2 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2 px-2">{product.id}</td>
                <td className="py-2 px-2">
                  <Input
                    value={product.name}
                    onChange={(e) =>
                      updateProduct(product.id, "name", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.quantity || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "quantity", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.price || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "price", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.discount || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "discount", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.tax || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "tax", e.target.value)
                    }
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.total || ""}
                    readOnly
                    className="w-full bg-gray-50"
                  />
                </td>
                <td className="py-2 px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProductLine(product.id)}
                    className="h-8 w-8 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={addProductLine}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Ajouter une ligne
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllLines}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" /> Effacer tous les lignes
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Ajouter sous total
        </Button>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <Button variant="outline" size="sm">
          Annuler
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" /> Prévisualiser et imprimer
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAndSend}
            className="bg-red-800 hover:bg-red-700 text-white flex items-center gap-1"
          >
            <Send className="h-4 w-4" /> Enregistrer et envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}