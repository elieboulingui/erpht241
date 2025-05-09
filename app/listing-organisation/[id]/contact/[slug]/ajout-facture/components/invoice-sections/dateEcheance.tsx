"use client"

import { DateCreation } from "@/components/ui/dateCreation"
import { DateEcheance } from "@/components/ui/dateEcheance"
import { Label } from "@/components/ui/label"

interface DateSectionProps {
  label: string
  date: string
  setDate: (value: string) => void
}

export default function EcheanceDate({ label, date, setDate }: DateSectionProps) {
  return (
    <div className="mb-6">
      <Label className="text-gray-500 text-sm block mb-2">{label}</Label>
      <DateEcheance/>
    </div>
  )
}

