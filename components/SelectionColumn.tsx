"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"

interface SelectionColumnProps<T> {
  onBulkDelete: (ids: string[]) => void
  idAccessor?: keyof T
}

export const selectionColumn = <T extends Record<string, any>>({
  onBulkDelete,
  idAccessor = "id" as keyof T,
}: SelectionColumnProps<T>): ColumnDef<T> => ({
  id: "select",
  header: ({ table }) => (
    <div className="flex items-center">
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-5"
      />
      {table.getSelectedRowModel().rows.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2 h-8 px-2">
              {table.getSelectedRowModel().rows.length} sélectionné(s)
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original[idAccessor] as string)
                onBulkDelete(selectedIds)
                table.resetRowSelection()
              }}
              className="text-destructive bg-[#7f1d1d]"
            >
              Supprimer la sélection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="ml-5"
    />
  ),
  enableSorting: false,
  enableHiding: false,
})