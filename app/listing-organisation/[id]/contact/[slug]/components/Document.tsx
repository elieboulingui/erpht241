"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, Search, Plus, PenIcon, Sparkles, FileText, Download, MoreHorizontal, Eye, X, SlidersHorizontal } from 'lucide-react'
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { CommonTable } from "@/components/CommonTable"
import { toast } from "sonner"
import { createDocument } from "../../action/createDocument"

export interface Document {
  id: string
  name: string
  type: string
  date: string
  size: string
  status: "Signé" | "En attente" | "Brouillon"
  createdAt: Date
  
}

// Fonction pour convertir une date au format français JJ/MM/AAAA en objet Date
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year, month - 1, day)
}

// Fonction pour formater une date en JJ/MM/AAAA
const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: fr })
}

export default function Document() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    logo: ""
  })
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    // 1. Récupère l'URL actuelle
    const url = window.location.href

    // 2. Regex pour extraire l’ID du contact à la fin de l’URL
    const match = url.match(/contact\/([a-z0-9]+)$/)

    if (match) {
      const contactId = match[1]

      // 3. Appel API avec contactId
      fetch(`/api/documents?id=${contactId}`)
        .then((res) => res.json())
        .then((data) => {
          // Optionnel : convertir les dates
          const parsed = data.map((doc: any) => ({
            ...doc,
            createdAt: new Date(doc.createdAt),
            date: new Date(doc.date).toLocaleDateString("fr-FR"),
          }))
          setDocuments(parsed)
        })
        .catch((err) => {
          console.error("Erreur lors du fetch des documents :", err)
        })
    }
  }, [])


  // État pour le formulaire d'ajout/modification
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentDocument, setCurrentDocument] = useState<Document>({
    id: "",
    name: "",
    type: "PDF",
    date: formatDate(new Date()),
    size: "0 KB",
    status: "Brouillon",
    createdAt: new Date(),
  })

  // État pour la prévisualisation du document
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // État pour les filtres
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [filters, setFilters] = useState({
    types: [] as string[],
    statuses: [] as string[],
    dateRange: {
      from: null as Date | null,
      to: null as Date | null,
    },
    sizeRange: {
      min: "",
      max: "",
    },
  })
  const [activeFilters, setActiveFilters] = useState(0)
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null)

  // Calcul du nombre de filtres actifs
  useEffect(() => {
    let count = 0
    if (filters.types.length > 0) count++
    if (filters.statuses.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.sizeRange.min || filters.sizeRange.max) count++
    setActiveFilters(count)
  }, [filters])

  // Fonction pour appliquer les filtres
  const applyFilters = (docs: Document[]) => {
    return docs.filter(doc => {
      // Filtre par type
      if (filters.types.length > 0 && !filters.types.includes(doc.type)) {
        return false
      }
      
      // Filtre par statut
      if (filters.statuses.length > 0 && !filters.statuses.includes(doc.status)) {
        return false
      }
      
      // Filtre par date
      if (filters.dateRange.from || filters.dateRange.to) {
        const docDate = parseDate(doc.date)
        if (filters.dateRange.from && docDate < filters.dateRange.from) {
          return false
        }
        if (filters.dateRange.to) {
          // Ajouter un jour pour inclure la date de fin
          const endDate = new Date(filters.dateRange.to)
          endDate.setDate(endDate.getDate() + 1)
          if (docDate > endDate) {
            return false
          }
        }
      }
      
      // Filtre par taille (conversion approximative)
      if (filters.sizeRange.min || filters.sizeRange.max) {
        const sizeInKB = convertSizeToKB(doc.size)
        if (filters.sizeRange.min && sizeInKB < parseFloat(filters.sizeRange.min)) {
          return false
        }
        if (filters.sizeRange.max && sizeInKB > parseFloat(filters.sizeRange.max)) {
          return false
        }
      }
      
      return true
    })
  }

  // Fonction pour convertir la taille en KB
  const convertSizeToKB = (sizeStr: string): number => {
    const value = parseFloat(sizeStr.split(' ')[0])
    if (sizeStr.includes('MB')) {
      return value * 1024
    }
    return value
  }

  // Fonction pour trier les documents
  const sortDocuments = (docs: Document[]) => {
    if (!sortConfig) return docs

    return [...docs].sort((a, b) => {
      if (sortConfig.key === 'name') {
        return sortConfig.direction === 'ascending' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      
      if (sortConfig.key === 'date') {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        return sortConfig.direction === 'ascending' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }
      
      if (sortConfig.key === 'size') {
        const sizeA = convertSizeToKB(a.size)
        const sizeB = convertSizeToKB(b.size)
        return sortConfig.direction === 'ascending' 
          ? sizeA - sizeB
          : sizeB - sizeA
      }
      
      if (sortConfig.key === 'type') {
        return sortConfig.direction === 'ascending' 
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type)
      }
      
      if (sortConfig.key === 'status') {
        return sortConfig.direction === 'ascending' 
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      }
      
      return 0
    })
  }

  // Fonction pour gérer le tri
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'descending') {
      // Si on clique une troisième fois, on supprime le tri
      setSortConfig(null)
      return
    }
    
    setSortConfig({ key, direction })
  }

  // Filtrer et trier les documents
  const filteredDocuments = sortDocuments(
    applyFilters(
      documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  )

  const handleManualClick = () => {
    setIsEditMode(false)
    setCurrentDocument({
      id: (documents.length + 1).toString(),
      name: "",
      type: "PDF",
      date: formatDate(new Date()),
      size: "0 KB",
      status: "Brouillon",
      createdAt: new Date(),
    })
    setIsFormSheetOpen(true)
    setIsDropdownOpen(false)
  }

  const handleAIClick = () => {
    setIsCreating(true)
    setIsDropdownOpen(false)
    // Simuler un délai de création avec IA
    setTimeout(() => {
      const today = new Date()
      const newDocument: Document = {
        id: (documents.length + 1).toString(),
        name: "Document généré par IA",
        type: "PDF",
        date: formatDate(today),
        size: "1.5 MB",
        status: "Brouillon",
        createdAt: today,
      }
      setDocuments([...documents, newDocument])
      setIsCreating(false)
      toast.message( "Le document a été généré avec succès par l'IA.",
      )
    }, 2000)
  }

  const handleEditDocument = (id: string) => {
    const docToEdit = documents.find((doc) => doc.id === id)
    if (docToEdit) {
      setCurrentDocument(docToEdit)
      setIsEditMode(true)
      setIsFormSheetOpen(true)
    }
  }

  const handlePreviewDocument = (id: string) => {
    const docToPreview = documents.find((doc) => doc.id === id)
    if (docToPreview) {
      setPreviewDocument(docToPreview)
      setIsPreviewOpen(true)
    }
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
    toast.message( "Le document a été supprimé avec succès.",
    )
  }

  const handleSaveDocument = async () => {
    const contactId = window.location.href.match(/contact\/([a-z0-9]+)$/)?.[1]
  
    if (!contactId) {
      toast.error("Impossible de récupérer l'ID du contact depuis l'URL.")
      return
    }
  
    const documentToSave = {
      ...currentDocument,
      url: formData.logo, 
    }
  
    // Quick validation
    if (!documentToSave.name || !documentToSave.type || !documentToSave.status || !documentToSave.date || !documentToSave.url) {
      toast.error("Merci de remplir tous les champs obligatoires.")
      return
    }
  
    // Validate the date again, ensure it's a valid date string
  
  
    const payload = {
      name: documentToSave.name,
      type: documentToSave.type,
      status: documentToSave.status,
      date: parseDate.toString(),
      size: documentToSave.size,
      contactId,
      url: documentToSave.url,
    }
  
    try {
      const result = await createDocument(payload)
  
      if (!result.success) {
        throw new Error(result.error || "Erreur inconnue")
      }
  
      toast.success("Document créé avec succès !")
      setIsFormSheetOpen(false)
  
    } catch (error: any) {
      console.error("Erreur:", error)
      toast.error("Une erreur est survenue : " + error.message)
    }
  }
  
  const handleCalendarSelect = (date: Date | null) => {
    if (date) {
      const formattedDate = formatDate(date)
      const parsedDate = new Date(formattedDate)
      
      if (isNaN(parsedDate.getTime())) {
        toast.error("La date sélectionnée est invalide.")
      } else {
        setCurrentDocument({
          ...currentDocument,
          date: formattedDate,
          createdAt: date, // Assuming you want to keep the raw Date object for createdAt
        })
      }
    }
  }
  

  const handleResetFilters = () => {
    setFilters({
      types: [],
      statuses: [],
      dateRange: {
        from: null,
        to: null,
      },
      sizeRange: {
        min: "",
        max: "",
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Signé":
        return "bg-green-100 text-green-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      case "Brouillon":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Obtenir les types uniques pour les filtres
  const uniqueTypes = Array.from(new Set(documents.map(doc => doc.type)))
  
  // Obtenir les statuts uniques pour les filtres
  const uniqueStatuses = Array.from(new Set(documents.map(doc => doc.status)))

  const headers = [
    { key: "name", label: "Nom", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "size", label: "Taille", sortable: true },
    { key: "status", label: "Statut", sortable: true },
    { key: "actions", label: "Actions", align: "right" as const },
  ]

  const rows = filteredDocuments.map((doc) => ({
    id: doc.id,
    name: (
      <div className="flex items-center">
        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
        {doc.name}
      </div>
    ),
    type: doc.type,
    date: doc.date,
    size: doc.size,
    status: (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>{doc.status}</span>
    ),
    actions: (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            handlePreviewDocument(doc.id)
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Download className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditDocument(doc.id)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Partager</DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement le document.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDeleteDocument(doc.id)}
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }))

  return (
    <div className="space-y-6">
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document"
                className="pl-8 bg-[#e6e7eb]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 bg-[#e6e7eb]">
                  <Filter className="h-4 w-4" />
                  Filtres avancés
                  {activeFilters > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-[#7f1d1c] text-white">
                      {activeFilters}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[350px] sm:w-[450px]">
                <SheetHeader>
                  <SheetTitle>Filtres avancés</SheetTitle>
                  <SheetDescription>
                    Filtrez vos documents selon différents critères.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Type de document</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`type-${type}`} 
                            checked={filters.types.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  types: [...filters.types, type]
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  types: filters.types.filter(t => t !== type)
                                })
                              }
                            }}
                          />
                          <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Statut</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueStatuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`status-${status}`} 
                            checked={filters.statuses.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  statuses: [...filters.statuses, status]
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  statuses: filters.statuses.filter(s => s !== status)
                                })
                              }
                            }}
                          />
                          <label htmlFor={`status-${status}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Période</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date-from">Du</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              id="date-from"
                            >
                              {filters.dateRange.from ? (
                                format(filters.dateRange.from, "dd/MM/yyyy")
                              ) : (
                                <span className="text-muted-foreground">Sélectionner...</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filters.dateRange.from || undefined}
                              onSelect={(date) => setFilters({
                                ...filters,
                                dateRange: {
                                  ...filters.dateRange,
                               
                                }
                              })}
                              initialFocus
                              locale={fr}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-to">Au</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                              id="date-to"
                            >
                              {filters.dateRange.to ? (
                                format(filters.dateRange.to, "dd/MM/yyyy")
                              ) : (
                                <span className="text-muted-foreground">Sélectionner...</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filters.dateRange.to || undefined}
                              onSelect={(date) => setFilters({
                                ...filters,
                                dateRange: {
                                  ...filters.dateRange,
                              
                                }
                              })}
                              initialFocus
                              locale={fr}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Taille (KB)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size-min">Min</Label>
                        <Input
                          id="size-min"
                          type="number"
                          placeholder="0"
                          value={filters.sizeRange.min}
                          onChange={(e) => setFilters({
                            ...filters,
                            sizeRange: {
                              ...filters.sizeRange,
                              min: e.target.value
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size-max">Max</Label>
                        <Input
                          id="size-max"
                          type="number"
                          placeholder="5000"
                          value={filters.sizeRange.max}
                          onChange={(e) => setFilters({
                            ...filters,
                            sizeRange: {
                              ...filters.sizeRange,
                              max: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser
                  </Button>
                  <SheetClose asChild>
                    <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
                      Appliquer les filtres
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {activeFilters > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={handleResetFilters}
              >
                <X className="h-3 w-3" />
                Effacer les filtres
              </Button>
            )}
          </div>

          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold" disabled={isCreating}>
                {isCreating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Création...
                  </span>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" /> Ajouter un document
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[213px]">
              <DropdownMenuItem onClick={handleManualClick} className="cursor-pointer" disabled={isCreating}>
                <PenIcon className="h-4 w-4 mr-2" />
                <span>Manuellement</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAIClick} className="cursor-pointer" disabled={isCreating}>
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Via IA</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Affichage des filtres actifs */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.types.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                Types: {filters.types.join(', ')}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, types: []})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.statuses.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                Statuts: {filters.statuses.join(', ')}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, statuses: []})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="outline" className="flex items-center gap-1">
                Période: {filters.dateRange.from ? format(filters.dateRange.from, "dd/MM/yyyy") : '...'} - {filters.dateRange.to ? format(filters.dateRange.to, "dd/MM/yyyy") : '...'}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, dateRange: {from: null, to: null}})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(filters.sizeRange.min || filters.sizeRange.max) && (
              <Badge variant="outline" className="flex items-center gap-1">
                Taille: {filters.sizeRange.min || '0'} - {filters.sizeRange.max || '∞'} KB
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({...filters, sizeRange: {min: '', max: ''}})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <CommonTable
          headers={headers}
          rows={rows}
          emptyState={
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun document</h3>
              <p className="text-sm text-muted-foreground">
                {activeFilters > 0 
                  ? "Aucun document ne correspond à vos critères de recherche." 
                  : "Ajoutez votre premier document pour commencer."}
              </p>
              {activeFilters > 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleResetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          }
          onRowClick={(id) => handleEditDocument(id)}
          onSort={handleSort}
        />
      </div>

      {/* Sheet pour l'ajout/modification de document */}
      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{isEditMode ? "Modifier le document" : "Ajouter un document"}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Modifiez les informations du document ici."
                : "Remplissez les informations pour créer un nouveau document."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={currentDocument.name}
                onChange={(e) => setCurrentDocument({ ...currentDocument, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={currentDocument.type}
                onValueChange={(value) => setCurrentDocument({ ...currentDocument, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOCX">DOCX</SelectItem>
                  <SelectItem value="XLSX">XLSX</SelectItem>
                  <SelectItem value="PPTX">PPTX</SelectItem>
                  <SelectItem value="JPG">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={currentDocument.status}
                onValueChange={(value: "Signé" | "En attente" | "Brouillon") =>
                  setCurrentDocument({ ...currentDocument, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Signé">Signé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="col-span-3 justify-start text-left font-normal"
                    id="date"
                  >
                    {currentDocument.date || <span className="text-muted-foreground">Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={parseDate(currentDocument.date)}
                    onSelect={(date) => date && setCurrentDocument({ 
                      ...currentDocument, 
                      date: formatDate(date),
                      createdAt: date
                    })}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <label htmlFor="logo" className="cursor-pointer text-black p-4 text-center">
                <UploadButton
                  endpoint="pdfuploader"
                  className="relative h-full w-full ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                  onClientUploadComplete={(res: any) => {
                    console.log("Fichiers uploadés: ", res)
                    if (res && res[0]) {
                      setFormData({ ...formData, logo: res[0].ufsUrl })
                      toast.success("Upload du logo terminé !")
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Erreur lors de l'upload: ${error.message}`)
                  }}
                />
              </label>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsFormSheetOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveDocument} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
              {isEditMode ? "Mettre à jour" : "Créer"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog pour la prévisualisation du document */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {previewDocument?.name}{" "}
              <span className="text-sm font-normal text-muted-foreground">({previewDocument?.type})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-muted/20 rounded-md p-4 h-full">
            {previewDocument?.type === "PDF" ? (
              <div className="flex flex-col items-center justify-center h-full">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center">Prévisualisation du document PDF</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Taille: {previewDocument.size} | Date: {previewDocument.date} | Statut:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(previewDocument.status)}`}
                  >
                    {previewDocument.status}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center">Prévisualisation non disponible pour ce type de document</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Type: {previewDocument?.type} | Taille: {previewDocument?.size}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Fermer
            </Button>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
              <Download className="h-4 w-4 mr-2" /> Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
