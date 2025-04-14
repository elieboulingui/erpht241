'use client'

import { useState } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { Search, MoreHorizontal, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import PaginationGlobal from "@/components/paginationGlobal"

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
  const [activeTab, setActiveTab] = useState("stock")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Get current items based on active tab
  const currentItems = activeTab === "stock" ? dataStock : dataMouvement
  const currentColumns = activeTab === "stock" ? StockTableColumns : MouvementTableColumns
  const totalItems = currentItems.length
  const totalPages = Math.ceil(totalItems / rowsPerPage)

  // Get paginated items
  const indexOfLastItem = currentPage * rowsPerPage
  const indexOfFirstItem = indexOfLastItem - rowsPerPage
  const paginatedItems = currentItems.slice(indexOfFirstItem, indexOfLastItem)

  // Reset to first page when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="">
      {/* Header Section */}
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-black font-bold" href="#">
                    Stock
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Rechercher ${activeTab === "stock" ? "un article en stock" : "un mouvement"}...`}
                className="pl-8 w-full"
              />
            </div>
          </div>
        </div>

        <Separator className="mt-2" />
      </header>

      {/* Main Content Section */}
      <div className=" bg-white ">
        <Tabs defaultValue="stock" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-0 bg-transparent border-b border-gray-200">
            <TabsTrigger
              value="stock"
              className={`py-5 rounded-none border-b-2 ${activeTab === "stock" ? "border-black text-[#7f1d1c] font-medium" : "border-transparent text-gray-600"}`}
            >
              Stock
            </TabsTrigger>
            <TabsTrigger
              value="mouvement"
              className={`py-5 rounded-none border-b-2 ${activeTab === "mouvement" ? "border-black text-[#7f1d1c] font-medium" : "border-transparent text-gray-600"}`}
            >
              Mouvement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock" className="pt-6 px-4">
            {renderTable(dataStock, StockTableColumns, paginatedItems)}
          </TabsContent>

          <TabsContent value="mouvement" className="pt-6 px-4">
            {renderTable(dataMouvement, MouvementTableColumns, paginatedItems)}
          </TabsContent>
        </Tabs>

        {/* Pagination component */}
        <PaginationGlobal
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  )
}