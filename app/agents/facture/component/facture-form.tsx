"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  Plus,
  Send,
  Printer,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import ProductSearch from "./product-search-ia";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface FactureFormProps {
  initialData: {
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
    }>;
  };
  onSave: (data: any) => void;
}

export default function FactureForm({ initialData, onSave }: FactureFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    initialData.creationDate || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(initialData.dueDate || "");
  const [terms, setTerms] = useState(initialData.terms || "");

  const [products, setProducts] = useState<Product[]>(() => {
    return initialData.products.map((product) => ({
      ...product,
      total: calculateProductTotal(product),
    }));
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!client.name.trim()) {
      newErrors.clientName = "Le nom du client est requis";
    }

    if (!client.address.trim()) {
      newErrors.clientAddress = "L'adresse du client est requise";
    }

    if (!creationDate) {
      newErrors.creationDate = "La date de création est requise";
    }

    if (!dueDate) {
      newErrors.dueDate = "La date d'échéance est requise";
    }

    products.forEach((product, index) => {
      if (!product.name.trim()) {
        newErrors[`productName-${product.id}`] =
          `Le nom du produit #${index + 1} est requis`;
      }
      if (product.quantity <= 0) {
        newErrors[`productQuantity-${product.id}`] =
          `La quantité du produit #${index + 1} doit être supérieure à 0`;
      }
      if (product.price <= 0) {
        newErrors[`productPrice-${product.id}`] =
          `Le prix du produit #${index + 1} doit être supérieur à 0`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    // Clear error when field is updated
    if (field === "name" || field === "quantity" || field === "price") {
      const newErrors = { ...errors };
      delete newErrors[
        `product${field.charAt(0).toUpperCase() + field.slice(1)}-${id}`
      ];
      setErrors(newErrors);
    }
  };

  function calculateProductTotal(product: any): number {
    const subtotal = product.quantity * product.price;
    const discountAmount = subtotal * (product.discount / 100);
    const taxAmount = (subtotal - discountAmount) * (product.tax / 100);
    return subtotal - discountAmount + taxAmount;
  }

  const addProductLine = () => {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    setProducts([
      ...products,
      {
        id: newId,
        name: "",
        quantity: 1,
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
      { id: 1, name: "", quantity: 1, price: 0, discount: 0, tax: 0, total: 0 },
    ]);
  };

  const getTotalAmount = () => {
    return products.reduce((sum, product) => sum + product.total, 0);
  };

  const handlePreview = () => {
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires", {
        position: "bottom-right",
        duration: 2000,
      });
      return;
    }
    alert("Prévisualisation de la facture");
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires", {
        position: "bottom-right",
        duration: 2000,
      });
      return;
    }

    setIsSaving(true);

    const factureData = {
      client,
      paymentMethod,
      sendLater,
      terms,
      creationDate,
      dueDate,
      products,
      totalAmount: getTotalAmount(),
    };

    setTimeout(() => {
      onSave(factureData);
      setIsSaving(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
      }, 1500);
    }, 800);
  };

  const handleSaveAndSend = () => {
    if (!validateForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires", {
        position: "bottom-right",
        duration: 2000,
      });
      return;
    }

    const factureData = {
      client,
      paymentMethod,
      sendLater,
      terms,
      creationDate,
      dueDate,
      products,
      totalAmount: getTotalAmount(),
    };

    onSave(factureData);
    toast.success("Facture sauvegardée et envoyée", {
      position: "bottom-right",
      duration: 2000,
      icon: <CheckCircle className="text-[#7f1d1c] animate-bounce" />,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md">
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
                Client <span className="text-red-500">*</span>
              </Label>
              <div className="ml-1 text-gray-400">ⓘ</div>
            </div>
            <Input
              id="client"
              value={client.name}
              onChange={(e) => {
                setClient({ ...client, name: e.target.value });
                if (errors.clientName) {
                  const newErrors = { ...errors };
                  delete newErrors.clientName;
                  setErrors(newErrors);
                }
              }}
              className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors.clientName ? "border-red-500" : ""}`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="address" className="text-sm font-medium">
              Adresse <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address"
              value={client.address}
              onChange={(e) => {
                setClient({ ...client, address: e.target.value });
                if (errors.clientAddress) {
                  const newErrors = { ...errors };
                  delete newErrors.clientAddress;
                  setErrors(newErrors);
                }
              }}
              className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors.clientAddress ? "border-red-500" : ""}`}
            />
            {errors.clientAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientAddress}
              </p>
            )}
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
              className="w-full focus:ring-2 focus:ring-red-500/50 transition-all"
              placeholder="Facultatif"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <Checkbox
                id="sendLater"
                checked={sendLater}
                onCheckedChange={(checked) => setSendLater(checked as boolean)}
                className="h-5 w-5 border-gray-300 rounded focus:ring-red-500"
              />
              <Label htmlFor="sendLater" className="ml-2 text-sm">
                Envoyer plutard
              </Label>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-black text-sm block mb-2">Paiement</label>
            <div className="">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="carte"
                  name="paymentMethod"
                  value="carte"
                  checked={paymentMethod === "carte"}
                  onChange={() => setPaymentMethod("carte")}
                  className="
          mr-2 
          w-4 h-4 
          border border-black 
          rounded-full 
          appearance-none
          checked:bg-black 
          checked:border-black 
          focus:outline-none 
          focus:ring-0
        "
                />
                <Label
                  htmlFor="carte"
                  className="text-sm text-black flex items-center"
                >
                  Carte
                  <img
                    src="/images/visa.png"
                    alt="Visa"
                    className="h-10 ml-2"
                  />
                  <img
                    src="/images/mastercard.png"
                    alt="Mastercard"
                    className="h-10 ml-1"
                  />
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="transfert"
                  name="paymentMethod"
                  value="transfert"
                  checked={paymentMethod === "transfert"}
                  onChange={() => setPaymentMethod("transfert")}
                  className="
          mr-2 
          w-4 h-4 
          border border-black 
          rounded-full 
          appearance-none
          checked:bg-black 
          checked:border-black 
          focus:outline-none 
          focus:ring-0
        "
                />
                <Label htmlFor="transfert" className="text-sm text-black">
                  Transfert bancaire
                </Label>
              </div>
              <div className="flex mt-2 items-center">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="
          mr-2 
          w-4 h-4 
          border border-black 
          rounded-full 
          appearance-none
          checked:bg-black 
          checked:border-black 
          focus:outline-none 
          focus:ring-0
        "
                />
                <Label htmlFor="cash" className="text-sm text-black">
                  Cash
                </Label>
              </div>
            </div>
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
              className="w-full h-10 px-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-red-500/50 transition-all"
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
              Date de création <span className="text-red-500">*</span>
            </Label>
            <Input
              id="creationDate"
              type="date"
              value={creationDate}
              onChange={(e) => {
                setCreationDate(e.target.value);
                if (errors.creationDate) {
                  const newErrors = { ...errors };
                  delete newErrors.creationDate;
                  setErrors(newErrors);
                }
              }}
              className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors.creationDate ? "border-red-500" : ""}`}
            />
            {errors.creationDate && (
              <p className="text-red-500 text-xs mt-1">{errors.creationDate}</p>
            )}
          </div>
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Date d'échéance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) {
                  const newErrors = { ...errors };
                  delete newErrors.dueDate;
                  setErrors(newErrors);
                }
              }}
              className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors.dueDate ? "border-red-500" : ""}`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section ProductSearch - placée avant le tableau des produits */}
      <ProductSearch
        onAddProduct={(product) => {
          const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
          const newProduct = {
            id: newId,
            name: product.name,
            quantity: product.quantity || 1,
            price: product.price,
            discount: 0,
            tax: 0,
            total: product.price * (product.quantity || 1),
          };
          setProducts([...products, newProduct]);
        }}
      />

      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm">
              <th className="py-2 px-2 w-10">#</th>
              <th className="py-2 px-2">
                Nom Produit <span className="text-red-500">*</span>{" "}
                <span className="text-gray-400">ⓘ</span>
              </th>
              <th className="py-2 px-2">
                Quantité <span className="text-red-500">*</span>
              </th>
              <th className="py-2 px-2">
                Prix <span className="text-red-500">*</span>
              </th>
              <th className="py-2 px-2">Réduction</th>
              <th className="py-2 px-2">Taxe</th>
              <th className="py-2 px-2">Total</th>
              <th className="py-2 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-2">{product.id}</td>
                <td className="py-2 px-2">
                  <Input
                    value={product.name}
                    onChange={(e) =>
                      updateProduct(product.id, "name", e.target.value)
                    }
                    className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors[`productName-${product.id}`] ? "border-red-500" : ""}`}
                  />
                  {errors[`productName-${product.id}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`productName-${product.id}`]}
                    </p>
                  )}
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "quantity", e.target.value)
                    }
                    className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors[`productQuantity-${product.id}`] ? "border-red-500" : ""}`}
                  />
                  {errors[`productQuantity-${product.id}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`productQuantity-${product.id}`]}
                    </p>
                  )}
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={product.price || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "price", e.target.value)
                    }
                    className={`w-full focus:ring-2 focus:ring-red-500/50 transition-all ${errors[`productPrice-${product.id}`] ? "border-red-500" : ""}`}
                  />
                  {errors[`productPrice-${product.id}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`productPrice-${product.id}`]}
                    </p>
                  )}
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.discount || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "discount", e.target.value)
                    }
                    className="w-full focus:ring-2 focus:ring-red-500/50 transition-all"
                  />
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={product.tax || ""}
                    onChange={(e) =>
                      updateProduct(product.id, "tax", e.target.value)
                    }
                    className="w-full focus:ring-2 focus:ring-red-500/50 transition-all"
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
                    className="h-8 w-8 text-red-500 hover:bg-red-50 transition-colors"
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
          className="flex items-center gap-1 hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4" /> Ajouter une ligne
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllLines}
          className="flex items-center gap-1 hover:bg-gray-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Effacer tous les lignes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4" /> Ajouter sous total
        </Button>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-gray-100 transition-colors"
        >
          Annuler
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-1 hover:bg-gray-100 transition-colors"
          >
            <Printer className="h-4 w-4" /> Prévisualiser et imprimer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isSuccess}
            className={`flex items-center gap-1 transition-all ${isSuccess ? " bg-[#7f1d1c] text-white hover:bg-[#7f1d1c]/85 " : "bg-red-800 hover:bg-red-700 hover:text-white"} text-white`}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enregistrement...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 animate-bounce" />
                Enregistré !
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
