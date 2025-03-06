"use client"

import { HelpCircle } from "lucide-react"

interface TermsSectionProps {
  terms: string
  setTerms: (value: string) => void
}

export default function TermsSection({ terms, setTerms }: TermsSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <label className="text-gray-500 text-sm">Termes</label>
        <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
      </div>
      <select value={terms} onChange={(e) => setTerms(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Sélectionner</option>
        <option value="net15">Net 15</option>
        <option value="net30">Net 30</option>
        <option value="net45">Net 45</option>
        <option value="net60">Net 60</option>
      </select>
    </div>
  )
}

