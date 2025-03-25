"use client"

import { HelpCircle, GripVertical, Trash2 } from "lucide-react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 p-2"></TableHead>
            <TableHead className="w-16 p-2">#</TableHead>
            <TableHead className="p-2">
              <div className="flex items-center">
                Nom Produit
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nom du produit ou service</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableHead>
            <TableHead className="p-2">Quantité</TableHead>
            <TableHead className="p-2">Prix</TableHead>
            <TableHead className="p-2">Réduction</TableHead>
            <TableHead className="p-2">Taxe</TableHead>
            <TableHead className="p-2">Total</TableHead>
            <TableHead className="w-10 p-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="p-2 text-center">
                <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
              </TableCell>
              <TableCell className="p-2">{item.id}</TableCell>
              <TableCell className="p-2">
                <Input
                  type="text"
                  value={item.product}
                  onChange={(e) => onUpdateLineItem(item.id, "product", e.target.value)}
                />
              </TableCell>
              <TableCell className="p-2">
                <Input
                  type="number"
                  value={item.quantity || ""}
                  onChange={(e) => onUpdateLineItem(item.id, "quantity", e.target.value)}
                />
              </TableCell>
              <TableCell className="p-2">
                <Input
                  type="number"
                  value={item.price || ""}
                  onChange={(e) => onUpdateLineItem(item.id, "price", e.target.value)}
                />
              </TableCell>
              <TableCell className="p-2">
                <Input
                  type="number"
                  value={item.tax || ""}
                  onChange={(e) => onUpdateLineItem(item.id, "tax", e.target.value)}
                />
              </TableCell>
              <TableCell className="p-2">{item.total.toLocaleString()}</TableCell>
              <TableCell className="p-2 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteLine(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}