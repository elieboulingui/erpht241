"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
    FileText,
    Trash,
    Clock,
    Smile,
    Building2,
    BarChart2,
    Warehouse,
    ShoppingCart,
    Tag,
    Info,
    CircleHelp,
    Plus,
    Trash2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardAnalytics from "./dashboardAnalytics";
import StockManagement from "./stock-management";
import Chargement from "@/components/Chargement";
import { useEffect } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductDetails {
    name: string;
    category: string;
    description?: string;
    images?: string[];
    stock?: number;
}

export default function ProductManagement() {
    const [comments, setComments] = useState<
        Array<{ id: string; text: string; user: string; timestamp: Date }>
    >([]);
    const [showComments, setShowComments] = useState(true);
    const [isLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const [productId, setProductId] = useState<string | null>(null);
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("information");

    useEffect(() => {
        const url = window.location.href;
        const regex = /\/produit\/produits\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);

        if (match) {
            setProductId(match[1]);
        }
    }, []);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            setError(null);

            fetch(`/api/productdetails/?id=${productId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération des détails du produit");
                    }
                    return response.json();
                })
                .then((data) => {
                    setProductDetails(data);
                    setLoading(false);
                })
                .catch((err) => {
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

    if (!productDetails) {
        return (
            <div className="flex items-center justify-center bg-white py-20">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Aucune donnée disponible</h2>
                    <p className="text-gray-600 mb-4">Les détails du produit n'ont pas pu être chargés</p>
                    <Button onClick={() => window.location.reload()}>Réessayer</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <div className="flex bg-white">
                {/* Contenu principal */}
                <div className="flex-1 flex flex-col">
                    {/* Zone de contenu */}
                    <div className="flex-1 flex">
                        {/* Panneau gauche - Détails du produit */}
                        <div className="w-[475px] border-r">
                            <div className="p-6 flex flex-col">
                                {/* Avatar/logo du produit */}
                                <div className="mb-6 flex justify-center">
                                    <div className="relative inline-block">
                                        <div className="w-[90px] h-[90px] bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                            {productDetails.images?.[0] ? (
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

                                {/* Section des propriétés */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-medium text-base">Propriétés</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs px-2 py-1"
                                    >
                                        Modifier
                                    </Button>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <PropertyItem
                                        icon={<Building2 className="h-4 w-4" />}
                                        label="Nom"
                                        value={productDetails.name}
                                    />
                                    <PropertyItem
                                        icon={<Tag className="h-4 w-4" />}
                                        label="Catégorie"
                                        value={productDetails.category}
                                    />
                                    <PropertyItem
                                        icon={<FileText className="h-4 w-4" />}
                                        label="Description"
                                        value={productDetails.description ?
                                            productDetails.description.split(' ').slice(0, 10).join(' ') + '...' :
                                            "No description"}
                                    />
                                    <PropertyItem
                                        icon={<Warehouse className="h-4 w-4" />}
                                        label="Stock"
                                        value={productDetails.stock?.toString() || "0"}  // Safe access with optional chaining
                                    />
                                </div>
                            </div>

                            <Separator />
                        </div>

                        {/* Panneau droit - Onglets */}
                        <div className="flex-1">
                            <Tabs
                                defaultValue="information"
                                className="w-full"
                                onValueChange={setActiveTab}
                            >
                                <TabsList className="w-full justify-start rounded-none h-14 px-4 space-x-5 bg-transparent">
                                    <TabsTrigger
                                        value="information"
                                        className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                                    >
                                        <Info size={16} className="mr-2" />
                                        Information
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="statistique"
                                        className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                                    >
                                        <BarChart2 size={16} className="mr-2" />
                                        Statistique
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="stock"
                                        className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                                    >
                                        <Warehouse size={16} className="mr-2" />
                                        Stock
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="vente"
                                        className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                                    >
                                        <ShoppingCart size={16} className="mr-2" />
                                        Vente
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="fournisseur"
                                        className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                                    >
                                        <Tag size={16} className="mr-2" />
                                        Fournisseur
                                    </TabsTrigger>
                                </TabsList>

                                <Separator />

                                {/* Contenu des onglets */}
                                <TabsContent value="information" className="p-4 mt-0">
                                    <InformationGenerale />
                                </TabsContent>
                                <TabsContent value="statistique" className="p-4 mt-0">
                                    <Statistique />
                                </TabsContent>
                                <TabsContent value="stock" className="p-4 mt-0">
                                    <Stock />
                                </TabsContent>
                                <TabsContent value="vente" className="p-4 mt-0">
                                    <Vente />
                                </TabsContent>
                                <TabsContent value="fournisseur" className="p-4 mt-0">
                                    <PrixFournisseur />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composants auxiliaires
function PropertyItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-14">
            <div className="w-20 text-gray-500 flex items-center">
                <span className="mr-2 text-gray-400">{icon}</span>
                {label}
            </div>
            <div className="flex-1 truncate">{value || "-"}</div>
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
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleHelp className="h-5 w-5" fill="#B71C1C" color="white" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white p-3 font-bold">
                                    <p>Caractères spéciaux <br />autorisés : - #</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="reference" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="mpn">MPN</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleHelp className="h-5 w-5" fill="#B71C1C" color="white" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white p-3 font-bold">
                                    <p>MPN est utilisé au niveau <br />international pour identifier la <br />reference fabriquant du produit.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="mpn" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="code">Code barre - UPC</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleHelp className="h-5 w-5" fill="#B71C1C" color="white" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white p-3 font-bold">
                                    <p>Ce type de code produit est tres utilisé <br />aux Etats-Unis, au Canada, au <br />Royaume -Uni, en Australie, en <br />Nouvelle-Zelande et d’autre pays.</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Input id="code" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-3 items-center">
                            <Label htmlFor="isbn">ISBN</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleHelp className="h-5 w-5" fill="#B71C1C" color="white" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white p-3 font-bold">
                                    <p>Le code ISBN est utilisé à travers le <br />monde pour identifier les livres et leurs <br />differentes éditions.</p>
                                </TooltipContent>
                            </Tooltip>
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
                            <Tooltip>
                                <TooltipTrigger>
                                    <CircleHelp className="h-5 w-5" fill="#B71C1C" color="white" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white p-3 font-bold">
                                    <p>Instructions, guide des tailles ou tout <br />fichier que vous souhaitez ajouter à un <br />produit.</p>
                                </TooltipContent>
                            </Tooltip>                        
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
    );
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
    );
}

function Stock() {
    return <StockManagement />;
}

function Vente() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">Vente</h2>
            <div className="border rounded-md p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Contenu de l'interface de vente à implémenter</p>
            </div>
        </div>
    );
}

function PrixFournisseur() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">Prix des fournisseur</h2>
            <div className="border rounded-md p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Contenu de l'interface des prix fournisseurs à implémenter</p>
            </div>
        </div>
    );
}