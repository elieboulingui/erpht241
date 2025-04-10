"use client"

import { useState } from "react"
import { AlertCircle, BarChart2, CircleHelp, FileText, Info, Plus, ShoppingCart, Tag, Trash2, Warehouse } from "lucide-react"
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

export default function ProductManagement() {
    const [activeTab, setActiveTab] = useState("information")
    const shouldShowImage = true; // À remplacer par votre logique

    return (
        <div className="flex ">

            <div className="border-gray-100 border-r-2">
                <div className="w-full p-4 bg-white">
                    {/* Image de profil arrondie avec bouton + */}
                    <div className="flex justify-center">
                        <div className="relative w-24 h-24 group">
                            <Image
                                src="/images/product-image.jpg"
                                alt=""
                                fill
                                className="rounded-full object-cover border-4 border-white bg-[#7f1d1c] hover:bg-[#7f1d1c]"
                            />
                            {/* Bouton + en bas à droite */}
                            <button className="absolute -bottom-1 -right-1 bg-[#7f1d1c] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-[#9e2a2a] transition-colors">
                                <span className="text-xl">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Gallery - 3 images en bas */}
                    {/* <div className="flex mt-6 gap-3 justify-center">
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <Image
                                src="/images/iphone-1.jpg"
                                alt="Vue 1"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <Image
                                src="/images/iphone-2.jpg"
                                alt="Vue 2"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <Image
                                src="/images/iphone-3.jpg"
                                alt="Vue 3"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div> */}

                    {/* Header */}


                    <div className="flex items-center justify-between mt-5">
                        <h2 className="font-medium text-base">Information générale</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs px-2 py-1"
                        >
                            Modifier
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-1 text-base mt-6">
                            <div className=" text-gray-500">Nom :</div>
                            <div>iphone 13</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-base">
                            <div className=" text-gray-500">Catégories :</div>
                            <div>Smartphone</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-base">
                            <div className=" text-gray-500">Description :</div>
                            <div className="">Lorem ipsum dolor sit amet, consectetur</div>
                        </div>



                        <div className="grid grid-cols-2 gap-1">
                            <h3 className=" text-gray-500">En Stock</h3>
                            <div className="">25</div>
                        </div>

                    </div>
                </div>
            </div>

            <Tabs defaultValue="information" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                        Prix des fournisseur
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
    )
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
            <div className="flex items-center gap-4 ">
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 w-16">
                        <Label htmlFor="jour-debut" className="text-xs">
                            Jour
                        </Label>
                        <Input id="jour-debut" className="h-8" />
                    </div>
                    <div className="space-y-1 w-16">
                        <Label htmlFor="mois-debut" className="text-xs">
                            Mois
                        </Label>
                        <Input id="mois-debut" className="h-8" />
                    </div>
                    <div className="space-y-1 w-20">
                        <Label htmlFor="annee-debut" className="text-xs">
                            Année
                        </Label>
                        <Input id="annee-debut" className="h-8" />
                    </div>
                </div>

                <div className="flex items-center">
                    <span>-</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 w-16">
                        <Label htmlFor="jour-fin" className="text-xs">
                            Jour
                        </Label>
                        <Input id="jour-fin" className="h-8" />
                    </div>
                    <div className="space-y-1 w-16">
                        <Label htmlFor="mois-fin" className="text-xs">
                            Mois
                        </Label>
                        <Input id="mois-fin" className="h-8" />
                    </div>
                    <div className="space-y-1 w-20">
                        <Label htmlFor="annee-fin" className="text-xs">
                            Année
                        </Label>
                        <Input id="annee-fin" className="h-8" />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-6">
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

                <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c] mt-6">
                    <FileText className="h-4 w-4 mr-2" />
                    Actualiser
                </Button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-start gap-2">
                    <Info className="h-6 w-6 mr-2 " fill="#B71C1C" color="white" />
                    <div className="space-y-2">
                        <p className="text-sm">Nombre d'achats comparé au nombre de vues</p>
                        <p className="text-xs text-gray-700">
                            Pour chaque catégorie et chaque produit disponible dans celle-ci, des graphiques apparaissent. Vous pouvez
                            ensuite les analyser:
                        </p>
                        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                            <li>
                                Si le produit est beaucoup vu mais très peu acheté, vous devriez le mettre davantage en évidence sur la
                                page d'accueil de votre boutique.
                            </li>
                            <li>
                                D'autre part, si un produit est beaucoup acheté mais rarement consulté, nous vous conseillons de
                                vérifier ou modifier les informations de celui-ci.
                            </li>
                        </ul>
                    </div>
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
