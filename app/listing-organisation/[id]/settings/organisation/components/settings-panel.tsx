'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrganisationForm() {
    const [logo, setLogo] = useState<string | null>(null);
    const [enableLogo, setEnableLogo] = useState(false);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <form className="max-w-4xl  p-6 space-y-6">
            {/* Nom de l'organisation */}
            <div className="space-y-2">
                <Label className="font-medium text-sm">Nom de l'organisation :</Label>
                <Input defaultValue="NAS" />
            </div>

            {/* Logo */}
            <div className="space-y-2">
                <Label className="font-medium text-sm">Logo de l'organisation :</Label>
                <div className="flex items-center gap-4">
                    <Input type="file" onChange={handleLogoChange} className="w-auto" />
                </div>
            </div>

            {/* Activer Logo */}
            <div className="flex items-center gap-4">
                <Switch 
                    checked={enableLogo} 
                    onCheckedChange={setEnableLogo}
                    id="afficher-fiche"
                    className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c]"
                />
                <Label htmlFor="afficher-fiche">Active Logo</Label>
            </div>

            {/* Type d'organisation */}
            <div className="space-y-2">
                <Label className="font-medium text-sm">Type d'organisation</Label>
                <Select defaultValue="SARL">
                    <SelectTrigger>
                        <SelectValue>S.A.R.L</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SARL">S.A.R.L</SelectItem>
                        <SelectItem value="SA">S.A</SelectItem>
                        <SelectItem value="ONG">ONG</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Type de domaine */}
            <div className="space-y-2">
                <Label className="font-medium text-sm">Type de domaine</Label>
                <Select defaultValue="numerique">
                    <SelectTrigger>
                        <SelectValue>Numérique</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="numerique">Numérique</SelectItem>
                        <SelectItem value="santé">Santé</SelectItem>
                        <SelectItem value="éducation">Éducation</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Langue */}
            <div className="space-y-2">
                <Label className="font-medium text-sm">Langue</Label>
                <Select defaultValue="fr">
                    <SelectTrigger>
                        <SelectValue>Français</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Enregistrer */}
            <div className="pt-4">
                <Button type="submit" className="bg-red-800 hover:bg-red-700 text-white">
                    Enregistrée
                </Button>
            </div>
        </form>
    );
}