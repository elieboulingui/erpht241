"use client"

import { useRef, useEffect } from "react"
import { Check, EyeOff, Slash } from "lucide-react"

interface ColorPickerMenuProps {
  position: { top: number; left: number }
  onSelectColor: (color: string) => void
  onClose: () => void
  currentColor?: string
}

export function ColorPickerMenu({ position, onSelectColor, onClose, currentColor }: ColorPickerMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Couleurs unies
  const solidColors = [
    { name: "transparent", value: "bg-white border border-gray-400", icon: <EyeOff className="h-4 w-4 text-gray-600" />, selected: currentColor === "bg-white border border-gray-400" },
    { name: "peach", value: "bg-[#F4A698]", selected: currentColor === "bg-[#F4A698]" },
    { name: "orange-light", value: "bg-[#F7C5A3]", selected: currentColor === "bg-[#F7C5A3]" },
    { name: "yellow-light", value: "bg-[#F8E7AC]", selected: currentColor === "bg-[#F8E7AC]" },
    { name: "mint-light", value: "bg-[#D3E8D4]", selected: currentColor === "bg-[#D3E8D4]" },
    { name: "teal-light", value: "bg-[#B7E1E3]", selected: currentColor === "bg-[#B7E1E3]" },
    { name: "blue-light", value: "bg-[#A6CADF]", selected: currentColor === "bg-[#A6CADF]" },
    { name: "blue-medium", value: "bg-[#BCD1E6]", selected: currentColor === "bg-[#BCD1E6]" },
    { name: "purple-light", value: "bg-[#D6C7E0]", selected: currentColor === "bg-[#D6C7E0]" },
    { name: "beige-light", value: "bg-[#E8DED6]", selected: currentColor === "bg-[#E8DED6]" },
    { name: "gray-light", value: "bg-[#E7E7E7]", selected: currentColor === "bg-[#E7E7E7]" },
  ]

  // Motifs et textures (à partir de l'image fournie)
  const patternColors = [
    { name: "no-pattern", value: "bg-white border border-gray-400", icon: <Slash className="h-4 w-4 text-gray-600" />, selected: currentColor === "bg-white border border-gray-400" },
    { name: "nature", value: "bg-[url('/image.png')] bg-[0px_0px] bg-cover", selected: false },
    { name: "waves", value: "bg-[url('/image.png')] bg-[-40px_0px] bg-cover", selected: false },
    { name: "coral", value: "bg-[url('/image.png')] bg-[-80px_0px] bg-cover", selected: false },
    { name: "tree", value: "bg-[url('/image.png')] bg-[-120px_0px] bg-cover", selected: false },
    { name: "blue-sky", value: "bg-[url('/image.png')] bg-[-160px_0px] bg-cover", selected: false },
    { name: "parasol", value: "bg-[url('/image.png')] bg-[-200px_0px] bg-cover", selected: false },
    { name: "fireworks", value: "bg-[url('/image.png')] bg-[-240px_0px] bg-cover", selected: false },
  ]

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg p-3"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Première rangée : couleurs unies */}
      <div className="grid grid-cols-11 gap-2 mb-2">
        {solidColors.map((color) => (
          <button
            key={color.name}
            className={`${color.value} h-8 w-8 rounded-full flex items-center justify-center relative hover:ring-2 hover:ring-gray-400 transition-all`}
            onClick={() => onSelectColor(color.value)}
            aria-label={`Couleur ${color.name}`}
          >
            {color.icon}
            {color.selected && (
              <div className="absolute -top-1 -left-1 bg-purple-600 rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Deuxième rangée : motifs */}
      <div className="grid grid-cols-8 gap-2">
        {patternColors.map((pattern) => (
          <button
            key={pattern.name}
            className={`${pattern.value} h-8 w-8 rounded-full flex items-center justify-center relative hover:ring-2 hover:ring-gray-400 transition-all`}
            onClick={() => onSelectColor(pattern.value)}
            aria-label={`Motif ${pattern.name}`}
          >
            {pattern.icon}
            {pattern.selected && (
              <div className="absolute -top-1 -left-1 bg-purple-600 rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
