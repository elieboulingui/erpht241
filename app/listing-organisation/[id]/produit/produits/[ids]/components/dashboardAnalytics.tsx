"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/DatePickerWithRange"


interface Vente {
  date: string;
  commande: string;
  client: string;
  quantite: number;
  prix: number;
  produit: string;
}

interface MonthlyData {
  month: string;
  quantite: number;
  prix: number;
  transactions: Vente[];
}

// Données brutes de vente
const rawVentesData = [
  { date: "2025-01-15", commande: "CMD-001", client: "Client A", quantite: 12, prix: 1200, produit: "Alpha 7" },
  { date: "2025-01-22", commande: "CMD-007", client: "Client G", quantite: 5, prix: 500, produit: "Alpha 7" },
  { date: "2025-02-20", commande: "CMD-002", client: "Client B", quantite: 8, prix: 800, produit: "Alpha 7" },
  { date: "2025-03-10", commande: "CMD-003", client: "Client C", quantite: -5, prix: -500, produit: "Alpha 7" },
  { date: "2025-03-25", commande: "CMD-008", client: "Client H", quantite: 10, prix: 1000, produit: "Alpha 7" },
  { date: "2025-04-05", commande: "CMD-004", client: "Client D", quantite: 15, prix: 1500, produit: "Alpha 7" },
  { date: "2025-05-12", commande: "CMD-005", client: "Client E", quantite: 10, prix: 1000, produit: "Alpha 7" },
  { date: "2025-05-30", commande: "CMD-009", client: "Client I", quantite: -2, prix: -200, produit: "Alpha 7" },
  { date: "2025-06-18", commande: "CMD-006", client: "Client F", quantite: -3, prix: -300, produit: "Alpha 7" },
  { date: "2025-06-28", commande: "CMD-010", client: "Client J", quantite: 7, prix: 700, produit: "Alpha 7" },
  { date: "2025-07-10", commande: "CMD-011", client: "Client K", quantite: 4, prix: 400, produit: "Alpha 7" },
  { date: "2025-08-15", commande: "CMD-012", client: "Client L", quantite: 6, prix: 600, produit: "Alpha 7" },
  { date: "2025-09-05", commande: "CMD-013", client: "Client M", quantite: 9, prix: 900, produit: "Alpha 7" },
  { date: "2025-10-20", commande: "CMD-014", client: "Client N", quantite: 11, prix: 1100, produit: "Alpha 7" },
  { date: "2025-11-15", commande: "CMD-015", client: "Client O", quantite: 5, prix: 500, produit: "Alpha 7" },
  { date: "2025-12-10", commande: "CMD-016", client: "Client P", quantite: 8, prix: 800, produit: "Alpha 7" },
]

// Créer un ensemble de données pour tous les mois de l'année
// const allMonths = Array.from({ length: 12 }, (_, i) => {
//   const date = new Date(2025, i, 1)
//   const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
//   const monthName = date.toLocaleString('fr-FR', { month: 'long' })
//   return {
//     monthKey,
//     monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1)
//   }
// })


const allMonths = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2025, i, 1);
  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const monthName = date.toLocaleString('fr-FR', { month: 'long' });
  return {
    monthKey,
    monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1)
  };
});

// Préparation des données groupées par mois
const monthlyData = allMonths.reduce((acc, { monthKey, monthName }) => {
  // Trouver toutes les ventes pour ce mois
  const monthVentes = rawVentesData.filter(vente => {
    const date = new Date(vente.date)
    const venteMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return venteMonthKey === monthKey
  })

  // Calculer les totaux
  const quantite = monthVentes.reduce((sum, vente) => sum + vente.quantite, 0)
  const prix = monthVentes.reduce((sum, vente) => sum + vente.prix, 0)

  acc[monthKey] = {
    month: monthName,
    quantite,
    prix,
    transactions: monthVentes
  }

  return acc
}, {} as Record<string, { month: string; quantite: number; prix: number; transactions: typeof rawVentesData }>)



// Tri par ordre chronologique
const chartData = Object.values(monthlyData).sort((a, b) => {
  const monthA = allMonths.find(m => m.monthName === a.month)?.monthKey || ""
  const monthB = allMonths.find(m => m.monthName === b.month)?.monthKey || ""
  return monthA.localeCompare(monthB)
})

