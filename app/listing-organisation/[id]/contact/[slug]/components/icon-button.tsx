"use client"

import type React from "react"
import { forwardRef } from "react"

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

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, name, onClick, className, disabled = false }, ref) => {
    // Fonction qui arrête la propagation et appelle le onClick fourni
    const handleClick = (e: React.MouseEvent) => {
      // Arrêter la propagation est CRUCIAL
      e.stopPropagation()

      // Appeler le onClick fourni si disponible
      if (onClick) {
        onClick(e)
      }
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild disabled={disabled}>
            <Button
              ref={ref}
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full hover:bg-gray-100 ${className || ""}`}
              onClick={handleClick}
              disabled={disabled}
              type="button" // Explicitement définir le type pour éviter les soumissions de formulaire
            >
              <Icon className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-black">
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
)

IconButton.displayName = "IconButton"

