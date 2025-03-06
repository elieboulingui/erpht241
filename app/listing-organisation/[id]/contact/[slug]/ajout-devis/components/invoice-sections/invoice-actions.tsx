"use client"

interface InvoiceActionsProps {
  onAddLine: () => void
  onDeleteAllLines: () => void
}

export default function InvoiceActions({ onAddLine, onDeleteAllLines }: InvoiceActionsProps) {
  return (
    <div className="flex gap-4">
      <button onClick={onAddLine} className="border border-gray-300 bg-white px-4 py-2 rounded text-sm">
        Ajouter une ligne
      </button>
      <button onClick={onDeleteAllLines} className="border border-gray-300 bg-white px-4 py-2 rounded text-sm">
        Efface tous les lignes
      </button>
      <button className="border border-gray-300 bg-white px-4 py-2 rounded text-sm">Ajouter sous total</button>
    </div>
  )
}

