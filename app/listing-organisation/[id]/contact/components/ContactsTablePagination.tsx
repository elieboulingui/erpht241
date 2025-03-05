"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ContactsTablePaginationProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  rowsPerPage: number
  setRowsPerPage: (rows: number) => void
}

export function ContactsTablePagination({
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
}: ContactsTablePaginationProps) {
  return (
    <div className="border-t border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Rangée par page</span>
        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue placeholder="50" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Page 1 à 1</span>
        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-l-none"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

