"use client"

import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Target, Sparkles } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const chartData = [
  { date: "Jan 21", value: 45, label: "21 Jan" },
  { date: "Jan 22", value: 78, label: "22 Jan" },
  { date: "Jan 29", value: 92, label: "29 Jan" },
]

export default function ActivityChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#591112]" />
          <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
        </div>
        <Badge variant="secondary" className="bg-[#591112]/10 text-[#591112] hover:bg-[#591112]/20">
          +15% ce mois
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Graphique principal */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(89, 17, 18, 0.15)",
                  padding: "12px 16px",
                }}
                labelStyle={{ color: "#374151", fontWeight: 600, marginBottom: "4px" }}
                formatter={(value: any) => [
                  <span key="value" style={{ color: "#591112", fontWeight: 700 }}>
                    {value} leads
                  </span>,
                  "Génération",
                ]}
              />
              <Bar dataKey="value" fill="#591112" radius={[8, 8, 0, 0]} stroke="#591112" strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métriques détaillées */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#591112]/10 mx-auto mb-2">
              <TrendingUp className="h-5 w-5 text-[#591112]" />
            </div>
            <p className="text-2xl font-bold text-[#591112]">215</p>
            <p className="text-sm text-gray-500">Total leads</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mx-auto mb-2">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">92</p>
            <p className="text-sm text-gray-500">Pic du jour</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mx-auto mb-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">72</p>
            <p className="text-sm text-gray-500">Moyenne</p>
          </div>
        </div>
      </div>
    </div>
  )
}
