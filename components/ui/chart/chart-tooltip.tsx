//@ts-nocheck
"use client"

import * as React from "react"
import { type TooltipProps as RechartsTooltipProps, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

export interface ChartTooltipProps<TValue extends object, TName extends string>
  extends Omit<RechartsTooltipProps<TValue, TName>, "content" | "ref" | "defaultIndex"> {
  className?: string
  content?: React.ReactNode
  defaultIndex?: number
}

export function ChartTooltip<TValue extends object, TName extends string>({
  className,
  content,
  defaultIndex,
  ...props
}: ChartTooltipProps<TValue, TName>) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(defaultIndex)

  React.useEffect(() => {
    if (defaultIndex !== undefined) {
      setActiveIndex(defaultIndex)
    }
  }, [defaultIndex])

  return (
    <Tooltip
      {...props}
      content={content}
      cursor={false}
      wrapperClassName={cn("recharts-tooltip-wrapper", className)}
      isAnimationActive={false}
      allowEscapeViewBox={{ x: true, y: true }}
    />
  )
}

