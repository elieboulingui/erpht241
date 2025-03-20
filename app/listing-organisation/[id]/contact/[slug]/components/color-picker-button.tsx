import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { PawPrint } from "lucide-react"

export function ColorPickerButton({ className }: { className?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${className || ""}`}>
          <PawPrint />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Couleur</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

