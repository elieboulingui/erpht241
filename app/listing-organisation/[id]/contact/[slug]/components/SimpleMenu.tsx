"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface SimpleMenuProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function SimpleMenu({ title, isOpen, onClose, children }: SimpleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <Card ref={menuRef} className="w-64 p-4 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        {children}
      </Card>
    </div>
  )
}

