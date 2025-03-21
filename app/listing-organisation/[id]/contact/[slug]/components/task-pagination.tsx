"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react"

interface TaskPaginationProps {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  setCurrentPage: (page: number) => void
  setRowsPerPage: (rows: number) => void
  totalItems: number
}

export default function TaskPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
  totalItems,
}: TaskPaginationProps) {
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number.parseInt(value))
    setCurrentPage(1) // Reset to first page when changing rows per page
  }

  const startItem = Math.min((currentPage - 1) * rowsPerPage + 1, totalItems)
  const endItem = Math.min(currentPage * rowsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-500">
      <div className="mb-2 sm:mb-0">
        {totalItems === 0
          ? "0 sur 0 ligne(s) sélectionnée(s)."
          : `${startItem}-${endItem} sur ${totalItems} ligne(s) sélectionnée(s).`}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Lignes par page</span>
          <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
            <SelectTrigger className="w-[70px] border-gray-200 bg-white text-gray-900">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <span>
            Page {currentPage} sur {totalPages || 1}
          </span>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="text-gray-500"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="text-gray-500"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="text-gray-500"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

