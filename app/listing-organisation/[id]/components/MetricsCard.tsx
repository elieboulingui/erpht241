"use client"
import type { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  variant?: "primary" | "secondary"
}

export default function MetricsCard({ title, value, icon: Icon, trend, variant = "secondary" }: MetricsCardProps) {
  const isPrimary = variant === "primary"

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 transition-transform hover:scale-105 ${
        isPrimary ? "bg-gradient-to-br from-[#591112] to-[#7a1419] text-white" : "bg-[#e6e7eb] text-black"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isPrimary ? "text-white/80" : "text-black"}`}>{title}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${isPrimary ? "text-white/60" : "text-black"}`} />
      </div>
      {trend && (
        <div className="relative mt-2 flex items-center gap-1">
          <span className="text-sm">{trend}</span>
        </div>
      )}
    </div>
  )
}
