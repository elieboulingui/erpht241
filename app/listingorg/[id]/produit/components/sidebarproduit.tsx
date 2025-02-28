"use client"

import { useState } from "react"

interface SidebarProps {
  className?: string
}

export default function Sidebasr({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("All Catégory")

  const menuItems = ["All Catégory", "Catégory", "Stock"]

  return (
    <div className={`w-36 bg-gray-200 p-4 flex flex-col space-y-4 ${className}`}>
      {menuItems.map((item) => (
        <button
          key={item}
          className={`py-2 text-center transition-colors ${activeItem === item ? "bg-gray-300" : "hover:bg-gray-300"}`}
          onClick={() => setActiveItem(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}