"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  type ColumnDef,
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
import DevisDetailsModal from "../ajout-devis/devis-details-modal";
import EditDevisModal from "../ajout-devis/edit-devis-modal";
import { DeleteDevisDialog } from "../ajout-devis/archive-devis-dialog";
import ChatModal from "@/app/agents/devis/component/chat";

interface Devis {
  id: string;
  dateFacturation: string;
  dateEcheance: string;
  taxes: string;
  statut: string;
  selected?: boolean;
}

const extractUrlParams = (path: string) => {
  const regex = /\/listing-organisation\/([^/]+)\/contact\/([^/]+)/;
  const match = path.match(regex);

  if (!match) {
    console.error("URL format invalide:", path);
    return { organisationId: "", contactSlug: "" };
  }

  return {
    organisationId: match[1],
    contactSlug: match[2],
  };
};

const ALL_STATUSES = ["Attente", "Validé", "Facturé", "Archivé"];
const ALL_TAXES = ["TVA", "Hors Taxe"];

const DevisTable = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { organisationId, contactSlug } = extractUrlParams(pathname);
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [idFilter, setIdFilter] = useState("");
  const [taxesFilter, setTaxesFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<{ start?: Date; end?: Date }>(
    {}
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDevisId, setSelectedDevisId] = useState("");

  const [data, setData] = useState<Devis[]>([]);
  useEffect(() => {
    const fetchDevis = async () => {
      try {
        // Extract contactId from the URL using regex
        const url = window.location.href; // Get the full URL
        const regex = /\/contact\/([a-zA-Z0-9]+)/; // Regex to match the contactId pattern
        const match = url.match(regex);
        
        if (!match || !match[1]) {
          console.error("Contact ID not found in URL");
          toast.error("Contact ID non trouvé dans l'URL");
          return;
        }

        const contactId = match[1]; // The contactId is in the first capture group
        
        // Construct the API URL with the necessary query parameters
        const response = await fetch(
          `/api/tabsdevis?page=${currentPage}&limit=${rowsPerPage}&contactId=${contactId}`
        );

        const data = await response.json();
        setData(data.results); // Assuming your API response has a `results` field
        // setTotalItems(data.total); // If you have pagination, you can store the total items here
      } catch (error) {
        console.error("Erreur lors de la récupération des devis:", error);
        toast.error("Erreur lors de la récupération des devis");
      }
    };

    fetchDevis(); // Call the function when dependencies change
  }, [currentPage, rowsPerPage]); // Dependencies to trigger effect

  useEffect(() => {
    if (!organisationId || !contactSlug) {
      console.error("Paramètres manquants dans l'URL:", {
        organisationId,
        contactSlug,
        pathname,
      });
      toast.error(
        "Format d'URL invalide - Impossible d'extraire les paramètres",
        { position: "bottom-right" }
      );
    }
  }, [organisationId, contactSlug, pathname]);

  const handleStatusChange = (devisId: string, newStatus: string) => {
    setData(
      data.map((devis) =>
        devis.id === devisId ? { ...devis, statut: newStatus } : devis
      )
    );

    toast.success("Statut du devis mis à jour", {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const filteredData = data?.filter((devis) => {
    // Filtre par recherche globale
    const matchesSearch =
      searchTerm === "" ||
      devis.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.statut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      devis.taxes.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par ID
    const matchesId = idFilter === "" || devis.id.includes(idFilter);

    // Filtre par taxes
    const matchesTaxes =
      taxesFilter.length === 0 || taxesFilter.includes(devis.taxes);

    // Filtre par statut
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(devis.statut);

    // Filtre par date
    const matchesDate =
      !dateFilter.start ||
      (new Date(devis.dateFacturation.split("/").reverse().join("-")) >=
        new Date(dateFilter.start) &&
        (!dateFilter.end ||
          new Date(devis.dateFacturation.split("/").reverse().join("-")) <=
            new Date(dateFilter.end)));

    return (
      matchesSearch && matchesId && matchesTaxes && matchesStatus && matchesDate
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
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
      case "Validé":
        return "bg-amber-100 text-amber-800";
      case "Facturé":
        return "bg-green-100 text-green-800";
      case "Attente":
        return "bg-pink-200 text-pink-800";
      case "Archivé":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddDevis = (type: "manual" | "ai") => {
    if (!organisationId || !contactSlug) {
      toast.error(
        `Paramètres manquants:
        Organisation: ${organisationId || "Non trouvé"}
        Contact: ${contactSlug || "Non trouvé"}`,
        { position: "bottom-right" }
      );
      return;
    }

    if (type === "manual") {
      router.push(
        `/listing-organisation/${organisationId}/contact/${contactSlug}/ajout-devis`
      );
    } else {
      setIsAIGeneratorOpen(true);
    }
  };

  const handleSaveNewDevis = (devisData: any) => {
    const newId = `HT${Math.floor(1000 + Math.random() * 9000)}${new Date().getFullYear().toString().slice(-2)}`;

    const newDevis: Devis = {
      id: newId,
      dateFacturation: new Date().toLocaleDateString("fr-FR"),
      dateEcheance: devisData.dueDate
        ? new Date(devisData.dueDate).toLocaleDateString("fr-FR")
        : "sans",
      taxes: devisData.products.some((p: any) => p.tax > 0)
        ? "TVA"
        : "Hors Taxe",
      statut: "Attente",
    };

    setData((prev) => [...prev, newDevis]);
    setIsAIGeneratorOpen(false);
  };

  const handleViewDetails = (devisId: string) => {
    setSelectedDevisId(devisId);
    setIsDetailsModalOpen(true);
  };

  const handleEditDevis = (devisId: string) => {
    if (!organisationId || !contactSlug) {
      toast.error("Impossible de modifier - paramètres d'URL manquants", {
        position: "bottom-right",
      });
      return;
    }

    setSelectedDevisId(devisId);
    setIsEditModalOpen(true);
  };

  const handleUpdateDevis = (updatedData: any) => {
    setData(
      data.map((devis) =>
        devis.id === updatedData.id
          ? {
              id: updatedData.id,
              dateFacturation: updatedData.creationDate
                ? new Date(updatedData.creationDate).toLocaleDateString("fr-FR")
                : devis.dateFacturation,
              dateEcheance: updatedData.dueDate
                ? new Date(updatedData.dueDate).toLocaleDateString("fr-FR")
                : "sans",
              taxes: updatedData.products.some((p: any) => p.tax > 0)
                ? "TVA"
                : "Hors Taxe",
              statut: devis.statut,
            }
          : devis
      )
    );

    toast.success("Devis mis à jour avec succès", {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const handleDeleteDevis = (devisId: string) => {
    setSelectedDevisId(devisId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDevis = () => {
    setData(data.filter((devis) => devis.id !== selectedDevisId));
    setIsDeleteDialogOpen(false);

    toast.success("Devis supprimé avec succès", {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const addFilter = (type: string, value: string) => {
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters([...activeFilters, `${type}:${value}`]);
    }
    setCurrentPage(1);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    const [type, value] = filter.split(":");
    if (type === "taxes")
      setTaxesFilter(taxesFilter.filter((t) => t !== value));
    else if (type === "statut")
      setStatusFilter(statusFilter.filter((s) => s !== value));
    else if (type === "id") setIdFilter("");
    else if (type === "date") setDateFilter({});
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setIdFilter("");
    setTaxesFilter([]);
    setStatusFilter([]);
    setDateFilter({});
    setCurrentPage(1);
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

  const columns: ColumnDef<Devis>[] = [
    selectionColumn<Devis>({ onBulkDelete: handleBulkDelete }),
    {
      accessorKey: "id",
      header: () => (
        <div className="flex items-center gap-1">
          ID Devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
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
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
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
                    if (range?.from) {
                      setDateFilter({
                        start: range.from,
                        end: range.to,
                      });
                      addFilter(
                        "date",
                        `${range.from.toISOString()}${range.to ? `-${range.to.toISOString()}` : ""}`
                      );
                    } else {
                      setDateFilter({});
                      removeFilter("date");
                    }
                  }}
                  initialFocus
                />
                {dateFilter.start && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => {
                      setDateFilter({});
                      removeFilter("date");
                    }}
                  >
                    Effacer
                  </Button>
                )}
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
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
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
                    if (range?.from) {
                      setDateFilter({
                        start: range.from,
                        end: range.to,
                      });
                      addFilter(
                        "date",
                        `${range.from.toISOString()}${range.to ? `-${range.to.toISOString()}` : ""}`
                      );
                    } else {
                      setDateFilter({});
                      removeFilter("date");
                    }
                  }}
                  initialFocus
                />
                {dateFilter.start && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={() => {
                      setDateFilter({});
                      removeFilter("date");
                    }}
                  >
                    Effacer
                  </Button>
                )}
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
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {ALL_TAXES.map((tax) => (
                <DropdownMenuCheckboxItem
                  key={tax}
                  checked={taxesFilter.includes(tax)}
                  onCheckedChange={() => toggleTaxesFilter(tax)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {tax}
                </DropdownMenuCheckboxItem>
              ))}
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
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {ALL_STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={() => toggleStatusFilter(status)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(status)}`}
                  ></span>
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue<string>("statut");
        const devisId = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(status)} cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {status}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="shadow-lg">
              {ALL_STATUSES.map((newStatus) => (
                <DropdownMenuItem
                  key={newStatus}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${status === newStatus ? "bg-gray-100" : ""}`}
                  onClick={() => handleStatusChange(devisId, newStatus)}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusClass(newStatus)}`}
                  ></span>
                  {newStatus}
                  {status === newStatus && (
                    <span className="ml-2 text-xs text-gray-500">(actuel)</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4 ml-20" />
          <span className="sr-only">Filter</span>
        </Button>
      ),
      cell: ({ row }) => {
        const devisId = row.original.id;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4 mr-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="shadow-lg">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleViewDetails(devisId)}
                >
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleEditDevis(devisId)}
                >
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => handleDeleteDevis(devisId)}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredData,
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
      {(!organisationId || !contactSlug) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 animate-fade-in">
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
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                    className="pl-10 pr-10 bg-[#e6e7eb] border-gray-300 focus:ring-2 focus:ring-red-500/50 transition-all"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-[#e6e7eb] border-gray-300 text-gray-700 flex items-center gap-1 hover:bg-gray-200 transition-colors"
                    >
                      <Filter className="h-4 w-4" /> Filtres avancés
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 shadow-xl">
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
                          className="h-8 px-2 hover:bg-gray-100 transition-colors"
                          onClick={applyIdFilter}
                        >
                          <Filter className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Taxes</p>
                      {ALL_TAXES.map((tax) => (
                        <DropdownMenuCheckboxItem
                          key={tax}
                          checked={taxesFilter.includes(tax)}
                          onCheckedChange={() => toggleTaxesFilter(tax)}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {tax}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Statut</p>
                      {ALL_STATUSES.map((status) => (
                        <DropdownMenuCheckboxItem
                          key={status}
                          checked={statusFilter.includes(status)}
                          onCheckedChange={() => toggleStatusFilter(status)}
                          className="hover:bg-gray-50 transition-colors"
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
                            className="w-full justify-start text-left font-normal h-8 text-sm hover:bg-gray-50 transition-colors"
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
                        <PopoverContent
                          className="w-auto p-0 shadow-lg"
                          align="start"
                        >
                          <CalendarComponent
                            mode="range"
                            selected={{
                              from: dateFilter.start,
                              to: dateFilter.end,
                            }}
                            onSelect={(range) => {
                              if (range?.from) {
                                setDateFilter({
                                  start: range.from,
                                  end: range.to,
                                });
                                addFilter(
                                  "date",
                                  `${range.from.toISOString()}${range.to ? `-${range.to.toISOString()}` : ""}`
                                );
                              } else {
                                setDateFilter({});
                                removeFilter("date");
                              }
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
                  <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4" /> Ajouter un devis
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[163px] shadow-xl"
                >
                  <DropdownMenuItem
                    onClick={() => handleAddDevis("manual")}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <UserPen className="h-4 w-4 mr-2" />
                    <span>Manuellement</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    onClick={() => handleAddDevis("ai")}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span>Via IA</span>
                  </DropdownMenuItem> */}

                  <ChatModal>
                    <Button className="w-full flex justify-start" variant="ghost">
                  
                      <Sparkles className="h-4 w-4 mr-2" />
                      Via IA
                    </Button>
                  </ChatModal>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center animate-fade-in">
                <span className="text-sm text-gray-500 flex items-center">
                  <SlidersHorizontal className="h-3 w-3 mr-1" /> Filtres actifs:
                </span>
                {activeFilters.map((filter) => {
                  const [type, value] = filter.split(":");
                  return (
                    <Badge
                      key={filter}
                      variant="outline"
                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-xs">
                        {type === "taxes"
                          ? "Taxes: "
                          : type === "statut"
                            ? "Statut: "
                            : type === "id"
                              ? "ID: "
                              : type === "date"
                                ? "Date: "
                                : ""}
                        {type === "date"
                          ? `${new Date(value.split("-")[0]).toLocaleDateString()}${value.includes("-") ? ` - ${new Date(value.split("-")[1]).toLocaleDateString()}` : ""}`
                          : value}
                      </span>
                      <button
                        onClick={() => removeFilter(filter)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={clearAllFilters}
                >
                  Effacer tout
                </Button>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
        onOpenChange={(open) => {
          if (!open) {
            setIsAIGeneratorOpen(false);
          } else {
            setIsAIGeneratorOpen(true);
          }
        }}
        organisationId={organisationId}
        contactSlug={contactSlug}
        onSaveDevis={handleSaveNewDevis}
      />

      <DevisDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        devisId={selectedDevisId}
      />

      <EditDevisModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        devisId={selectedDevisId}
        organisationId={organisationId}
        contactSlug={contactSlug}
        onSaveDevis={handleUpdateDevis}
      />

      <DeleteDevisDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteDevis}
        devisId={selectedDevisId}
      />
    </div>
  );
};

export default DevisTable;
