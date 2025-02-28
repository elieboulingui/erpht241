"use client"

import { X } from "lucide-react"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "./visuallyHidden"

interface ImageZoomDialogProps {
  imageUrl: string
  onClose: () => void
}

export function ImageZoomDialog({ imageUrl, onClose }: ImageZoomDialogProps) {
  return (
    <DialogContent className="max-w-3xl">
      <VisuallyHidden>
        <DialogTitle>Image zoomée</DialogTitle>
      </VisuallyHidden>
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="Image zoomée"
        className="w-full h-auto object-contain max-h-[80vh]"
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
        }}
      />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white/100 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </DialogContent>
  )
}

