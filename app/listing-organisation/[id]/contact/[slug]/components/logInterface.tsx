"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCw, Search, Plus, Pencil, Calendar, ChevronDown } from "lucide-react"
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns"
import { fr } from "date-fns/locale"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data for demonstration
const sampleLogs = [
    {
        id: 1,
        action: "Création",
        method: "POST",
        userId: "USR001",
        userName: "Vous",
        date: new Date("2025-04-07T13:31:07"),
        productId: "PRD123",
        contact: "Jean Dupont",
        category: "Électronique",
        brand: "TechBrand",
        fields: [
            { name: "ID", value: "01" },
            { name: "Produit", value: "Smartphone X12" },
            { name: "Catégorie", value: "Électronique" },
            { name: "Marque", value: "TechBrand" },
        ],
    },
    {
        id: 2,
        action: "Modification",
        method: "PUT",
        userId: "USR001",
        userName: "Vous",
        date: new Date("2025-04-06T13:30:50"),
        productId: "PRD456",
        contact: "Marie Martin",
        category: "Vêtements",
        brand: "FashionCo",
        changes: [
            { field: "Prix", oldValue: "199.99 €", newValue: "149.99 €" },
            { field: "Stock", oldValue: "15", newValue: "25" },
            { field: "Catégorie", oldValue: "Accessoires", newValue: "Vêtements" },
        ],
    },
    {
        id: 3,
        action: "Suppression",
        method: "DELETE",
        userId: "USR001",
        userName: "Vous",
        date: new Date("2025-04-05T12:45:22"),
        productId: "PRD789",
        contact: "Pierre Durand",
        category: "Alimentation",
        brand: "FoodInc",
        fields: [
            { name: "ID", value: "03" },
            { name: "Produit", value: "Café Premium" },
            { name: "Catégorie", value: "Alimentation" },
        ],
    },
    {
        id: 4,
        action: "Consultation",
        method: "GET",
        userId: "USR002",
        userName: "Sophie Petit",
        date: new Date("2025-04-04T11:20:00"),
        productId: "PRD123",
        contact: "Sophie Petit",
        category: "Électronique",
        brand: "TechBrand",
        fields: [
            { name: "ID", value: "01" },
            { name: "Produit", value: "Smartphone X12" },
        ],
    },
    {
        id: 5,
        action: "Modification",
        method: "PUT",
        userId: "USR003",
        userName: "Thomas Legrand",
        date: new Date("2025-04-03T10:10:30"),
        productId: "PRD456",
        contact: "Marie Martin",
        category: "Vêtements",
        brand: "FashionCo",
        changes: [
            { field: "Description", oldValue: "Chemise bleue taille M", newValue: "Chemise bleue coton taille M" },
            { field: "Couleur", oldValue: "Bleu", newValue: "Bleu marine" },
        ],
    },
]

// Type pour la plage de dates
type DateRangeValue =
    | {
        start: Date | null
        end: Date | null
    }
    | undefined

// Date range options
const dateRangeOptions = [
    {
        label: "Aujourd'hui",
        value: "today",
        getRange: () => ({
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
        }),
    },
    {
        label: "Hier",
        value: "yesterday",
        getRange: () => ({
            start: startOfDay(subDays(new Date(), 1)),
            end: endOfDay(subDays(new Date(), 1)),
        }),
    },
    {
        label: "3 derniers jours",
        value: "last3days",
        getRange: () => ({
            start: startOfDay(subDays(new Date(), 2)),
            end: endOfDay(new Date()),
        }),
    },
    {
        label: "7 derniers jours",
        value: "last7days",
        getRange: () => ({
            start: startOfDay(subDays(new Date(), 6)),
            end: endOfDay(new Date()),
        }),
    },
    {
        label: "30 derniers jours",
        value: "last30days",
        getRange: () => ({
            start: startOfDay(subDays(new Date(), 29)),
            end: endOfDay(new Date()),
        }),
    },
    { label: "Personnalisé", value: "custom", getRange: () => undefined },
]

