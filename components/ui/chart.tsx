"use client"

import * as React from "react"
import { ChartContainer as ChartContainerPrimitive } from "@/components/ui/chart/chart-container"
import { ChartTooltip as ChartTooltipPrimitive } from "@/components/ui/chart/chart-tooltip"
import { ChartTooltipContent as ChartTooltipContentPrimitive } from "@/components/ui/chart/chart-tooltip-content"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export const ChartContainer = ChartContainerPrimitive
export const ChartTooltip = ChartTooltipPrimitive
export const ChartTooltipContent = ChartTooltipContentPrimitive


export type ChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
    formatter?: (value: number) => string;
  };
};

export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
}
