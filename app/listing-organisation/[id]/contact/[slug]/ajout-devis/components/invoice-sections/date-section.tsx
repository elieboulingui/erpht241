"use client"

interface DateSectionProps {
  label: string
  date: string
  setDate: (value: string) => void
}

export default function DateSection({ label, date, setDate }: DateSectionProps) {
  return (
    <div className="mb-6">
      <label className="text-gray-500 text-sm block mb-2">{label}</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" />
    </div>
  )
}

