"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HelpCircle } from "lucide-react"

interface ClientSectionProps {
  client: string
  setClient: (value: string) => void
}

export default function ClientSection({ client, setClient }: ClientSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Label className="text-gray-500 text-sm">Client</Label>
        <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
      </div>
      <Input
        type="text"
        value={client}
        onChange={(e) => setClient(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  )
}

