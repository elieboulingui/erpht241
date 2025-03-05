"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface ContactTagsProps {
  tags: string[]
  onUpdateTags: (tags: string[]) => void
}

export function ContactTags({ tags, onUpdateTags }: ContactTagsProps) {
  const [newTag, setNewTag] = useState("")

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      onUpdateTags([...tags, newTag.trim()])
      setNewTag("")
      e.preventDefault()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="p-6">
      <h2 className="font-medium mb-4">Étiquettes</h2>
      <div className="mb-4">
        <Input
          placeholder="Tapez votre étiquette et appuyez sur Entrée"
          className="text-sm"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className="rounded-sm flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 border-gray-200"
          >
            {tag}
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Supprimer l'étiquette ${tag}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}

