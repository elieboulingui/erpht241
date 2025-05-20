"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDonation } from "./action/commande";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  weight: string;
  images: string[];
  categories: { id: number; name: string }[];
  organisation: { brand: string };
  selected?: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const brands = ["Toutes", "HP", "Apple", "Sony", "Canon", "Bose", "Dell"];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("Toutes");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { data: session } = useSession();
  
  useEffect(() => {
    const fetchCategories = async () => {
      
      const response = await fetch("/api/categoriespos");
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      
      const response = await fetch("/api/getcontact");
      const data = await response.json();
      console.log(data);
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/productpost");
      const data = await response.json();
      const updatedProducts = data.map((product: any) => ({
        ...product,
        weight: product.weight || "Unknown",
      }));
      setLocalProducts(updatedProducts);
    };
    fetchProducts();
  }, []);

  const filteredProducts = localProducts.filter(
    (product) =>
      (selectedCategory === null ||
        product.categories.some((cat) => cat.id === selectedCategory)) &&
      (selectedBrand === "Toutes" ||
        product.organisation?.brand === selectedBrand)
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 5000;
  const total = subtotal - discount;

  const formatPrice = (price: string | number | bigint) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("fr-FR").format(numericPrice) + " FCFA";
  };

  const handlePrev = () => {
    if (visibleIndex > 0) {
      setVisibleIndex((prevIndex) => prevIndex - 3);
    }
  };

  const handleNext = () => {
    if (visibleIndex + 3 < filteredProducts.length) {
      setVisibleIndex((prevIndex) => prevIndex + 3);
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex gap-6">
        {/* Produits */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Catégories */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Catégorie de Produits</h2>
              <div className="flex">
                <Button variant="outline" size="icon" className="mr-2" onClick={handlePrev}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                  className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-colors ${
                    selectedCategory === category.id
                      ? "border-orange-500 bg-orange-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm">{category.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Produits */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Choisir Produit(s)</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm">Marque:</span>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Toutes les marques" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {filteredProducts
                .slice(visibleIndex, visibleIndex + 3)
                .map((product) => (
                  <div key={product.id} className="border rounded-md relative">
                    {product.selected && (
                      <div className="absolute top-0 left-0 bg-orange-500 text-white px-3 py-1 rounded-br-md">
                        Sélectionné
                      </div>
                    )}
                    <div className="p-4 flex justify-center">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="h-40 object-contain"
                      />
                    </div>
                    <div className="p-4 border-t">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-sm text-gray-600">
                        Marque: {product.organisation?.brand}
                      </p>
                      <p className="text-sm text-gray-600">
                        Poids: {product.weight}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="font-bold">{formatPrice(product.price)}</div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2"
                            onClick={() => {
                              const item = cart.find((i) => i.id === product.id);
                              if (item && item.quantity > 1) {
                                updateQuantity(product.id, -1);
                              }
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2">
                            {cart.find((item) => item.id === product.id)?.quantity || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Panier */}
        <div className="w-96 bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Facture #24617</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4">
            {cart.map((item) => {
              const product = localProducts.find((p) => p.id === item.id);
              return (
                <div key={item.id} className="flex items-center mb-6">
                  <img
                    src={product?.images[0] || "/placeholder.svg?height=60&width=60"}
                    alt={item.name}
                    className="w-16 h-16 object-contain mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPrice(item.price)}</div>
                    <div className="flex items-center justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="mt-8 pt-4 border-t border-dashed">
              <div className="flex justify-between mb-2">
                <span>Sous-total</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2 text-green-600">
                <span>Remise membre</span>
                <span>- {formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Méthode de Paiement</h3>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" size="sm" className="w-full">
                  Carte bancaire
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Mobile Money
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[400px]">
                    <MobileMoneyForm
                      cart={cart}
                      courseId={cart[0]?.id?.toString() || ""}
                    />
                  </SheetContent>
                </Sheet>

                <Button variant="outline" size="sm" className="w-full">
                  Espèces
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMoneyForm({
  cart,
  courseId,
}: {
  cart: CartItem[];
  courseId: string;
}) {
  const [phone, setPhone] = useState("");
  const [email , setEmail]  = useState("");
  const [operator, setOperator] = useState("");

  const handleConfirm = () => {
    if (!phone || !operator  || !email  || cart.length === 0 || !courseId) {
      toast.message("Veuillez remplir toutes les informations et sélectionner un produit.");
      return;
    }

    const productInCart = cart[0];
    const productId = productInCart.id.toString();

    const donationData = {
      amount: productInCart.price * productInCart.quantity,
      payer_msisdn: phone,
      payer_email: email,
      short_description: `Achat de ${productInCart.name}`,
      external_reference: `ref-${Date.now()}`,
      courseId: courseId,
      productId: productId,
    };

    createDonation(donationData)
      .then((res) => {
        if (res.success) {
           toast.message("Paiement initié avec succès !");
        } else {
           toast.message("Erreur: " + res.message);
        }
      })
      .catch((err) => {
        toast.message("Erreur lors du don:", err);
         toast.message("Une erreur est survenue.");
      });
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Paiement Mobile Money</SheetTitle>
        <SheetDescription>
          Veuillez renseigner les informations de paiement.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-6 space-y-4">
        <div>
          <Label>Email</Label>
          <Input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Numéro de téléphone</Label>
          <Input
            placeholder="0700000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label>Opérateur</Label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2 text-sm"
          >
            <option value="">-- Choisir --</option>
            <option value="airtelmoney">Airtel</option>
            <option value="airtelmoney">Moov</option>
          </select>
        </div>
        <Button className="w-full mt-4" onClick={handleConfirm}>
          Confirmer le paiement
        </Button>
      </div>
    </>
  );
}