"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ProductSection() {
  const [search, setSearch] = useState("")
  const [quantity, setQuantity] = useState("")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div className="md:col-span-2">
        <Label className="text-gray-500 text-sm block mb-2">Rechercher un produit</Label>
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className="text-gray-500 text-sm block mb-2">Quantité</Label>
     
          <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <Button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">Ajouter produit</Button>
      </div>
    </div>
  )
}

