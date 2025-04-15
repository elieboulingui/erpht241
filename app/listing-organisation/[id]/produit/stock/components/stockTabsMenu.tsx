// app/stock/page.tsx
'use client'

import { useState } from "react"
import { Search, MoreHorizontal, SlidersHorizontal, ArrowUpDown, Truck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import PaginationGlobal from "@/components/paginationGlobal"
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader"
import { cn } from "@/lib/utils"
import { CustomTabs } from "@/components/CustomTabs"

const dataStock = [
  {
    id: "1",
    article: "Iphone 13",
    reference: "demo_13",
    fournisseur: "Innova Tech",
    etat: "ok",
    physique: 17,
    reserve: 4,
    disponible: 13,
  },
  {
    id: "2",
    article: "Lenovo Yoga",
    reference: "demo_12",
    fournisseur: "Innova Tech",
    etat: "not-ok",
    physique: 5,
    reserve: 3,
    disponible: 2,
  },
]

const dataMouvement = [
  {
    id: "1",
    article: "Iphone 13",
    reference: "demo_13",
    type: "Commande client",
    quantite: -4,
    date: "14/05/2025 14:30",
    employe: "Aymard Steve",
  },
  {
    id: "2",
    article: "Lenovo Yoga",
    reference: "demo_12",
    type: "Commande client",
    quantite: 5,
    date: "14/05/2025 16:30",
    employe: "Aymard Steve",
  },
]

const StockTableColumns = [
  {
    id: "article",
    header: () => (
      <div className="flex items-center">
        Article
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => <TableCell className="font-medium">{item.article}</TableCell>
  },
  {
    id: "reference",
    header: () => (
      <div className="flex items-center">
        Référence
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => <TableCell>{item.reference}</TableCell>
  },
  {
    id: "fournisseur",
    header: () => (
      <div className="flex items-center">
        Fournisseur
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => <TableCell>{item.fournisseur}</TableCell>
  },
  {
    id: "etat",
    header: () => (
      <div className="flex items-center">
        État
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => (
      <TableCell>
        {item.etat === "ok" ? (
          <span className="text-green-600 text-xl">✔</span>
        ) : (
          <span className="text-red-600 text-xl">✖</span>
        )}
      </TableCell>
    )
  },
  {
    id: "physique",
    header: () => (
      <div className="flex items-center">
        Physique
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => <TableCell>{item.physique}</TableCell>
  },
  {
    id: "reserve",
    header: () => (
      <div className="flex items-center">
        Réservé
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => <TableCell>{item.reserve}</TableCell>
  },
  {
    id: "disponible",
    header: () => (
      <div className="flex items-center">
        Disponible
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataStock[0]) => <TableCell>{item.disponible}</TableCell>
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

const MouvementTableColumns = [
  {
    id: "article",
    header: () => (
      <div className="flex items-center">
        Article
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataMouvement[0]) => <TableCell className="font-medium">{item.article}</TableCell>
  },
  {
    id: "reference",
    header: () => (
      <div className="flex items-center">
        Référence
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataMouvement[0]) => <TableCell>{item.reference}</TableCell>
  },
  {
    id: "type",
    header: () => (
      <div className="flex items-center">
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataMouvement[0]) => <TableCell className="text-red-600">{item.type}</TableCell>
  },
  {
    id: "quantite",
    header: () => (
      <div className="flex items-center">
        Quantité
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataMouvement[0]) => (
      <TableCell>
        <span
          className={cn(
            "rounded px-2 py-0.5 text-white text-xs font-medium",
            item.quantite < 0 ? "bg-black" : "bg-green-600"
          )}
        >
          {item.quantite > 0 ? `+${item.quantite}` : item.quantite}
        </span>
      </TableCell>
    )
  },
  {
    id: "date",
    header: () => (
      <div className="flex items-center">
        Date et Heure
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataMouvement[0]) => <TableCell className="whitespace-nowrap">{item.date}</TableCell>
  },
  {
    id: "employe",
    header: () => (
      <div className="flex items-center">
        Employé
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: (item: typeof dataMouvement[0]) => <TableCell>{item.employe}</TableCell>
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

const renderTable = (items: any[], columns: any[], paginatedItems: any[]) => {
  return (
    <div className="border rounded overflow-hidden">
      <Table>
        <TableHeader className="bg-[#d1d4db]">
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.id} className="font-medium text-gray-600">
                {typeof column.header === 'function' ? column.header() : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map(item => (
            <TableRow key={item.id}>
              {columns.map(column => column.cell(item))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function StockMouvementTabs() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [activeTab, setActiveTab] = useState("stock")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // Get current items based on active tab
  const currentItems = activeTab === "stock" ? dataStock : dataMouvement
  const currentColumns = activeTab === "stock" ? StockTableColumns : MouvementTableColumns
  const totalItems = currentItems.length

  // Get paginated items
  const indexOfLastItem = currentPage * rowsPerPage
  const indexOfFirstItem = indexOfLastItem - rowsPerPage
  const paginatedItems = currentItems.slice(indexOfFirstItem, indexOfLastItem)

  const tabs = [
    {
      value: "stock",
      label: "Stock",
      icon: <Truck className="h-4 w-4 mr-2" />,
      content: (
        <>
          {renderTable(dataStock, StockTableColumns, paginatedItems)}
          <PaginationGlobal
            currentPage={currentPage}
            totalPages={Math.ceil(dataStock.length / rowsPerPage)}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            totalItems={dataStock.length}
          />
        </>
      )
    },
    {
      value: "mouvement",
      label: "Mouvement",
      icon: <ArrowUpDown className="h-4 w-4 mr-2" />,
      content: (
        <>
          {renderTable(dataMouvement, MouvementTableColumns, paginatedItems)}
          <PaginationGlobal
            currentPage={currentPage}
            totalPages={Math.ceil(dataMouvement.length / rowsPerPage)}
            rowsPerPage={rowsPerPage}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
            totalItems={dataMouvement.length}
          />
        </>
      )
    }
  ]

  return (
    <div className="">
      {/* Header Section */}
      <BreadcrumbHeader
        title="Stock"
        withSearch
        searchPlaceholder={`Rechercher ${activeTab === "stock" ? "un article en stock" : "un mouvement"}...`}
      />

      {/* Main Content Section */}
      <div className="bg-white">
        <CustomTabs 
          defaultValue="stock" 
          tabs={tabs}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  )
}