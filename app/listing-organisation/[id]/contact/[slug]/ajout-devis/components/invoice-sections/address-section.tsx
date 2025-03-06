"use client"

interface AddressSectionProps {
  address: string
  setAddress: (value: string) => void
}

export default function AddressSection({ address, setAddress }: AddressSectionProps) {
  return (
    <div className="mb-6">
      <label className="text-gray-500 text-sm block mb-2">Adresse</label>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />
    </div>
  )
}

