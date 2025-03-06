"use client"

import { useState } from "react"

export default function ProductSection() {
  const [search, setSearch] = useState("")
  const [quantity, setQuantity] = useState("")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div className="md:col-span-2">
        <label className="text-gray-500 text-sm block mb-2">Rechercher un produit</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-gray-500 text-sm block mb-2">Quantité</label>
          <select value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Sélectionner</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button className="bg-gray-800 text-white px-4 py-2 rounded">Ajouter produit</button>
      </div>
    </div>
  )
}

