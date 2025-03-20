"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { LucideIcon } from "lucide-react"

interface IconButtonProps {
  icon: LucideIcon
  name: string
  onClick?: (e: React.MouseEvent) => void
  className?: string
  disabled?: boolean
}

export function IconButton({ icon: Icon, name, onClick, className, disabled = false }: IconButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild disabled={disabled}>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${className || ""}`}
            onClick={onClick}
            disabled={disabled}
          >
            <Icon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

