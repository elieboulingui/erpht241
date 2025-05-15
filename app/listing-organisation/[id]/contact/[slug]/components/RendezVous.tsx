"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Filter,
  Search,
  Plus,
  PenIcon,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  Edit,
  Video,
  Phone,
  Users,
  CalendarDays,
  Eye,
  X,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CommonTable } from "@/components/CommonTable"
import createMeeting from "../../action/createMeeting"
import { MeetingType } from "@prisma/client"
import updateMeeting from "../../action/updateMeeting"

export interface RendezVous {
  id: string;
  title: string;
  date: any;
  time: string;
  duration: string;
  location: string;
  description: string | null;
  participants?: string[];
  type: "Présentiel" | "Visioconférence" | "Téléphonique"; // Ensure this matches MeetingType
  status: "Confirmé" | "En attente" | "Annulé";
  createdAt: Date;
}

export interface member {
  id : string ;
  name : string;
}

// Fonction pour convertir une date au format français JJ/MM/AAAA en objet Date
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("/").map(Number)
  return new Date(year, month - 1, day)
}

// Fonction pour formater une date en JJ/MM/AAAA
const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: fr })
}

export default function RendezVous() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])

  // État pour le formulaire d'ajout/modification
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentRendezVous, setCurrentRendezVous] = useState<RendezVous>({
    id: "",
    title: "",
    date: formatDate(new Date()),
    time: "",
    duration: "1h",
    location: "",
    description: "",
    participants: [],
    type: "Présentiel",
    status: "En attente",
    createdAt: new Date(),
  })

  // État pour la vue détaillée du rendez-vous
  const [detailRendezVous, setDetailRendezVous] = useState<RendezVous | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [availableParticipants, setAvailableParticipants] = useState<member[]>([]);
  
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  const [filters, setFilters] = useState({
    types: [] as string[],
    statuses: [] as string[],
    dateRange: {
      from: null as Date | null,
      to: null as Date | null,
    },
    durations: [] as string[],
    participants: "",
  })
  const [activeFilters, setActiveFilters] = useState(0)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)


  useEffect(() => {
    // Extraction de l'ID du contact depuis l'URL
    const url = window.location.href;
    const match = url.match(/\/listing-organisation\/([^/]+)/);

    if (match && match[1]) {
      const contactId = match[1];

      // Utilisation de l'ID de contact dans l'appel API
      fetch(`/api/member?contactId=${contactId}`)
        .then(res => res.json())
        .then(data => setAvailableParticipants(data))
        .catch(err => console.error("Erreur de chargement des participants", err));
    }
  }, []); // L'array vide fait que l'effet s'exécute uniquement au montage du composant


 useEffect(() => {
    const url = window.location.href;

    // Utilisation de regex pour extraire l'ID du contact dans l'URL
    const match = url.match(/\/contact\/([^/]+)/);

    if (match && match[1]) {
      const contactId = match[1];

      // Appel de l'API pour récupérer les informations du rendez-vous
      fetch(`/api/contactmeeting?id=${contactId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Mise à jour de l'état avec les données récupérées
          setRendezVous(data);
          setLoading(false);
        })
        .catch(err => {
          // Gestion des erreurs
          setError('Erreur lors de la récupération des données');
          setLoading(false);
        });
    } else {
      setError("Impossible de trouver l'ID du contact dans l'URL.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let count = 0
    if (filters.types.length > 0) count++
    if (filters.statuses.length > 0) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.durations.length > 0) count++
    if (filters.participants) count++
    setActiveFilters(count)
  }, [filters])

  // Fonction pour appliquer les filtres
  const applyFilters = (rdvs: RendezVous[]) => {
    return rdvs.filter((rdv) => {
      // Filtre par type
      if (filters.types.length > 0 && !filters.types.includes(rdv.type)) {
        return false
      }

      // Filtre par statut
      if (filters.statuses.length > 0 && !filters.statuses.includes(rdv.status)) {
        return false
      }

      // Filtre par date
      if (filters.dateRange.from || filters.dateRange.to) {
        const rdvDate = parseDate(rdv.date)
        if (filters.dateRange.from && rdvDate < filters.dateRange.from) {
          return false
        }
        if (filters.dateRange.to) {
          // Ajouter un jour pour inclure la date de fin
          const endDate = new Date(filters.dateRange.to)
          endDate.setDate(endDate.getDate() + 1)
          if (rdvDate > endDate) {
            return false
          }
        }
      }

      // Filtre par durée
      if (filters.durations.length > 0 && !filters.durations.includes(rdv.duration)) {
        return false
      }

      // Filtre par participants
      if (filters.participants) {
        const searchParticipant = filters.participants.toLowerCase()
        const hasParticipant = rdv.participants?.some((participant) =>
          participant.toLowerCase().includes(searchParticipant),
        )
        if (!hasParticipant) {
          return false
        }
      }

      return true
    })
  }

  // Fonction pour trier les rendez-vous
  const sortRendezVous = (rdvs: RendezVous[]) => {
    if (!sortConfig) return rdvs

    return [...rdvs].sort((a, b) => {
      if (sortConfig.key === "title") {
        return sortConfig.direction === "ascending" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      }

      if (sortConfig.key === "date") {
        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)
        return sortConfig.direction === "ascending"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime()
      }

      if (sortConfig.key === "time") {
        return sortConfig.direction === "ascending" ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time)
      }

      if (sortConfig.key === "duration") {
        // Convertir la durée en minutes pour le tri
        const getDurationMinutes = (duration: string) => {
          if (duration.includes("h")) {
            const parts = duration.split("h")
            const hours = Number.parseInt(parts[0]) || 0
            const minutes = Number.parseInt(parts[1]) || 0
            return hours * 60 + minutes
          }
          return Number.parseInt(duration) || 0
        }

        const durationA = getDurationMinutes(a.duration)
        const durationB = getDurationMinutes(b.duration)

        return sortConfig.direction === "ascending" ? durationA - durationB : durationB - durationA
      }

      if (sortConfig.key === "type") {
        return sortConfig.direction === "ascending" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
      }

      if (sortConfig.key === "location") {
        return sortConfig.direction === "ascending"
          ? a.location.localeCompare(b.location)
          : b.location.localeCompare(a.location)
      }

      if (sortConfig.key === "status") {
        return sortConfig.direction === "ascending"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status)
      }

      return 0
    })
  }

  // Fonction pour gérer le tri
  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === "descending") {
      // Si on clique une troisième fois, on supprime le tri
      setSortConfig(null)
      return
    }

    setSortConfig({ key, direction })
  }

  // Filtrer et trier les rendez-vous
  const filteredRendezVous = sortRendezVous(
    applyFilters(
      rendezVous.filter(
        (rdv) =>
          rdv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rdv.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rdv.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rdv.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rdv.participants?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    ),
  )

  const handleManualClick = () => {
    setIsEditMode(false)
    const today = new Date()
    const formattedDate = formatDate(today)

    setCurrentRendezVous({
      id: (rendezVous.length + 1).toString(),
      title: "",
      date: formattedDate,
      time: "",
      duration: "1h",
      location: "",
      description: "",
      participants: [],
      type: "Présentiel",
      status: "En attente",
      createdAt: today,
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
      const newRendezVous: RendezVous = {
        id: (rendezVous.length + 1).toString(),
        title: "Rendez-vous suggéré par IA",
        date: "25/05/2025",
        time: "15:30",
        duration: "45min",
        location: "Google Meet",
        description: "Rendez-vous généré automatiquement par l'IA en fonction de l'historique client",
        participants: ["Jean Dupont", "Marie Martin"],
        type: "Visioconférence",
        status: "En attente",
        createdAt: today,
      }
      setRendezVous([...rendezVous, newRendezVous])
      setIsCreating(false)
     toast.message("Le rendez-vous a été généré avec succès par l'IA.",
      )
    }, 2000)
  }

  const handleEditRendezVous = (id: string) => {
    const rdvToEdit = rendezVous.find((rdv) => rdv.id === id)
    if (rdvToEdit) {
      setCurrentRendezVous(rdvToEdit)
      setIsEditMode(true)
      setIsFormSheetOpen(true)
    }
  }

  const handleViewDetail = (id: string) => {
    const rdvToView = rendezVous.find((rdv) => rdv.id === id)
    if (rdvToView) {
      setDetailRendezVous(rdvToView)
      setIsDetailOpen(true)
    }
  }

  const handleDeleteRendezVous = (id: string) => {
    setRendezVous(rendezVous.filter((rdv) => rdv.id !== id))
     toast.message("Le rendez-vous a été supprimé avec succès.",
    )
  }
  const getContactIdFromUrl = (url: string): string | null => {
    const regex = /\/contact\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null; // Si une correspondance est trouvée, on retourne le contactId
  };
  
  const handleSaveRendezVous = async () => {
    // Récupérer l'URL actuelle
    const url = window.location.href;
    const contactIdFromUrl = getContactIdFromUrl(url);
  
    // Si le contactId n'a pas été trouvé dans l'URL, afficher un message d'erreur
    if (!contactIdFromUrl) {
      toast.message("Le contact associé au rendez-vous est requis.");
      return;
    }
  
    // Validation des champs
    if (currentRendezVous.title.trim() === "") {
      toast.message("Le titre du rendez-vous est requis.");
      return;
    }
  
    if (currentRendezVous.date.trim() === "" || currentRendezVous.time.trim() === "") {
      toast.message("La date et l'heure du rendez-vous sont requises.");
      return;
    }
  
    try {
      // Créer un objet rendez-vous prêt à envoyer
      const rendezVousData = {
        ...currentRendezVous,
        contactId: contactIdFromUrl,
        description: currentRendezVous.description ?? null,
      };
  
      if (isEditMode) {
        // Mise à jour via API
        await updateMeeting(currentRendezVous.id, rendezVousData as any);
  
        // Mettre à jour localement la liste des rendez-vous
        setRendezVous(prev =>
          prev.map((rdv) =>
            rdv.id === currentRendezVous.id ? rendezVousData : rdv
          )
        );
  
        toast.success("Le rendez-vous a été modifié avec succès.");
      } else {
        // Création via API
        const newRendezVous = await createMeeting({
          ...rendezVousData,
          type: currentRendezVous.type as MeetingType,
        });
  
        setRendezVous(prev =>
          prev.map((rdv) =>
            rdv.id === currentRendezVous.id ? rendezVousData : rdv
          )
        );
        
  
        toast.success("Le rendez-vous a été créé avec succès.");
      }
  
      setIsFormSheetOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création/modification du rendez-vous:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  
  
  
  

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const participantsText = e.target.value
    const participantsArray = participantsText
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p !== "")
    setCurrentRendezVous({ ...currentRendezVous, participants: participantsArray })
  }

  const handleResetFilters = () => {
    setFilters({
      types: [],
      statuses: [],
      dateRange: {
        from: null,
        to: null,
      },
      durations: [],
      participants: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-green-100 text-green-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      case "Annulé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Présentiel":
        return <MapPin className="h-4 w-4 mr-2" />
      case "Visioconférence":
        return <Video className="h-4 w-4 mr-2" />
      case "Téléphonique":
        return <Phone className="h-4 w-4 mr-2" />
      default:
        return <Calendar className="h-4 w-4 mr-2" />
    }
  }

  // Obtenir les types uniques pour les filtres
  const uniqueTypes = Array.from(new Set(rendezVous.map((rdv) => rdv.type)))

  // Obtenir les statuts uniques pour les filtres
  const uniqueStatuses = Array.from(new Set(rendezVous.map((rdv) => rdv.status)))

  // Obtenir les durées uniques pour les filtres
  const uniqueDurations = Array.from(new Set(rendezVous.map((rdv) => rdv.duration)))

  const headers = [
    { key: "title", label: "Titre", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "time", label: "Heure", sortable: true },
    { key: "duration", label: "Durée", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "location", label: "Lieu", sortable: true },
    { key: "status", label: "Statut", sortable: true },
    { key: "actions", label: "Actions", align: "right" as const },
  ]

  const rows = filteredRendezVous.map((rdv) => ({
    id: rdv.id,
    title: (
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
        {rdv.title}
      </div>
    ),
    date: rdv.date,
    time: rdv.time,
    duration: rdv.duration,
    type: (
      <div className="flex items-center">
        {getTypeIcon(rdv.type)}
        {rdv.type}
      </div>
    ),
    location: rdv.location,
    status: (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rdv.status)}`}>{rdv.status}</span>
    ),
    actions: (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            handleViewDetail(rdv.id)
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            handleEditRendezVous(rdv.id)
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditRendezVous(rdv.id)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Rappel</DropdownMenuItem>
            <DropdownMenuItem>
              {rdv.status === "Confirmé" ? "Marquer comme en attente" : "Marquer comme confirmé"}
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                  {rdv.status === "Annulé" ? "Supprimer" : "Annuler"}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {rdv.status === "Annulé"
                      ? "Cette action ne peut pas être annulée. Cela supprimera définitivement le rendez-vous."
                      : "Voulez-vous vraiment annuler ce rendez-vous ?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      if (rdv.status === "Annulé") {
                        handleDeleteRendezVous(rdv.id)
                      } else {
                        setRendezVous(rendezVous.map((r) => (r.id === rdv.id ? { ...r, status: "Annulé" } : r)))
                         toast.message( "Le rendez-vous a été annulé avec succès.",
                        )
                      }
                    }}
                  >
                    {rdv.status === "Annulé" ? "Supprimer" : "Annuler le rendez-vous"}
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
                placeholder="Rechercher un rendez-vous"
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
                  <SheetDescription>Filtrez vos rendez-vous selon différents critères.</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Type de rendez-vous</h3>
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
                                  types: [...filters.types, type],
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  types: filters.types.filter((t) => t !== type),
                                })
                              }
                            }}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
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
                                  statuses: [...filters.statuses, status],
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  statuses: filters.statuses.filter((s) => s !== status),
                                })
                              }
                            }}
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Durée</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueDurations.map((duration) => (
                        <div key={duration} className="flex items-center space-x-2">
                          <Checkbox
                            id={`duration-${duration}`}
                            checked={filters.durations.includes(duration)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  durations: [...filters.durations, duration],
                                })
                              } else {
                                setFilters({
                                  ...filters,
                                  durations: filters.durations.filter((d) => d !== duration),
                                })
                              }
                            }}
                          />
                          <label
                            htmlFor={`duration-${duration}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {duration}
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
                            <CalendarComponent
                              mode="single"
                              selected={filters.dateRange.from || undefined}
                              onSelect={(date) =>
                                setFilters({
                                  ...filters,
                                  dateRange: {
                                    ...filters.dateRange,
                                  },
                                })
                              }
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
                            <CalendarComponent
                              mode="single"
                              selected={filters.dateRange.to || undefined}
                              onSelect={(date) =>
                                setFilters({
                                  ...filters,
                                  dateRange: {
                                    ...filters.dateRange,
                                  },
                                })
                              }
                              initialFocus
                              locale={fr}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Participants</h3>
                    <div className="space-y-2">
                      <Input
                        placeholder="Rechercher un participant"
                        value={filters.participants}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            participants: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser
                  </Button>
                  <SheetClose asChild>
                    <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">Appliquer les filtres</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={handleResetFilters}>
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
                    <Plus className="h-4 w-4 mr-1" /> Ajouter un rendez-vous
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
                Types: {filters.types.join(", ")}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, types: [] })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.statuses.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                Statuts: {filters.statuses.join(", ")}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, statuses: [] })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.durations.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                Durées: {filters.durations.join(", ")}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, durations: [] })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="outline" className="flex items-center gap-1">
                Période: {filters.dateRange.from ? format(filters.dateRange.from, "dd/MM/yyyy") : "..."} -{" "}
                {filters.dateRange.to ? format(filters.dateRange.to, "dd/MM/yyyy") : "..."}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, dateRange: { from: null, to: null } })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {filters.participants && (
              <Badge variant="outline" className="flex items-center gap-1">
                Participant: {filters.participants}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, participants: "" })}
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
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun rendez-vous</h3>
              <p className="text-sm text-muted-foreground">
                {activeFilters > 0
                  ? "Aucun rendez-vous ne correspond à vos critères de recherche."
                  : "Ajoutez votre premier rendez-vous pour commencer."}
              </p>
              {activeFilters > 0 && (
                <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          }
          onRowClick={(id) => handleViewDetail(id)}
          onSort={handleSort}
        />
      </div>

      {/* Sheet pour l'ajout/modification de rendez-vous */}
      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{isEditMode ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}</SheetTitle>
            <SheetDescription>
              {isEditMode
                ? "Modifiez les informations du rendez-vous ici."
                : "Remplissez les informations pour créer un nouveau rendez-vous."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                value={currentRendezVous.title}
                onChange={(e) => setCurrentRendezVous({ ...currentRendezVous, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="col-span-3 justify-start text-left font-normal" id="date">
                    {currentRendezVous.date || <span className="text-muted-foreground">Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={parseDate(currentRendezVous.date)}
                    onSelect={(date) =>
                      date &&
                      setCurrentRendezVous({
                        ...currentRendezVous,
                        date: formatDate(date),
                        createdAt: date,
                      })
                    }
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Heure
              </Label>
              <Input
                id="time"
                type="text"
                placeholder="HH:MM"
                value={currentRendezVous.time}
                onChange={(e) => setCurrentRendezVous({ ...currentRendezVous, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Durée
              </Label>
              <Select
                value={currentRendezVous.duration}
                onValueChange={(value) => setCurrentRendezVous({ ...currentRendezVous, duration: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="45min">45 minutes</SelectItem>
                  <SelectItem value="1h">1 heure</SelectItem>
                  <SelectItem value="1h30">1 heure 30</SelectItem>
                  <SelectItem value="2h">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={currentRendezVous.type}
                onValueChange={(value: "Présentiel" | "Visioconférence" | "Téléphonique") =>
                  setCurrentRendezVous({ ...currentRendezVous, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Présentiel">Présentiel</SelectItem>
                  <SelectItem value="Visioconférence">Visioconférence</SelectItem>
                  <SelectItem value="Téléphonique">Téléphonique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Lieu
              </Label>
              <Input
                id="location"
                value={currentRendezVous.location}
                onChange={(e) => setCurrentRendezVous({ ...currentRendezVous, location: e.target.value })}
                className="col-span-3"
              />
            </div>
         <div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="participants" className="text-right">
    Participants
  </Label>
  <select>
        {Array.isArray(availableParticipants) && availableParticipants.length > 0 ? (
          availableParticipants.map((participant, index) => (
            <option key={index} value={participant.id}>
              {participant.name}
            </option>
          ))
        ) : (
          <option>Aucun participant disponible</option>
        )}
      </select>
</div>


            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={currentRendezVous.status}
                onValueChange={(value: "Confirmé" | "En attente" | "Annulé") =>
                  setCurrentRendezVous({ ...currentRendezVous, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Confirmé">Confirmé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentRendezVous.description || ""}
                onChange={(e) => setCurrentRendezVous({ ...currentRendezVous, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsFormSheetOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveRendezVous} className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
              {isEditMode ? "Mettre à jour" : "Créer"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialog pour la vue détaillée du rendez-vous */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>
          {detailRendezVous && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{detailRendezVous.title}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(detailRendezVous.status)}`}
                >
                  {detailRendezVous.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {detailRendezVous.date} à {detailRendezVous.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Durée: {detailRendezVous.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getTypeIcon(detailRendezVous.type)}
                <span>
                  {detailRendezVous.type} - {detailRendezVous.location}
                </span>
              </div>

              {detailRendezVous.participants && detailRendezVous.participants.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Participants:</span>
                  </div>
                  <ul className="list-disc pl-10">
                    {detailRendezVous.participants.map((participant, index) => (
                      <li key={index}>{participant}</li>
                    ))}
                  </ul>
                </div>
              )}

              {detailRendezVous.description && (
                <div className="space-y-2">
                  <h4 className="font-medium">Description:</h4>
                  <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
                    {detailRendezVous.description}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Fermer
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (detailRendezVous) {
                  handleEditRendezVous(detailRendezVous.id)
                  setIsDetailOpen(false)
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </Button>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white">
              <Calendar className="h-4 w-4 mr-2" /> Ajouter au calendrier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}