"use client"

import { Badge } from "@/components/ui/badge"

interface ContactItemProps {
  name: string
  visits: number
  icon: string
  trend: string
  variant?: "high" | "low"
}

export default function ContactItem({ name, visits, icon, trend, variant = "high" }: ContactItemProps) {
  const isHigh = variant === "high"

  return (
    <div className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] border border-gray-100">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold ${
            isHigh ? "bg-gradient-to-br from-[#591112] to-[#7a1419]" : "bg-gradient-to-br from-gray-400 to-gray-500"
          }`}
        >
          {icon}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <div className="flex items-center gap-2">
            <Badge
              variant={isHigh ? "secondary" : "outline"}
              className={isHigh ? "bg-green-100 text-green-700 hover:bg-green-100" : "border-gray-300 text-gray-500"}
            >
              {trend}
            </Badge>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-2xl font-bold ${isHigh ? "text-[#591112]" : "text-gray-400"}`}>{visits}</p>
        <p className="text-sm text-gray-500">visites</p>
      </div>
    </div>
  )
}
