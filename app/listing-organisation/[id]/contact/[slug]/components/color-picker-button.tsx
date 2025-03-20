import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { PawPrint } from "lucide-react"

interface ColorPickerButtonProps {
  className?: string
  disabled?: boolean
}

export function ColorPickerButton({ className, disabled = false }: ColorPickerButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild disabled={disabled}>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${className || ""}`} disabled={disabled}>
            <PawPrint className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Couleur</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

