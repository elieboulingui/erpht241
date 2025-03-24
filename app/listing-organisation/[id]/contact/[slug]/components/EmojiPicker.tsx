"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface Position {
  top: number
  left: number
}

interface EmojiPickerProps {
  position: Position
  onSelectEmoji: (emoji: string) => void
  onClose: () => void
}

export function EmojiPicker({ position, onSelectEmoji, onClose }: EmojiPickerProps) {
  // Liste d'emojis populaires
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "⭐",
    "🎉",
    "✅",
    "❌",
    "⚠️",
    "💯",
  ]

  // Empêcher la propagation du clic à l'intérieur
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      className="absolute shadow-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
        zIndex: 10000,
      }}
      onClick={handleCardClick}
    >
      <CardContent className="p-2">
        <div className="grid grid-cols-5 gap-2">
          {emojis.map((emoji, index) => (
            <button key={index} className="text-xl hover:bg-gray-100 rounded p-1" onClick={() => onSelectEmoji(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