export function DashboardAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1),
    to: new Date(2025, 11, 31)
  });

  // Memoized filtered data
  const filteredVentesData = useMemo(() => {
    return rawVentesData.filter(vente => {
      const venteDate = new Date(vente.date);
      return (
        (!dateRange?.from || venteDate >= dateRange.from) &&
        (!dateRange?.to || venteDate <= dateRange.to)
      );
    });
  }, [dateRange]);

  // Memoized monthly data
  const { monthlyData, chartData, totalQuantity } = useMemo(() => {
    const monthly = allMonths.reduce((acc, { monthKey, monthName }) => {
      const monthVentes = filteredVentesData.filter(vente => {
        const date = new Date(vente.date);
        const venteMonthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return venteMonthKey === monthKey;
      });

      const quantite = monthVentes.reduce((sum, vente) => sum + vente.quantite, 0);
      const prix = monthVentes.reduce((sum, vente) => sum + vente.prix, 0);

      acc[monthKey] = {
        month: monthName,
        quantite,
        prix,
        transactions: monthVentes
      };

      return acc;
    }, {} as Record<string, MonthlyData>);

    const sortedData = Object.values(monthly).sort((a, b) => {
      const monthA = allMonths.find(m => m.monthName === a.month)?.monthKey || "";
      const monthB = allMonths.find(m => m.monthName === b.month)?.monthKey || "";
      return monthA.localeCompare(monthB);
    });

    const total = filteredVentesData.reduce((sum, vente) => sum + vente.quantite, 0);

    return {
      monthlyData: monthly,
      chartData: sortedData,
      totalQuantity: total
    };
  }, [filteredVentesData]);

  const handleBarClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload) {
      const month = data.activePayload[0].payload.month;
      setSelectedMonth(selectedMonth === month ? null : month);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Analyse des ventes - Alpha 7</CardTitle>
            <CardDescription>Performance mensuelle - Année 2025</CardDescription>
          </div>
          <DatePickerWithRange 
            date={dateRange}
            onDateChange={setDateRange}
            className="w-[300px]"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Ventes mensuelles</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} onClick={handleBarClick}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} unités`, "Quantité"]}
                    labelFormatter={(label) => `Mois: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="quantite" name="Quantité">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.quantite >= 0 ? "#7f1d1d" : "#ef4444"}
                      />
                    ))}
                    <LabelList
                      dataKey="quantite"
                      position="top"
                      formatter={(value: number) => `${value > 0 ? '+' : ''}${value}`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Aucune donnée disponible pour la période sélectionnée
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Cliquez sur une barre pour afficher les détails du mois
            </p>
          </div>
        </div>

        {/* Month details section */}
        {selectedMonth && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Détail pour {selectedMonth} 2025
            </h3>
            {chartData
              .filter(monthData => monthData.month === selectedMonth)
              .map((monthData) => (
                <div key={monthData.month} className="space-y-3">
                  <h4 className="font-medium">
                    {monthData.month} -
                    <span className={`ml-2 ${monthData.quantite >= 0 ? 'text-[#7f1d1d]' : 'text-[#ef4444]'}`}>
                      {monthData.quantite} unités ({monthData.prix.toLocaleString()} Fcfa)
                    </span>
                  </h4>

                  {monthData.transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                       <table className="min-w-full border rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 text-left">Date</th>
                            <th className="py-2 px-4 text-left">Commande</th>
                            <th className="py-2 px-4 text-left">Client</th>
                            <th className="py-2 px-4 text-right">Quantité</th>
                            <th className="py-2 px-4 text-right">Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthData.transactions.map((vente, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="py-2 px-4">{new Date(vente.date).toLocaleDateString('fr-FR')}</td>
                              <td className="py-2 px-4">{vente.commande}</td>
                              <td className="py-2 px-4">{vente.client}</td>
                              <td className={`py-2 px-4 text-right ${vente.quantite < 0 ? 'text-[#ef4444]' : ''}`}>
                                {vente.quantite > 0 ? `+${vente.quantite}` : vente.quantite}
                              </td>
                              <td className={`py-2 px-4 text-right ${vente.prix < 0 ? 'text-[#ef4444]' : ''}`}>
                                {vente.prix} Fcfa
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-medium">
                          <tr>
                            <td colSpan={3} className="py-2 px-4 text-right">Total:</td>
                            <td className={`py-2 px-4 text-right ${monthData.quantite < 0 ? 'text-[#ef4444]' : ''}`}>
                              {monthData.quantite}
                            </td>
                            <td className={`py-2 px-4 text-right ${monthData.prix < 0 ? 'text-[#ef4444]' : ''}`}>
                              {monthData.prix} Fcfa
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Aucune donnée de vente pour ce mois</p>
                  )}
                </div>
              ))
            }
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {dateRange?.from && dateRange?.to ? (
            `Période: ${dateRange.from.toLocaleDateString('fr-FR')} - ${dateRange.to.toLocaleDateString('fr-FR')}`
          ) : 'Sélectionnez une période'}
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">
            Total: {totalQuantity} unités
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}