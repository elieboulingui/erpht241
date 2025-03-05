"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Importing Link from Next.js

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("All Catégory");
  const [orgId, setOrgId] = useState<string | null>(null);

  // Function to extract orgId from URL using regex
  const extractOrgIdFromUrl = (url: string) => {
    const regex = /\/listing-organisation\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    // Get the current URL (this could be a more specific method depending on your setup)
    const currentUrl = window.location.pathname;
    const id = extractOrgIdFromUrl(currentUrl);
    setOrgId(id);
  }, []);

  const menuItems = [
    { name: "Catégories", route: `/listing-organisation/${orgId}/produit/categorie` },
    { name: "Produits", route: `/listing-organisation/${orgId}/produit` }, // Dynamically include orgId
  ];

  return (
    <div
      className={`w-36 bg-white shadow-lg rounded-lg border-r-2 border-gray-300 p-4 flex flex-col space-y-4 ${className}`}
    >
      {menuItems.map((item) => (
        <Link key={item.name} href={item.route} passHref>
          <>
            <button
              className={`py-2 transition-colors duration-200 ease-in-out w-full text-left rounded-lg ${
                activeItem === item.name
                  ? "bg-gray-300 text-black"
                  
                  : "hover:bg-gray-300 hover:text-black"
              }`}
              onClick={() => setActiveItem(item.name)}
            >
              {item.name}
            </button>
          </>
        </Link>
        
      ))}
    </div>
  );
}
