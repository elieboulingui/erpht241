"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color?: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  const configKeys = Object.keys(config)

  return (
    <div
      className={cn("chart-container", className)}
      style={
        {
          "--color-count": configKeys.length,
          ...configKeys.reduce<Record<string, string>>((styles, key, index) => {
            if (config[key].color) {
              styles[`--color-${key}`] = config[key].color as string
            }
            styles[`--chart-${index + 1}`] = `var(--color-${key}, hsl(var(--chart-${index + 1})))`
            return styles
          }, {}),
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

