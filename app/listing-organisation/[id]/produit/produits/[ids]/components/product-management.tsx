"use client"

import { useState } from "react"
import { AlertCircle, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProductManagement() {
    const [activeTab, setActiveTab] = useState("information")

    return (
        <div className="flex gap-2">

            <div className="border-gray-100 border-r-2">
                <div className="w-full p-4 bg-white">
                    <div className="flex flex-col items-center mb-6">
                        <div className="bg-red-700 rounded-full p-3 mb-4">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex gap-2 w-full justify-center">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <FileText className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Information générale</h3>
                            <div className="mt-2">
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <div className="text-gray-500">Nom :</div>
                                    <div>iphone 13</div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <div className="text-gray-500">Catégories :</div>
                                    <div>Smartphone</div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-sm">
                                    <div className="text-gray-500">Description :</div>
                                    <div className="text-xs">Lorem ipsum dolor sit amet, consectetur</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-sm">
                        <h3 className="text-sm font-medium text-gray-500">En Stock</h3>
                            <div className="mt-1 text-sm">25</div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="information" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 w-full bg-white border-gray-100 border-b-2">
                    <TabsTrigger
                        value="information"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:rounded-none"
                    >
                        Information générale
                    </TabsTrigger>
                    <TabsTrigger
                        value="statistique"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:rounded-none"
                    >
                        Statistique
                    </TabsTrigger>
                    <TabsTrigger
                        value="stock"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:rounded-none"
                    >
                        Stock
                    </TabsTrigger>
                    <TabsTrigger
                        value="vente"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:rounded-none"
                    >
                        Vente
                    </TabsTrigger>
                    <TabsTrigger
                        value="prix"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-red-700 data-[state=active]:rounded-none"
                    >
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
        <div className="space-y-6">
            <div className=" p-4">
                <h2 className="text-lg font-medium mb-4">Références</h2>
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="reference">Référence</Label>
                            <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                        </div>
                        <Input id="reference" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="mpn">MPN</Label>
                            <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                        </div>
                        <Input id="mpn" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="code">Code barre - UPC</Label>
                            <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                        </div>
                        <Input id="code" />
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="date">Date_id</Label>
                        <Input id="date" />
                    </div> */}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="isbn">ISBN</Label>
                            <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                        </div>
                        <Input id="isbn" />
                    </div>
                </div>
            </div>

            <div className="border rounded-md p-4">
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
                    <div className="flex items-center justify-end">
                        <Button variant="ghost" size="icon">
                            <AlertCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" className="gap-1">
                        <div className="h-4 w-4 rounded-full bg-red-700 flex items-center justify-center text-white text-xs">+</div>
                        Ajouter Caractéristiques
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="document">Document joint</Label>
                            <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                        </div>
                        <p className="text-xs text-gray-500">
                            Les clients peuvent télécharger ces fichiers sur la page du produit.
                        </p>

                        <div className="flex items-center gap-2 mb-2">
                            <Button variant="outline" size="sm" className="gap-1">
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

                        <Alert variant="destructive" className="bg-red-100 border-red-200 text-red-800">
                            <AlertDescription className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Aucun fichier joint.
                            </AlertDescription>
                        </Alert>

                        <div className="flex items-center gap-2 mt-4">
                            <Button variant="outline" size="sm" className="gap-1">
                                <div className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                    +
                                </div>
                                Ajouter Caractéristiques
                            </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="afficher-fiche">Afficher l'état sur la fiche produit</Label>
                            </div>
                            <Switch id="afficher-fiche" />
                        </div>

                        <div className="mt-2">
                            <Select>
                                <SelectTrigger className="w-40">
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
                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <Label htmlFor="jour-debut" className="text-xs">
                            Jour
                        </Label>
                        <Input id="jour-debut" className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="mois-debut" className="text-xs">
                            Mois
                        </Label>
                        <Input id="mois-debut" className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="annee-debut" className="text-xs">
                            Année
                        </Label>
                        <Input id="annee-debut" className="h-8" />
                    </div>
                </div>

                <div className="flex items-center">
                    <span>-</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <Label htmlFor="jour-fin" className="text-xs">
                            Jour
                        </Label>
                        <Input id="jour-fin" className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="mois-fin" className="text-xs">
                            Mois
                        </Label>
                        <Input id="mois-fin" className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="annee-fin" className="text-xs">
                            Année
                        </Label>
                        <Input id="annee-fin" className="h-8" />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-6">
                    <div className="flex items-center gap-1">
                        <Label htmlFor="du" className="text-xs">
                            Du
                        </Label>
                        <Input id="du" type="date" className="h-8 w-32" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Label htmlFor="au" className="text-xs">
                            au
                        </Label>
                        <Input id="au" type="date" className="h-8 w-32" />
                    </div>
                </div>

                <Button className="bg-red-700 hover:bg-red-800 mt-6">
                    <FileText className="h-4 w-4 mr-2" />
                    Actualiser
                </Button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-700 mt-0.5" />
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

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Label htmlFor="afficher-encadre">Affiche encadrée: Titre aventure tropica - Détails</Label>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-700"></div>
                        <span className="text-xs">Popularité</span>
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Vente</span>
                    </div>
                </div>

                <div className="border rounded-md p-4 h-64">
                    <div className="h-full flex items-center justify-center">
                        <div className="w-full h-40 relative">
                            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
                            <div className="absolute left-0 top-0 h-full w-px bg-gray-300"></div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-[-20px] left-0 w-full flex justify-between">
                                {[1, 2, 4, 6, 8, 10].map((num) => (
                                    <div key={num} className="text-xs text-gray-500">
                                        {num}
                                    </div>
                                ))}
                            </div>

                            {/* Y-axis labels */}
                            <div className="absolute left-[-20px] h-full flex flex-col justify-between">
                                <div className="text-xs text-gray-500">1</div>
                                <div className="text-xs text-gray-500">0.5</div>
                                <div className="text-xs text-gray-500">0</div>
                                <div className="text-xs text-gray-500">-0.5</div>
                                <div className="text-xs text-gray-500">-1</div>
                            </div>

                            {/* Data points */}
                            <div className="absolute bottom-[50%] left-[10%] h-2 w-2 rounded-full bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[20%] h-2 w-2 rounded-full bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[40%] h-2 w-2 rounded-full bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[60%] h-2 w-2 rounded-full bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[80%] h-2 w-2 rounded-full bg-red-700"></div>

                            {/* Lines connecting points */}
                            <div className="absolute bottom-[50%] left-[10%] w-[10%] h-px bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[20%] w-[20%] h-px bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[40%] w-[20%] h-px bg-red-700"></div>
                            <div className="absolute bottom-[50%] left-[60%] w-[20%] h-px bg-red-700"></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-4 w-4" />
                        Exporter CSV
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs text-gray-700">
                    <div>Total des ventes: 0</div>
                    <div>Visites: 0</div>
                    <div>Taux de transformation: 0.00 %</div>
                    <div>Quantité vendue: 0</div>
                    <div>Prix moyen: 0.00 €</div>
                </div>
            </div>
        </div>
    )
}

