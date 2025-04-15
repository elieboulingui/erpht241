// app/attributs/page.tsx
'use client'

import { useState } from "react"
import { PenIcon, Plus, Sparkles, MoreHorizontal, SlidersHorizontal, ArrowUpDown, User, ShieldCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PaginationGlobal from "@/components/paginationGlobal"
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader"
import { CustomTabs } from "@/components/CustomTabs"

interface TableItem {
  id: string
  name: string
  value: string
}

const attributItems: TableItem[] = [
  { id: '1', name: 'Taille', value: '4' },
  { id: '2', name: 'Couleur', value: '14' },
  { id: '3', name: 'Dimension', value: '5' },
  { id: '4', name: 'Poids', value: '2' },
  { id: '5', name: 'Couleur', value: '7' },
  { id: '6', name: 'Matériau', value: '3' }
]

const caracteristiqueItems: TableItem[] = [
  { id: '1', name: 'Composition', value: '4' },
  { id: '2', name: 'Propriété', value: '6' },
  { id: '3', name: 'Texture', value: '2' },
  { id: '4', name: 'Durabilité', value: '5' }
]

const TableColumns = [
  {
    id: "selection",
    header: "",
    cell: () => <TableCell className="w-[40px]"></TableCell>
  },
  {
    id: "name",
    header: () => (
      <div className="flex items-center">
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: TableItem) => <TableCell className="font-medium">{item.name}</TableCell>
  },
  {
    id: "value",
    header: () => (
      <div className="flex items-center">
        Valeur
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: TableItem) => <TableCell>{item.value}</TableCell>
  },
  {
    id: "actions",
    header: () => (
      <TableHead className="w-[40px]">
        <SlidersHorizontal className="h-4 w-4" />
      </TableHead>
    ),
    cell: () => (
      <TableCell className="text-gray-400">
        <MoreHorizontal className="h-4 w-4" />
      </TableCell>
    )
  }
]

const renderTable = (items: TableItem[], paginatedItems: TableItem[]) => {
  return (
    <div className="border rounded overflow-hidden">
      <Table>
        <TableHeader className="bg-[#d1d4db]">
          <TableRow>
            {TableColumns.map(column => (
              <TableHead key={column.id} className="font-medium text-gray-600">
                {typeof column.header === 'function' ? column.header() : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map(item => (
            <TableRow key={item.id}>
              {TableColumns.map(column => column.cell(item))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AttributsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [activeTab, setActiveTab] = useState("attribut")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Get current items based on active tab
  const currentItems = activeTab === "attribut" ? attributItems : caracteristiqueItems
  const totalItems = currentItems.length
  const paginatedItems = currentItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const tabs = [
    {
      value: "attribut",
      label: "Attribut",
      icon: <User className="h-4 w-4 mr-2" />,
      content: (
        <>
          {renderTable(attributItems, paginatedItems)}
          <PaginationGlobal
            currentPage={currentPage}
            totalPages={Math.ceil(attributItems.length / rowsPerPage)}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            totalItems={attributItems.length}
          />
        </>
      )
    },
    {
      value: "caracteristique",
      label: "Caractéristiques",
      icon: <ShieldCheck className="h-4 w-4 mr-2" />,
      content: (
        <>
          {renderTable(caracteristiqueItems, paginatedItems)}
          <PaginationGlobal
            currentPage={currentPage}
            totalPages={Math.ceil(caracteristiqueItems.length / rowsPerPage)}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            totalItems={caracteristiqueItems.length}
          />
        </>
      )
    }
  ]

  return (
    <div className="w-full">
      <BreadcrumbHeader
        title="Attributs & Caractéristiques"
        withSearch
        searchPlaceholder={`Rechercher un ${activeTab === "attribut" ? "attribut" : "caractéristique"}...`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg"
            >
              <Plus className="h-2 w-2" />
              {activeTab === "attribut" ? "Ajouter un attribut" : "Ajouter une caractéristique"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[180px] bg-white cursor-pointer z-50">
            <DropdownMenuItem className="flex items-center gap-2 p-2">
              <PenIcon className="h-4 w-4" />
              <span>Manuellement</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 p-2">
              <Sparkles className="h-4 w-4" />
              <span>via IA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbHeader>

      <div className="w-full bg-white">
        <CustomTabs 
          defaultValue="attribut" 
          tabs={tabs}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  )
}