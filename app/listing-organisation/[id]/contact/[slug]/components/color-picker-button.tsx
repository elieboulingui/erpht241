"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Palette } from "lucide-react"
import { IconButton } from "./icon-button"
import { ColorPickerMenu } from "./ColorPickerMenu"

interface ColorPickerButtonProps {
  onSelectColor?: (color: string) => void
  currentColor?: string
  disabled?: boolean
}

export function ColorPickerButton({ onSelectColor, currentColor, disabled = false }: ColorPickerButtonProps) {
  const [showColorMenu, setShowColorMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 150, // Centrer approximativement
      })
    }

    setShowColorMenu(true)
  }

  const handleColorSelect = (color: string) => {
    if (onSelectColor) {
      onSelectColor(color)
    }
    setShowColorMenu(false)
  }

  return (
    <>
      <IconButton
        ref={buttonRef}
        icon={Palette}
        name="Modifier la couleur"
        onClick={handleButtonClick}
        disabled={disabled}
      />

      {showColorMenu && (
        <ColorPickerMenu
          position={menuPosition}
          onSelectColor={handleColorSelect}
          onClose={() => setShowColorMenu(false)}
          currentColor={currentColor}
        />
      )}
    </>
  )
}

