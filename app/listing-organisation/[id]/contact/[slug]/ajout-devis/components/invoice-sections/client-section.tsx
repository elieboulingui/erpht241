"use client"

import { HelpCircle } from "lucide-react"

interface ClientSectionProps {
  client: string
  setClient: (value: string) => void
}

export default function ClientSection({ client, setClient }: ClientSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label className="text-gray-500 text-sm">Client</label>
        <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
      </div>
      <input
        type="text"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}