function Stock() {
    return (
        <div className="space-y-6 px-6">
            <h2 className="text-lg font-medium">Stock</h2>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <Label htmlFor="modifier-quantite" className="min-w-32">
                        Modifier la quantité:
                    </Label>
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">300</div>
                        <span>-</span>
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">340</div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="ajouter-soustraire" className="min-w-32">
                        Ajouter ou soustraire des éléments:
                    </Label>
                    <Input type="number" id="ajouter-soustraire" className="w-16" defaultValue="40" />
                    <Select defaultValue="add">
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder="+" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="add">+</SelectItem>
                            <SelectItem value="subtract">-</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center min-w-32">
                        <Label htmlFor="quantite-minimale">Quantité minimale pour la vente:</Label>
                        <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                    </div>
                    <Input type="number" id="quantite-minimale" className="w-16" defaultValue="48" />
                    <Select defaultValue="pieces">
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pieces">pcs</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="emplacement" className="min-w-32">
                        Emplacement du stock:
                    </Label>
                    <Input id="emplacement" placeholder="Saisir emplacement du stock" className="w-full max-w-md" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center min-w-32">
                        <Label htmlFor="recevoir-alerte">Recevoir une alerte par e-mail lorsque le stock est faible:</Label>
                        <AlertCircle className="h-4 w-4 text-red-700 ml-1" />
                    </div>
                    <Switch id="recevoir-alerte" />
                </div>

                <div className="flex items-center gap-4">
                    <Label htmlFor="seuil-alerte" className="min-w-32">
                        Seuil d'alerte du stock:
                    </Label>
                    <Input type="number" id="seuil-alerte" className="w-16" defaultValue="5" />
                    <Select defaultValue="pieces">
                        <SelectTrigger className="w-16">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pieces">pcs</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 mt-6">
                    <h3 className="font-medium">En cas de rupture de stock:</h3>

                    <RadioGroup defaultValue="refuser">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="refuser" id="refuser" />
                            <Label htmlFor="refuser">Refuser les commandes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="accepter" id="accepter" />
                            <Label htmlFor="accepter">Accepter les commandes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="defaut" id="defaut" />
                            <Label htmlFor="defaut">Utiliser le comportement par défaut (Refuser les commandes)</Label>
                        </div>
                    </RadioGroup>

                    <div className="flex items-center">
                        <Button variant="destructive" size="sm" className="gap-1">
                            <FileText className="h-4 w-4" />
                            Edit default behavior
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="valeur1">Valeur personnalisée</Label>
                        <Input id="valeur1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="valeur2">Valeur personnalisée</Label>
                        <Input id="valeur2" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="valeur3">Valeur personnalisée</Label>
                        <div className="flex items-center gap-2">
                            <Input id="valeur3" type="date" />
                            <Button variant="outline" size="icon">
                                <FileText className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
