"use client"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PrixFournisseur() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Prix des fournisseurs</h2>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Rechercher un fournisseur" className="pl-8" />
          </div>

          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Ajouter un fournisseur
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Devise</TableHead>
              <TableHead>Prix unitaire (HT)</TableHead>
              <TableHead>Quantité minimale</TableHead>
              <TableHead>Délai de livraison</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Aucun fournisseur associé à ce produit
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="border rounded-md p-6">
          <h3 className="text-lg font-medium mb-4">Ajouter un nouveau fournisseur</h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fournisseur">Fournisseur</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fournisseur1">Fournisseur 1</SelectItem>
                    <SelectItem value="fournisseur2">Fournisseur 2</SelectItem>
                    <SelectItem value="fournisseur3">Fournisseur 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Référence fournisseur</Label>
                <Input id="reference" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prix">Prix unitaire (HT)</Label>
                <div className="flex items-center gap-2">
                  <Input id="prix" type="number" className="w-32" />
                  <Select defaultValue="eur">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="EUR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantite-min">Quantité minimale</Label>
                <Input id="quantite-min" type="number" defaultValue="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delai">Délai de livraison (jours)</Label>
                <Input id="delai" type="number" />
              </div>

              <div className="pt-6">
                <Button>Ajouter le fournisseur</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
