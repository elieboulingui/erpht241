"use client"

import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

export default function DashboardAnalytics() {
  const data = [
    { jour: 1, popularite: 0, vente: 0 },
    { jour: 2, popularite: 0, vente: 0 },
    { jour: 4, popularite: 0, vente: 0 },
    { jour: 6, popularite: 0, vente: 0 },
    { jour: 8, popularite: 0, vente: 0 },
    { jour: 10, popularite: 0, vente: 0 },
  ]

  const ventesData = [
    { date: "09/04/2025", commande: 5, client: 1, quantite: 2, prix: "20.000 XFA" },
    { date: "09/04/2025", commande: 6, client: 2, quantite: 6, prix: "60.000 XFA" },
  ]

  return (
    <div className="">
      <h2 className="text-lg font-medium mb-4">Affiche encadrée The adventure begins - Détails</h2>

      <div className="grid grid-cols-12 ">
        {/* Graph section - 9 columns */}
        <div className="col-span-9 relative">
      

          {/* Chart */}
          <div className="h-[250px] w-full">

                {/* Legend */}
          <div className="absolute top-0 right-60 flex items-center gap-4 z-10">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#7f1d1c]"></div>
              <span className="text-sm">Popularité</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#f8d7da]"></div>
              <span className="text-sm">Vente</span>
            </div>
          </div>
            <LineChart width={600} height={250} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid />
              <XAxis dataKey="jour" domain={[1, 10]} ticks={[1, 2, 4, 6, 8, 10]} />
              <YAxis domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} />
              <Line
                type="monotone"
                dataKey="popularite"
                stroke="#7f1d1c"
                strokeWidth={2}
                dot={{ r: 5, fill: "#7f1d1c" }}
              />
              <Line
                type="monotone"
                dataKey="vente"
                stroke="#f8d7da"
                strokeWidth={2}
                dot={{ r: 5, fill: "#f8d7da", stroke: "#f8d7da" }}
              />
            </LineChart>
          </div>
        </div>

        {/* Stats section - 3 columns */}
        <div className="col-span-3">
          <ul className="list-none space-y-1 mb-4">
            <li className="text-sm">• Total des ventes 0</li>
            <li className="text-sm">• Ventes (sans taxe) 0,00 €</li>
            <li className="text-sm">• Total consulté 0</li>
            <li className="text-sm">• Taux de transformation 0.00</li>
          </ul>

            <Button variant="outline" size="sm" className="border border-[#7f1d1c] text-[#7f1d1c] p-5 font-bold hover:bg-transparent hover:text-[#7f1d1c] ">
    
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Exporter CSV</span>
          </Button>
        </div>
      </div>

      {/* Ventes table */}
      <div className="mt-8">
        <h3 className="text-base font-medium mb-2">Ventes</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-t border-b border-gray-200">
              <th className="py-2 px-4 text-left font-medium">Date</th>
              <th className="py-2 px-4 text-left font-medium">Commande</th>
              <th className="py-2 px-4 text-left font-medium">Client</th>
              <th className="py-2 px-4 text-left font-medium">Quantité</th>
              <th className="py-2 px-4 text-left font-medium">Prix</th>
            </tr>
          </thead>
          <tbody>
            {ventesData.map((vente, index) => (
              <tr key={index} className="border-t border-b border-gray-200">
                <td className="py-2 px-4">{vente.date}</td>
                <td className="py-2 px-4">{vente.commande}</td>
                <td className="py-2 px-4">{vente.client}</td>
                <td className="py-2 px-4">{vente.quantite}</td>
                <td className="py-2 px-4">{vente.prix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
