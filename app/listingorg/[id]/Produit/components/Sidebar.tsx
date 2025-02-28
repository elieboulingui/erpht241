"use client"

import { useState, useEffect } from "react"
import Link from "next/link"  // Importing Link from Next.js

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("All Catégory")
  const [orgId, setOrgId] = useState<string | null>(null)

  // Function to extract orgId from URL using regex
  const extractOrgIdFromUrl = (url: string) => {
    const regex = /\/listingorg\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  useEffect(() => {
    // Get the current URL (this could be a more specific method depending on your setup)
    const currentUrl = window.location.pathname;
    const id = extractOrgIdFromUrl(currentUrl);
    setOrgId(id);
  }, [])

  const menuItems = [
    { name: "Catégories", route:`/listingorg/${orgId}/produit/stock`  }, // Dynamically include orgId
    { name: "Stock", route: `/listingorg/${orgId}/produit`  }
  ]

  return (
    <div className={`w-36 bg-white p-4 flex flex-col space-y-4 border-r-2 border-gray-300 ${className}`}>
      {menuItems.map((item) => (
        <Link key={item.name} href={item.route} passHref>
          <>
            <button
              className={`py-2 text-center text-black transition-colors w-full  ${
                activeItem === item.name ? "bg-gray-300" : "hover:bg-gray-300"
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              {item.name}
            </button>
          </>
        </Link>
      ))}
    </div>
  )
}
