"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddressSectionProps {
  address: string
  setAddress: (value: string) => void
}

export default function AddressSection({ address, setAddress }: AddressSectionProps) {
  return (
    <div className="mb-6">
      <Label className="text-gray-500 text-sm block mb-2">Adresse</Label>
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}