export function LogInterface() {
    const [logs, setLogs] = useState(sampleLogs)
    const [searchTerm, setSearchTerm] = useState("")
    const [actionFilter, setActionFilter] = useState<string | null>(null)
    const [dateRangeType, setDateRangeType] = useState("today")
    const [dateRange, setDateRange] = useState<DateRangeValue>(
        dateRangeOptions.find((option) => option.value === "today")?.getRange(),
    )
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined)

    // Update date range when date range type changes
    const handleDateRangeTypeChange = (value: string) => {
        setDateRangeType(value)
        const selectedOption = dateRangeOptions.find((option) => option.value === value)
        if (selectedOption) {
            if (value === "custom") {
                // For custom range, use the custom date picker values
                if (customDateRange?.from && customDateRange?.to) {
                    setDateRange({
                        start: startOfDay(customDateRange.from),
                        end: endOfDay(customDateRange.to),
                    })
                } else {
                    setDateRange(undefined)
                }
            } else {
                // For predefined ranges, use the calculated range
                setDateRange(selectedOption.getRange())
            }
        }
    }

    // Update custom date range
    const handleCustomDateRangeChange = (range: DateRange | undefined) => {
        setCustomDateRange(range)
        if (range?.from && range?.to) {
            setDateRange({
                start: startOfDay(range.from),
                end: endOfDay(range.to),
            })
        } else {
            setDateRange(undefined)
        }
    }

    // Filter logs based on search term, action filter, and date range
    const filteredLogs = logs.filter((log) => {
        // Filter by search term
        const matchesSearch =
            searchTerm === "" ||
            Object.values(log).some((value) => {
                if (typeof value === "string") {
                    return value.toLowerCase().includes(searchTerm.toLowerCase())
                }
                return false
            })

        // Filter by action
        const matchesAction = !actionFilter || log.action === actionFilter

        // Filter by date range
        let matchesDateRange = true
        if (dateRange && dateRange.start && dateRange.end) {
            matchesDateRange = isWithinInterval(log.date, {
                start: dateRange.start,
                end: dateRange.end,
            })
        }

        return matchesSearch && matchesAction && matchesDateRange
    })

    // Reset filters
    const resetFilters = () => {
        setSearchTerm("")
        setActionFilter(null)
        setDateRangeType("last3days")
        setDateRange(dateRangeOptions.find((option) => option.value === "last3days")?.getRange())
        setCustomDateRange(undefined)
    }

    // Export logs as CSV
    const exportCSV = () => {
        const headers = [
            "ID",
            "Action",
            "Méthode",
            "ID Utilisateur",
            "Utilisateur",
            "Date",
            "ID Produit",
            "Contact",
            "Catégorie",
            "Marque",
        ]
        const csvRows = [
            headers.join(","),
            ...filteredLogs.map((log) =>
                [
                    log.id,
                    log.action,
                    log.method,
                    log.userId,
                    log.userName,
                    format(log.date, "dd/MM/yyyy HH:mm:ss"),
                    log.productId,
                    log.contact,
                    log.category,
                    log.brand,
                ].join(","),
            ),
        ]

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `historique_activites_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Get action icon
    const getActionIcon = (action: string) => {
        switch (action) {
            case "Création":
                return <Plus className="h-4 w-4" />
            case "Modification":
                return <Pencil className="h-4 w-4" />
            case "Suppression":
                return (
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                )
            case "Consultation":
                return (
                    <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                )
            default:
                return null
        }
    }

    // Get action badge color
    const getActionBadgeColor = (action: string) => {
        switch (action) {
            case "Création":
                return "bg-green-100 text-green-800 hover:bg-green-100/80"
            case "Modification":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
            case "Suppression":
                return "bg-red-100 text-red-800 hover:bg-red-100/80"
            case "Consultation":
                return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
        }
    }

    // Format date range for display
    const formatDateRangeDisplay = () => {
        if (!dateRange || !dateRange.start || !dateRange.end) {
            return "Sélectionner une période"
        }

        if (dateRangeType !== "custom") {
            return dateRangeOptions.find((option) => option.value === dateRangeType)?.label
        }

        return `${format(dateRange.start, "dd/MM/yyyy")} - ${format(dateRange.end, "dd/MM/yyyy")}`
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-1 relative max-w-sm bg-[#e6e7eb]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full" // Padding gauche pour faire de la place à l'icône
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={actionFilter || "all"}
                            onValueChange={(value) => setActionFilter(value === "all" ? null : value)}
                        >
                            <SelectTrigger className="w-[180px] bg-[#e6e7eb]">
                                <SelectValue placeholder="Filtrer par action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les actions</SelectItem>
                                <SelectItem value="Création">Création</SelectItem>
                                <SelectItem value="Modification">Modification</SelectItem>
                                <SelectItem value="Suppression">Suppression</SelectItem>
                                <SelectItem value="Consultation">Consultation</SelectItem>
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-[220px] justify-between bg-[#e6e7eb]">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>{formatDateRangeDisplay()}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[220px]">
                                {dateRangeOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option.value}
                                        className={dateRangeType === option.value ? "bg-muted" : ""}
                                        onClick={() => handleDateRangeTypeChange(option.value)}
                                    >
                                        {option.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {dateRangeType === "custom" && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Choisir les dates
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        initialFocus
                                        mode="range"
                                        defaultMonth={customDateRange?.from}
                                        selected={customDateRange}
                                        onSelect={handleCustomDateRangeChange}
                                        numberOfMonths={2}
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}

                        <Button className="bg-[#e6e7eb]" variant="outline" size="icon" onClick={exportCSV} title="Exporter en CSV">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                        <Card key={log.id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-8 w-8 border">
                                        <div className="flex h-full w-full items-center justify-center bg-muted">
                                            {log.userName.charAt(0)}
                                        </div>
                                    </Avatar>

                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{log.userName}</span>
                                                <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                                                    <span className="flex items-center gap-1">
                                                        {getActionIcon(log.action)}
                                                        {log.action}
                                                    </span>
                                                </Badge>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {format(log.date, "dd/MM/yyyy HH:mm:ss", { locale: fr })}
                                            </span>
                                        </div>

                                        {log.action === "Création" && (
                                            <div>
                                                <p className="font-medium mb-2">Nouvelle création:</p>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Champ</TableHead>
                                                                <TableHead>Valeur</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {log.fields?.map((field, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{field.name}</TableCell>
                                                                    <TableCell>{field.value}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}

                                        {log.action === "Modification" && (
                                            <div>
                                                <p className="font-medium mb-2">Modifications effectuées:</p>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Champ</TableHead>
                                                                <TableHead>Ancienne valeur</TableHead>
                                                                <TableHead>Nouvelle valeur</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {log.changes?.map((change, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{change.field}</TableCell>
                                                                    <TableCell>{change.oldValue}</TableCell>
                                                                    <TableCell>{change.newValue}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}

                                        {log.action === "Suppression" && (
                                            <div>
                                                <p className="font-medium mb-2">Élément supprimé:</p>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Champ</TableHead>
                                                                <TableHead>Valeur</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {log.fields?.map((field, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{field.name}</TableCell>
                                                                    <TableCell>{field.value}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}

                                        {log.action === "Consultation" && (
                                            <div>
                                                <p className="font-medium mb-2">Élément consulté:</p>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Champ</TableHead>
                                                                <TableHead>Valeur</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {log.fields?.map((field, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{field.name}</TableCell>
                                                                    <TableCell>{field.value}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">Aucune activité trouvée.</div>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                Affichage de {filteredLogs.length} sur {logs.length} entrées
            </div>
        </div>
    )
}

