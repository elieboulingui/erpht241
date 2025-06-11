"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Building2, Package } from "lucide-react"
import MetricsCard from "./MetricsCard"
import ActivityChart from "./ActivityChart"


export default function LeadGenerationSection() {
  return (
    <Card className="border border-white  p-6">
      <CardHeader className="bg-[#7a1419] text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Génération de leads</CardTitle>
            <CardDescription className="text-white/80">
              Nouveaux contacts ajoutés dans la base de données
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 ">
        {/* Métriques principales */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <MetricsCard title="Personnes" value={3} icon={Users} trend="+12% ce mois" variant="primary" />
          <MetricsCard title="Compagnies" value={0} icon={Building2} trend="Aucune nouvelle" variant="secondary" />
          <MetricsCard title="Grossistes" value={0} icon={Package} trend="Aucun nouveau" variant="secondary" />
        </div>

        {/* Graphique */}
        <ActivityChart />
      </CardContent>
    </Card>
  )
}
