//@ts-nocheck
"use client"

import type * as React from "react"
import type { TooltipProps } from "recharts"

import { cn } from "@/lib/utils"

export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  payload?: TooltipProps["payload"]
  label?: string
  nameKey?: string
  valueKey?: string
  indicator?: "line" | "bar" | "pie" | "scatter"
  hideLabel?: boolean
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  nameKey = "name",
  valueKey = "value",
  indicator = "line",
  hideLabel = false,
  className,
  ...props
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props}>
      {!hideLabel && <div className="border-b px-2 py-1 text-sm font-medium">{label}</div>}
      <div className="px-2 py-1">
        {payload.map((item: any, index: number) => {
          const name = item[nameKey] || item.name
          const value = item[valueKey] || item.value
          const color = item.color || item.fill

          return (
            <div key={index} className="flex items-center justify-between gap-2 text-sm">
              <div className="flex items-center gap-1">
                {indicator === "line" && <div className="h-0.5 w-3 rounded-full" style={{ backgroundColor: color }} />}
                {indicator === "bar" && <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />}
                {indicator === "pie" && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
                {indicator === "scatter" && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
                <span className="text-muted-foreground">{name}</span>
              </div>
              <span className="font-medium">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


