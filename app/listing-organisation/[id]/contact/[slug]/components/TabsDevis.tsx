"use client";

import { useState, useRef, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  X,
  SlidersHorizontal,
  Plus,
  PenIcon as UserPen,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useRouter, usePathname } from "next/navigation";
import PaginationGlobal from "@/components/paginationGlobal";
import { selectionColumn } from "@/components/SelectionColumn";
import DevisAIGenerator from "@/app/agents/devis/component/ai-contact-devis-generator";
import { toast } from "sonner";

interface Devis {
  id: string;
  dateFacturation: string;
  dateEcheance: string;
  taxes: string;
  statut: string;
  selected?: boolean;
}

const extractUrlParams = (path: string) => {
  const regex = /\/listing-organisation\/([^\/]+)\/contact\/([^\/]+)/;
  const match = path.match(regex);
  
  if (!match) {
    console.error("URL format invalide:", path);
    return { organisationId: "", contactSlug: "" };
  }

  return {
    organisationId: match[1],
    contactSlug: match[2]
  };
};

const DevisTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { organisationId, contactSlug } = extractUrlParams(pathname);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [idFilter, setIdFilter] = useState("");
  const [taxesFilter, setTaxesFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<Devis[]>([
    {
      id: "HT241062025",
      dateFacturation: "05/03/2025",
      dateEcheance: "05/04/2025",
      taxes: "Hors Taxe",
      statut: "Validé",
    },
    {
      id: "HT241002025",
      dateFacturation: "03/03/2025",
      dateEcheance: "05/04/2025",
      taxes: "TVA",
      statut: "Facturé",
    },
    {
      id: "HT243302025",
      dateFacturation: "11/03/2025",
      dateEcheance: "sans",
      taxes: "TVA",
      statut: "Validé",
    },
    {
      id: "HT241132025",
      dateFacturation: "07/03/2025",
      dateEcheance: "sans",
      taxes: "TVA",
      statut: "Attente",
    },
  ]);

  useEffect(() => {
    if (!organisationId || !contactSlug) {
      console.error("Paramètres manquants dans l'URL:", { organisationId, contactSlug, pathname });
      toast.error("Format d'URL invalide - Impossible d'extraire les paramètres");
    }
  }, [organisationId, contactSlug, pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    table.setPageIndex(0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setData(data.filter((item) => !ids.includes(item.id)));
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Validé": return "bg-amber-100 text-amber-800";
      case "Facturé": return "bg-green-100 text-green-800";
      case "Attente": return "bg-pink-200 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddDevis = (type: 'manual' | 'ai') => {
    if (!organisationId || !contactSlug) {
      toast.error(
        `Paramètres manquants:
        Organisation: ${organisationId || 'Non trouvé'}
        Contact: ${contactSlug || 'Non trouvé'}`
      );
      return;
    }

    if (type === 'manual') {
      router.push(`/listing-organisation/${organisationId}/contact/${contactSlug}/ajout-devis`);
    } else {
      setIsAIGeneratorOpen(true);
    }
  };

  const handleSaveNewDevis = (devisData: any) => {
    const newId = `HT${Math.floor(1000 + Math.random() * 9000)}${new Date().getFullYear().toString().slice(-2)}`;
    
    const newDevis: Devis = {
      id: newId,
      dateFacturation: new Date().toLocaleDateString('fr-FR'),
      dateEcheance: devisData.dueDate 
        ? new Date(devisData.dueDate).toLocaleDateString('fr-FR') 
        : "sans",
      taxes: devisData.products.some((p: any) => p.tax > 0) ? "TVA" : "Hors Taxe",
      statut: "Attente",
    };

    setData([...data, newDevis]);
    setIsAIGeneratorOpen(false);
    toast.success("Devis créé avec succès");
  };

  // Fonctions de filtrage (inchangées)
  const addFilter = (type: string, value: string) => {
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters([...activeFilters, `${type}:${value}`]);
    }
    table.setPageIndex(0);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    const [type, value] = filter.split(":");
    if (type === "taxes") setTaxesFilter(taxesFilter.filter((t) => t !== value));
    else if (type === "statut") setStatusFilter(statusFilter.filter((s) => s !== value));
    else if (type === "id") setIdFilter("");
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setIdFilter("");
    setTaxesFilter([]);
    setStatusFilter([]);
    setDateFilter({});
  };

  const toggleTaxesFilter = (tax: string) => {
    if (taxesFilter.includes(tax)) {
      setTaxesFilter(taxesFilter.filter((t) => t !== tax));
      removeFilter(`taxes:${tax}`);
    } else {
      setTaxesFilter([...taxesFilter, tax]);
      addFilter("taxes", tax);
    }
  };

  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status));
      removeFilter(`statut:${status}`);
    } else {
      setStatusFilter([...statusFilter, status]);
      addFilter("statut", status);
    }
  };

  const applyIdFilter = () => {
    if (idFilter) {
      setActiveFilters(activeFilters.filter((f) => !f.startsWith("id:")));
      addFilter("id", idFilter);
    }
  };

  const uniqueTaxes = Array.from(new Set(data.map((d) => d.taxes)));
  const uniqueStatuses = Array.from(new Set(data.map((d) => d.statut)));

  const columns: ColumnDef<Devis>[] = [
    selectionColumn<Devis>({ onBulkDelete: handleBulkDelete }),
    {
      accessorKey: "id",
      header: () => (
        <div className="flex items-center gap-1">
          ID Devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <div className="p-2">
                <Input
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                  placeholder="Filtrer par ID"
                  className="h-8 text-sm"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-black hover:bg-black"
                    onClick={applyIdFilter}
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "dateFacturation",
      header: () => (
        <div className="flex items-center gap-1">
          Date de facturation
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-auto">
              <div className="p-2">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: dateFilter.start,
                    to: dateFilter.end,
                  }}
                  onSelect={(range) => {
                    setDateFilter({
                      start: range?.from,
                      end: range?.to,
                    });
                  }}
                  initialFocus
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      accessorKey: "dateEcheance",
      header: () => (
        <div className="flex items-center gap-1">
          Date d'échéance
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-auto">
              <div className="p-2">
                <CalendarComponent
                  mode="range"
                  selected={{
                    from: dateFilter.start,
                    to: dateFilter.end,
                  }}
                  onSelect={(range) => {
                    setDateFilter({
                      start: range?.from,
                      end: range?.to,
                    });
                  }}
                  initialFocus
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        const dateEcheance = row.getValue<string>("dateEcheance");
        return dateEcheance === "sans"
          ? row.getValue<string>("dateFacturation")
          : dateEcheance;
      },
    },
    {
      accessorKey: "taxes",
      header: () => (
        <div className="flex items-center gap-1">
          Taxes
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="p-2">
                {uniqueTaxes.map((tax) => (
                  <DropdownMenuCheckboxItem
                    key={tax}
                    checked={taxesFilter.includes(tax)}
                    onCheckedChange={() => toggleTaxesFilter(tax)}
                  >
                    {tax}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
    {
      accessorKey: "statut",
      header: () => (
        <div className="flex items-center gap-1">
          Statut
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <div className="p-2">
                {uniqueStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleStatusFilter(status)}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(status)}`}
                    ></span>
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue<string>("statut");
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(status)}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <SlidersHorizontal className="h-4 w-4 ml-20" />
          <span className="sr-only">Filter</span>
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4 mr-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  Archiver
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: rowsPerPage,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage - 1,
          pageSize: rowsPerPage,
        });
        setCurrentPage(newState.pageIndex + 1);
        setRowsPerPage(newState.pageSize);
      }
    },
  });

  const totalItems = table.getFilteredRowModel().rows.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="relative pb-16">
      {/* Avertissement si problème d'extraction */}
      {(!organisationId || !contactSlug) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Attention: Problème de détection des paramètres dans l'URL
                <br />
                Format attendu: /listing-organisation/[id]/contact/[slug]
                <br />
                URL actuelle: {pathname}
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="devis">
        <TabsContent value="devis" className="p-0">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-2 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Rechercher un devis"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-10 bg-[#e6e7eb] border-gray-300"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#e6e7eb] border-gray-300 text-gray-700 flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4" /> Filtres avancés
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">ID Devis</p>
                      <div className="flex gap-2">
                        <Input
                          value={idFilter}
                          onChange={(e) => setIdFilter(e.target.value)}
                          placeholder="Filtrer par ID"
                          className="h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2"
                          onClick={applyIdFilter}
                        >
                          <Filter className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Taxes</p>
                      {uniqueTaxes.map((tax) => (
                        <DropdownMenuCheckboxItem
                          key={tax}
                          checked={taxesFilter.includes(tax)}
                          onCheckedChange={() => toggleTaxesFilter(tax)}
                        >
                          {tax}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Statut</p>
                      {uniqueStatuses.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={() => toggleStatusFilter(status)}
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(status)}`}
                          ></span>
                          {status}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">
                        Date d'échéance
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal h-8 text-sm"
                            size="sm"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateFilter.start ? (
                              dateFilter.end ? (
                                <>
                                  {dateFilter.start.toLocaleDateString()} -{" "}
                                  {dateFilter.end.toLocaleDateString()}
                                </>
                              ) : (
                                dateFilter.start.toLocaleDateString()
                              )
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="range"
                            selected={{
                              from: dateFilter.start,
                              to: dateFilter.end,
                            }}
                            onSelect={(range) => {
                              setDateFilter({
                                start: range?.from,
                                end: range?.to,
                              });
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg">
                    <Plus className="h-4 w-4 " /> Ajouter un devis
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[163px]">
                  <DropdownMenuItem
                    onClick={() => handleAddDevis('manual')}
                    className="cursor-pointer"
                  >
                    <UserPen className="h-4 w-4 mr-2" />
                    <span>Manuellement</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAddDevis('ai')}
                    className="cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Via IA</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 flex items-center">
                  <SlidersHorizontal className="h-3 w-3 mr-1" /> Filtres actifs:
                </span>
                {activeFilters.map((filter) => {
                  const [type, value] = filter.split(":");
                  return (
                    <Badge
                      key={filter}
                      variant="outline"
                      className="flex items-center gap-1 bg-gray-100"
                    >
                      <span className="text-xs">
                        {type === "taxes"
                          ? "Taxes: "
                          : type === "statut"
                            ? "Statut: "
                            : type === "id"
                              ? "ID: "
                              : ""}
                        {value}
                      </span>
                      <button
                        onClick={() => removeFilter(filter)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500"
                  onClick={clearAllFilters}
                >
                  Effacer tout
                </Button>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#e6e7eb]">
                <TableRow className="border-b border-gray-300">
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-gray-900 font-medium"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-b border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500"
                    >
                      Aucun devis ne correspond à vos critères de recherche
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />

      <DevisAIGenerator
        open={isAIGeneratorOpen}
        onOpenChange={setIsAIGeneratorOpen} 
        organisationId={organisationId} 
        contactSlug={contactSlug}
        onSaveDevis={handleSaveNewDevis}
      />
    </div>
  );
};

export default DevisTable;