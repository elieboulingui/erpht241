import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function ColorPickerButton({ className }: { className?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${className || ""}`}>
            <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gray-400" />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Couleur</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

