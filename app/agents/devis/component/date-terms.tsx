"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateTermsProps {
  terms: string
  setTerms: (value: string) => void
  creationDate: string
  setCreationDate: (value: string) => void
  dueDate: string
  setDueDate: (value: string) => void
}

export function DateTerms({ terms, setTerms, creationDate, setCreationDate, dueDate, setDueDate }: DateTermsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <Label htmlFor="termes" className="text-sm font-medium">
              Termes
            </Label>
            <div className="ml-1 text-gray-400">ⓘ</div>
          </div>
          <select
            id="termes"
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          >
            <option value="">Sélectionner</option>
            <option value="net15">Net 15</option>
            <option value="net30">Net 30</option>
            <option value="net45">Net 45</option>
            <option value="net60">Net 60</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="creationDate" className="text-sm font-medium">
            Date de création
          </Label>
          <Input
            id="creationDate"
            type="date"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="dueDate" className="text-sm font-medium">
            Date d'échéance
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

