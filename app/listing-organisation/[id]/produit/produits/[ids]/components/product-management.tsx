"use client"

import { useEffect, useState } from "react"
import { AlertCircle, BarChart2, Building2, CircleHelp, FileText, Info, Plus, ShoppingCart, Tag, Trash, Trash2, Warehouse } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from 'next/image';
import DashboardAnalytics from "./dashboardAnalytics"
import StockManagement from "./stock-management"
import Chargement from "@/components/Chargement"

interface ProductDetails {
    name: string;
    category: string;
    description: string;
    images: string[];
    stock: number;
}

export default function ProductManagement() {
    const [productId, setProductId] = useState(null);
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("information");

    useEffect(() => {
        const url = window.location.href;
        const regex = /\/produit\/produits\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);

        if (match) {
            setProductId(match[1] as any);
        }
    }, []);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            setError(null);

            fetch(`/api/productdetails/?id=${productId}`)
                .then((response) => response.json())
                .then((data) => {
                    setProductDetails(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(null);
                    setError(err.message || "Erreur lors de la récupération des détails du produit");
                    setLoading(false);
                });
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="">
                <Chargement />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex w-full h-screen items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex">
          {productDetails && (
            <div className="border-gray-100 border-r-2">
              <div className="w-full p-4 bg-white">
                {/* Avatar/logo du contact */}
                <div className="mb-6 flex justify-center">
                  <div className="relative inline-block">
                    <div className="w-[100px] h-[100px] flex items-center justify-center text-primary-foreground">
                      {productDetails ? (
                        <img
                          src={productDetails.images[0]}
                          alt={productDetails.name}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <Building2 className="h-12 w-12" />
                      )}
                    </div>
                    <button
                      className="absolute -bottom-1 -right-1 bg-white border rounded-full p-1 hover:bg-gray-100 transition-colors"
                      aria-label="Supprimer l'image"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
      
                {/* Infos produit */}
                <div className="flex items-center justify-between mt-5">
                  <h2 className="font-medium text-base">{productDetails.name}</h2>
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2 py-1">
                    Modifier
                  </Button>
                </div>
      
                <div className="space-y-2 mt-6">
                  <div className="grid grid-cols-2 gap-1 text-base">
                    <div className="text-gray-500">Nom :</div>
                    <div>{productDetails.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-base">
                    <div className="text-gray-500">Catégories :</div>
                    <div>{productDetails.category}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-base">
                    <div className="text-gray-500">Description :</div>
                    <div className="text-sm">
                      {productDetails.description
                        .split(' ')
                        .slice(0, 5)
                        .join(' ')
                        .concat(productDetails.description.split(' ').length > 5 ? '...' : '')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <h3 className="text-gray-500">En Stock</h3>
                    <div>{productDetails.stock}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
      
          {/* Onglets */}
          <Tabs
            defaultValue="information"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full bg-white border-gray-100 justify-start border-b-2">
              <TabsTrigger
                value="information"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                Information générale
              </TabsTrigger>
              <TabsTrigger
                value="statistique"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none flex items-center gap-2"
              >
                <BarChart2 className="w-4 h-4" />
                Statistique
              </TabsTrigger>
              <TabsTrigger
                value="stock"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none flex items-center gap-2"
              >
                <Warehouse className="w-4 h-4" />
                Stock
              </TabsTrigger>
              <TabsTrigger
                value="vente"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Vente
              </TabsTrigger>
              <TabsTrigger
                value="prix"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Prix des fournisseurs
              </TabsTrigger>
            </TabsList>
      
            <TabsContent value="information" className="mt-6">
              <InformationGenerale />
            </TabsContent>
            <TabsContent value="statistique" className="mt-6">
              <Statistique />
            </TabsContent>
            <TabsContent value="stock" className="mt-6">
              <Stock />
            </TabsContent>
            <TabsContent value="vente" className="mt-6">
              <Vente />
            </TabsContent>
            <TabsContent value="prix" className="mt-6">
              <PrixFournisseur />
            </TabsContent>
          </Tabs>
        </div>
      );
      
}


function InformationGenerale() {
    return (
        <div className="">
            <div className=" p-4">
                <h2 className="text-lg font-medium mb-4">Références</h2>
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="reference">Référence</Label>
                            <CircleHelp className="h-5 w-5 " fill="#B71C1C" color="white" />
                        </div>
                        <Input id="reference" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="mpn">MPN</Label>
                            <CircleHelp className="h-5 w-5 " fill="#B71C1C" color="white" />
                        </div>
                        <Input id="mpn" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="code">Code barre - UPC</Label>
                            <CircleHelp className="h-5 w-5 " fill="#B71C1C" color="white" />
                        </div>
                        <Input id="code" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="isbn">ISBN</Label>
                            <CircleHelp className="h-5 w-5 " fill="#B71C1C" color="white" />
                        </div>
                        <Input id="isbn" />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="space-y-2">
                        <Label htmlFor="caracteristiques">Caractéristiques</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Composition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="composition">Composition</SelectItem>
                                <SelectItem value="material">Matériel</SelectItem>
                                <SelectItem value="color">Couleur</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="valeur-predifinie">Valeur prédéfinie</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Céramique" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ceramique">Céramique</SelectItem>
                                <SelectItem value="metal">Métal</SelectItem>
                                <SelectItem value="plastique">Plastique</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-y-8 gap-2">
                        <div className="space-y-2 w-2/3">
                            <div className="">
                                <Label htmlFor="valeur_perso">Valeur personnalisée</Label>
                            </div>
                            <Input className="w-full" id="valeur_perso" />
                        </div>

                        <div className="w-1/2">
                            <Trash2 />
                        </div>
                    </div>
                </div>

                <div className="flex items-center mb-4">
                    <Button variant="outline" size="sm" className="border border-[#7f1d1c] text-[#7f1d1c] p-5 font-bold hover:bg-transparent hover:text-[#7f1d1c] ">
                        <Plus color="#7f1d1c" className="h-4 w-4 rounded-full border border-[#7f1d1c] flex items-center justify-center " />
                        Ajouter Caractéristiques
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Label htmlFor="document">Document joint</Label>
                            <CircleHelp className="h-5 w-5 " fill="#B71C1C" color="white" />
                        </div>
                        <p className="text-xs text-gray-500">
                            Les clients peuvent télécharger ces fichiers sur la page du produit.
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="outline" size="sm" className="border border-[#7f1d1c] text-[#7f1d1c] p-5 font-bold hover:bg-transparent hover:text-[#7f1d1c] ">
                                <FileText className="h-4 w-4" />
                                Glisser tous les fichiers
                            </Button>
                        </div>

                        <div className="relative">
                            <Input placeholder="Rechercher un fichier" className="pl-8" />
                            <div className="absolute left-2 top-2.5">
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-500"
                                >
                                    <path
                                        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </div>


                        <Alert className="bg-[#FFEBEE] border-[#FFCDD2] text-black ">
                            <AlertDescription className="flex items-center ">
                                <Info className="h-6 w-6 mr-2 " fill="#B71C1C" color="white" />
                                Aucun fichier joint.
                            </AlertDescription>
                        </Alert>

                        <div className="flex items-center gap-2 mt-5">
                            <Button variant="outline" size="sm" className="border border-[#7f1d1c] text-[#7f1d1c] p-5 font-bold hover:bg-transparent hover:text-[#7f1d1c] ">
                                <Plus color="#7f1d1c" className="h-4 w-4 rounded-full border border-[#7f1d1c] flex items-center justify-center " />
                                Ajouter Caractéristiques
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="afficher-fiche">Afficher l'état sur la fiche produit</Label>
                            </div>

                            <Switch
                                id="afficher-fiche"
                                className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c]"
                            />
                        </div>

                        <div className="">
                            <Select>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Non" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="non">Non</SelectItem>
                                    <SelectItem value="oui">Oui</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Statistique() {
    return (
        <div className="space-y-6 px-10">
  

                <div className="flex items-center justify-end gap-2 mt-6">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="du" className="text-xs">
                            Du
                        </Label>
                        <Input id="du" type="date" className="h-8 w-36" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="au" className="text-xs">
                            au
                        </Label>
                        <Input id="au" type="date" className="h-8 w-36" />
                    </div>
                </div>


            <DashboardAnalytics />
        </div>
    )
}

function Stock() {
    return (
        <StockManagement />
    )
}

function Vente() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">Vente</h2>

            {/* Placeholder for Vente tab content */}
            <div className="border rounded-md p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Contenu de l'interface de vente à implémenter</p>
            </div>
        </div>
    )
}

function PrixFournisseur() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">Prix des fournisseur</h2>

            {/* Placeholder for Prix des fournisseur tab content */}
            <div className="border rounded-md p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Contenu de l'interface des prix fournisseurs à implémenter</p>
            </div>
        </div>
    )
}

