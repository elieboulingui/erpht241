"use client"

import { HelpCircle, GripVertical, Trash2 } from "lucide-react"

interface LineItem {
  id: number
  product: string
  quantity: number
  price: number
  tax: number
  total: number
}

interface InvoiceTableProps {
  lineItems: LineItem[]
  onUpdateLineItem: (id: number, field: string, value: string | number) => void
  onDeleteLine: (id: number) => void
}

export default function InvoiceTable({ lineItems, onUpdateLineItem, onDeleteLine }: InvoiceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 w-10"></th>
            <th className="p-2 w-16 text-left">#</th>
            <th className="p-2 text-left">
              <div className="flex items-center">
                Nom Produit
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
              </div>
            </th>
            <th className="p-2 text-left">Quantité</th>
            <th className="p-2 text-left">Prix</th>
            <th className="p-2 text-left">Réduction</th>
            <th className="p-2 text-left">Taxe</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2 text-center">
                <GripVertical className="h-4 w-4 text-gray-400 mx-auto" />
              </td>
              <td className="p-2">{item.id}</td>
              <td className="p-2">
                <input
                  type="text"
                  value={item.product}
                  onChange={(e) => onUpdateLineItem(item.id, "product", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={item.quantity || ""}
                  onChange={(e) => onUpdateLineItem(item.id, "quantity", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={item.price || ""}
                  onChange={(e) => onUpdateLineItem(item.id, "price", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  value={item.tax || ""}
                  onChange={(e) => onUpdateLineItem(item.id, "tax", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2">{item.total.toLocaleString()}</td>
              <td className="p-2 text-center">
                <button onClick={() => onDeleteLine(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

