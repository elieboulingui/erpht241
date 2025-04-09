"use client"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Vente() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Vente</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prix-ht">Prix HT</Label>
              <div className="flex items-center gap-2">
                <Input id="prix-ht" type="number" className="w-32" defaultValue="19.99" />
                <span>€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix-ttc">Prix TTC</Label>
              <div className="flex items-center gap-2">
                <Input id="prix-ttc" type="number" className="w-32" defaultValue="23.99" />
                <span>€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taux-tva">Taux de TVA</Label>
              <Select defaultValue="standard">
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Taux standard (20%)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Taux standard (20%)</SelectItem>
                  <SelectItem value="reduit">Taux réduit (5.5%)</SelectItem>
                  <SelectItem value="intermediaire">Taux intermédiaire (10%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prix-unitaire">Prix unitaire</Label>
              <div className="flex items-center gap-2">
                <Input id="prix-unitaire" type="number" className="w-32" defaultValue="19.99" />
                <span>€ / pièce</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="prix-specifique">Prix spécifique</Label>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Info className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex justify-between mb-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <span className="text-xs">+</span>
                    Ajouter un prix spécifique
                  </Button>

                  <Button variant="outline" size="sm">
                    Gérer les priorités
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500 py-4">Aucun prix spécifique défini</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="prix-degressif">Prix dégressif par quantité</Label>
                <Switch id="prix-degressif" />
              </div>

              <div className="border rounded-md p-4">
                <div className="flex justify-between mb-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <span className="text-xs">+</span>
                    Ajouter une règle de prix dégressif
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500 py-4">Aucune règle de prix dégressif définie</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="afficher-prix">Afficher le prix</Label>
            <Switch id="afficher-prix" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="disponible-vente">Disponible à la vente</Label>
            <Switch id="disponible-vente" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select defaultValue="new">
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Neuf" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Neuf</SelectItem>
                <SelectItem value="used">Occasion</SelectItem>
                <SelectItem value="refurbished">Reconditionné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frais-port">Frais de port</Label>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="frais-standard" />
                <Label htmlFor="frais-standard">Frais de port standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gratuit" id="frais-gratuit" />
                <Label htmlFor="frais-gratuit">Frais de port gratuits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specifique" id="frais-specifique" />
                <Label htmlFor="frais-specifique">Frais de port spécifiques</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
