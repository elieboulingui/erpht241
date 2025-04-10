"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Link,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    ImageIcon,
    Plus,
} from "lucide-react"

export default function SettingsPanel() {
    const [activeTab, setActiveTab] = useState("general")

    return (
        <div className="w-full  bg-white">
            <Tabs defaultValue="general" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto p-0 bg-transparent border-b border-gray-200">
                    <TabsTrigger
                        value="general"
                        className={`py-3  rounded-none border-b-2 ${activeTab === "general" ? "border-black text-[#7f1d1c] font-medium" : "border-transparent text-gray-600"}`}
                    >
                        Paramètres généraux
                    </TabsTrigger>
                    <TabsTrigger
                        value="maintenance"
                        className={`py-3  rounded-none border-b-2 ${activeTab === "maintenance" ? "border-black text-[#7f1d1c] font-medium" : "border-transparent text-gray-600"}`}
                    >
                        Maintenance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="pt-6 px-4">
                    <div className="space-y-6">
                        <SettingItem
                            title="Activer le SSL"
                            description="Si vous possédez un certificat SSL associé à votre nom de domaine, vous pouvez activer le cryptage SSL (https://) pour sécuriser les données et le contenu du site."
                        />

                        <SettingItem
                            title="Activer le SSL sur tout le site"
                            description="Si cette option est activée, toutes les pages de votre boutique seront sécurisées par votre certificat SSL."
                        />

                        <SettingItem
                            title="Améliorer la sécurité du front-office"
                            description="Active ou désactive les scripts inutiles au front-office afin d'améliorer la sécurité (JBP)"
                            defaultChecked={false}
                        />

                        <SettingItem
                            title="Autoriser les thèmes dans les champs HTML"
                            description="Autoriser les thèmes dans les champs texte de la fiche produit (comme la description). Nous recommandons de laisser cette option désactivée."
                        />
                    </div>
                </TabsContent>

                <TabsContent value="maintenance" className="pt-6 px-4">
                    <div className="grid gap-6">
                        {/* Activer la boutique */}
                        <div className="grid grid-cols-12 items-start">
                            <div className="col-span-3 flex items-start">
                                <span className="text-red-700 mr-1">*</span>
                                <p className="text-sm font-medium">Activer la boutique</p>
                            </div>
                            <div className="col-span-9 ml-20">
                                <div className="flex items-center">
                                    <Switch
                                        defaultChecked={true}
                                        className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c] mr-2"
                                    />
                                    <p className="text-sm font-medium">Oui</p>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Nous vous recommandons de désactiver votre boutique pendant que vous effectuez la maintenance.
                                    Notez que ces administrateurs ont toujours accès à votre boutique.
                                </p>
                            </div>
                        </div>

                        {/* Accès pour les adresses connectées */}
                        <div className="grid grid-cols-12 items-start">
                            <div className="col-span-3">
                                <p className="text-sm font-medium">Activer l'accès à la boutique pour les adresses connectées</p>
                            </div>
                            <div className="col-span-9 ml-20">
                                <div className="flex items-center">
                                    <Switch
                                        defaultChecked={true}
                                        className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c] mr-2"
                                    />
                                    <p className="text-sm font-medium">Oui</p>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Lorsque la fonction est activée, les administrateurs peuvent accéder au front-office de la
                                    boutique sans que leur adresse IP ne soit enregistrée.
                                </p>
                            </div>
                        </div>

                        {/* IP de maintenance */}
                        <div className="grid grid-cols-12 items-start">
                            <div className="col-span-3">
                                <p className="text-sm font-medium">IP de maintenance</p>
                            </div>
                            <div className="col-span-9 ml-20">
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm" 
                                    />
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="border border-[#7f1d1c] text-[#7f1d1c] font-bold hover:bg-transparent hover:text-[#7f1d1c]"
                                    >
                                        <Plus color="#7f1d1c" className="h-4 w-4 rounded-full border border-[#7f1d1c] mr-1" />
                                        Ajouter mon IP
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Autoriser l'accès à vos adresses IP en mode maintenance. Utilisez une virgule pour les séparer
                                    (exemple: 42.24.4.2,127.0.0.1,99.98.97.96)
                                </p>
                            </div>
                        </div>

                        {/* Message de maintenance */}
                        <div className="grid grid-cols-12 items-start">
                            <div className="col-span-3 flex items-start">
                                <span className="text-red-700 mr-1">*</span>
                                <p className="text-sm font-medium">Message de maintenance personnalisé</p>
                            </div>
                            <div className="col-span-9 ml-20">
                                <div className="border border-gray-300 rounded-md">
                                    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100"
                                        >
                                            {"<>"}
                                        </Button>
                                        {[
                                            Bold,
                                            Italic,
                                            Underline,
                                            Strikethrough,
                                            Link,
                                            List,
                                            ListOrdered,
                                            AlignLeft,
                                            AlignCenter,
                                            AlignRight,
                                            ImageIcon,
                                        ].map((Icon, index) => (
                                            <Button
                                                key={index}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100"
                                            >
                                                <Icon className="h-4 w-4" />
                                            </Button>
                                        ))}
                                        <div className="ml-auto">
                                            <select className="h-8 text-xs border border-gray-300 rounded-md px-2">
                                                <option>Paragraphe</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50">
                                        <p className="text-sm text-gray-700">
                                            Nous mettons actuellement notre boutique à jour et serons de retour très bientôt. Merci de votre
                                            patience.
                                        </p>
                                    </div>
                                    <div className="p-2 border-t border-gray-200 text-xs text-gray-500 text-right">
                                        60 sur 2 844 caractères autorisés
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

interface SettingItemProps {
    title: string
    description: string
    defaultChecked?: boolean
    labelPosition?: "left" | "right"
}

function SettingItem({ title, description, defaultChecked = true, labelPosition = "left" }: SettingItemProps) {
    return (
        <div className={`flex items-start ${labelPosition === "right" ? "flex-row-reverse justify-end" : ""}`}>
            <div className={`${labelPosition === "right" ? "ml-4" : "mr-4"}`}>
                <Switch
                    defaultChecked={defaultChecked}
                    className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c]"
                />
            </div>
            <div className="flex-1 ml-3">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
            </div>
        </div>
    )
}