"use client"

import { DateCreation } from "@/components/ui/dateCreation"
import { Label } from "@/components/ui/label"

interface DateSectionProps {
  label: string
  date: string
  setDate: (value: string) => void
}

export default function CreationDate({ label, date, setDate }: DateSectionProps) {
  return (
    <div className="mb-6">
      <Label className="text-gray-500 text-sm block mb-2">{label}</Label>
      <DateCreation/>
    </div>
  )
}

