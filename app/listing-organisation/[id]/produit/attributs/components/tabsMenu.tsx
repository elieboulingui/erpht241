'use client'

import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { PenIcon, Plus, Search, Sparkles, MoreHorizontal, SlidersHorizontal, ArrowUpDown, User, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaginationGlobal from "@/components/paginationGlobal"

interface TableItem {
  id: string
  name: string
  value: string
}

const attributItems: TableItem[] = [
  { id: '1', name: 'Taille', value: '4' },
  { id: '2', name: 'Cookeur', value: '14' },
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
  const [activeTab, setActiveTab] = useState("attribut")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Get current items based on active tab
  const currentItems = activeTab === "attribut" ? attributItems : caracteristiqueItems
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
    <div className="w-full">
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
                    Attributs & Caractéristiques
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
                placeholder={`Rechercher un ${activeTab === "attribut" ? "attribut" : "caractéristique"}...`}
                className="pl-8 w-full"
              />
            </div>

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
          </div>
        </div>

        <Separator className="mt-2" />
      </header>

      {/* Main Content Section */}
      <div className="w-full bg-white ">
        <Tabs defaultValue="attribut" onValueChange={handleTabChange} className="w-full">

          <div className="border-b ">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger
                value="attribut"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                <User className="h-4 w-4 mr-2" />
                Attribut
              </TabsTrigger>
              <TabsTrigger
                value="caracteristique"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Caractéristiques
              </TabsTrigger>

            </TabsList>
          </div>

          <TabsContent value="attribut" className="pt-6 px-4">
            {renderTable(attributItems, paginatedItems)}
          </TabsContent>

          <TabsContent value="caracteristique" className="pt-6 px-4">
            {renderTable(caracteristiqueItems, paginatedItems)}
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