"use client"

import { useState } from "react"
import {
  Search,
  Calendar,
  Bell,
  Plus,
  Home,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  BarChart2,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "@/components/ui/chart"

// Données des ventes mensuelles
const donneesMensuelles = [
  { mois: "Jan", ventes: 32000000, profit: 8000000 },
  { mois: "Fév", ventes: 38000000, profit: 9500000 },
  { mois: "Mar", ventes: 35000000, profit: 8750000 },
  { mois: "Avr", ventes: 40000000, profit: 10000000 },
  { mois: "Mai", ventes: 45000000, profit: 11250000 },
  { mois: "Juin", ventes: 42000000, profit: 10500000 },
  { mois: "Juil", ventes: 48000000, profit: 12000000 },
  { mois: "Août", ventes: 44000000, profit: 11000000 },
  { mois: "Sep", ventes: 46000000, profit: 11500000 },
  { mois: "Oct", ventes: 43000000, profit: 10750000 },
  { mois: "Nov", ventes: 47000000, profit: 11750000 },
  { mois: "Déc", ventes: 50000000, profit: 12500000 },
]

// Données pour le graphique circulaire
const donneesAnalytics = [
  { name: "Profit", value: 35, color: "#f97316" },
  { name: "Dépenses", value: 25, color: "#818cf8" },
  { name: "Investissement", value: 40, color: "#06b6d4" },
]

// Données des produits les plus vendus
const produitsPopulaires = [
  { nom: "MacBook Air M2", code: "MBA-M2", ventes: 3879 },
  { nom: "Sony WH-1000XM4", code: "SNY-WH4", ventes: 3158 },
  { nom: "HP Pavilion", code: "HP-PAV", ventes: 2672 },
  { nom: "Canon PIXMA", code: "CN-PIX", ventes: 2498 },
  { nom: "Dell XPS 13", code: "DL-XPS", ventes: 2124 },
]

export default function Statistiques() {
  const [periodeFiltre, setPeriodeFiltre] = useState("Annuel")

  // Formater le prix en FCFA
  const formatPrice = (price:any) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
  }

  return (

        <div className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Gabin, Statistiques</h1>
            <Select value={periodeFiltre} onValueChange={setPeriodeFiltre}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Quotidien">Quotidien</SelectItem>
                <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                <SelectItem value="Mensuel">Mensuel</SelectItem>
                <SelectItem value="Annuel">Annuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-orange-500"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(45400000)}</div>
                <p className="text-xs text-green-500 flex items-center">+10.5% depuis hier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Ventes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,213</div>
                <p className="text-xs text-green-500 flex items-center">+27.1% depuis hier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-orange-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">374</div>
                <p className="text-xs text-green-500 flex items-center">+14.6% depuis hier</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Purchase Overview Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Aperçu des Ventes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={donneesMensuelles}>
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip formatter={(value:any) => new Intl.NumberFormat("fr-FR").format(value) + " FCFA"} />
                      <Legend />
                      <Line type="monotone" dataKey="ventes" stroke="#f97316" name="Ventes" strokeWidth={2} />
                      <Line type="monotone" dataKey="profit" stroke="#22c55e" name="Profit" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donneesAnalytics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {donneesAnalytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Produits Populaires</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir tous</DropdownMenuItem>
                    <DropdownMenuItem>Exporter</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {produitsPopulaires.map((produit) => (
                    <div key={produit.code} className="flex items-center">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{produit.nom}</p>
                        <p className="text-sm text-muted-foreground">{produit.code}</p>
                      </div>
                      <div className="text-sm font-medium">{produit.ventes} ventes</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

  )
}

