"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Activity,
  FileText,
  CheckSquare,
  User,
  Trash,
  Clock,
  Smile,
  Building2,
  Mail,
  MapPin,
  Phone,
  TrendingUpIcon as TrendingUpDown,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import ContactDetailsHeader from "./ContactDetailsHeader"
import { EditContactModal } from "./EditContactModal"
import Chargement from "@/components/Chargement"

import { DeleteImage } from "../actions/deleteImage"
import { UpdateContactDetail } from "../actions/updateContactDetail"

interface Contact {
  name: string
  email: string
  phone: string
  address: string
  logo?: string
  icon?: React.ReactNode
  stage: string
  tags: string[]
  record: string
  status_contact: string
}

export default function ContactInfo() {
  const [activeTab, setActiveTab] = useState("activity")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Array<{ id: string; text: string; user: string; timestamp: Date }>>([])
  const [contactId, setContactId] = useState<string | null>(null)
  const [contactDetails, setContactDetails] = useState<Contact | null>(null)
  const [showComments, setShowComments] = useState(true)
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Structure de contact vide sans valeurs par défaut
  const safeContact = contactDetails || {
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    icon: <User className="h-4 w-4" />,
    stage: "",
    tags: [],
    record: "",
    status_contact: "",
  }


  
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const url = window.location.href
        const regex = /\/contact\/([a-zA-Z0-9]+)/ // Extraire l'ID du contact de l'URL
        const match = url.match(regex)

        if (!match) {
          throw new Error("ID de contact non trouvé dans l'URL")
        }

        const id = match[1]
        setContactId(id)

        // Récupérer les détails du contact
        const response = await fetch(`api/getcontactDetails?id=${id}`);
        const data = await response.json();
        

        if (!data) {
          throw new Error("Aucune donnée retournée par l'API")
        }

        // Transformer les données API pour correspondre à l'interface Contact
        const transformedData: Contact = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.adresse || "",
          logo: data.logo || "",
          icon: <User className="h-4 w-4" />,
          stage: data.stage || "",
          tags: data.tags ? (Array.isArray(data.tags) ? data.tags : [data.tags]) : [],
          record: data.record || "",
          status_contact: data.status_contact || "",
        }

        setContactDetails(transformedData)
        setIsLoading(false)
      } catch (err) {
        console.error("Erreur lors de la récupération des détails du contact:", err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        setIsLoading(false)
      }
    }

    fetchContactData()
  }, [])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      const updatedContact = {
        ...safeContact,
        tags: [...safeContact.tags, newTag.trim()],
      }
      setContactDetails(updatedContact as Contact)
      setNewTag("")
      e.preventDefault()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedContact = {
      ...safeContact,
      tags: safeContact.tags.filter((tag) => tag !== tagToRemove),
    }
    setContactDetails(updatedContact as Contact)
  }

  const handlePostComment = () => {
    if (comment.trim()) {
      // Créer un nouveau commentaire
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        user: "Vous", // Normalement, vous utiliseriez l'utilisateur connecté
        timestamp: new Date(),
      }

      // Ajouter le commentaire à la liste
      setComments([newComment, ...comments])

      // Réinitialiser le champ de commentaire
      setComment("")

      // Ici vous enverriez normalement le commentaire à votre backend
      console.log("Publication du commentaire:", comment)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "quelques secondes"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""}`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} heure${hours > 1 ? "s" : ""}`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} jour${days > 1 ? "s" : ""}`
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setComment((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDeleteImage = async () => {
    if (!contactId) return

    try {
      const result = await DeleteImage(contactId)

      if (result.success) {
        // Update the local state to reflect the change immediately
        setContactDetails({
          ...safeContact,
          logo: "",
        } as Contact)
      } else {
        setError(result.error || "Échec de la suppression de l'image")
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image:", err)
      setError("Une erreur est survenue lors de la suppression de l'image")
    }
  }

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleSaveContact = async (updatedData: Contact) => {
    if (!contactId) return

    try {
      const result = await UpdateContactDetail(contactId, {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        address: updatedData.address,
        record: updatedData.record,
      })

      if (result.success) {
        // Update the local state to reflect the changes immediately
        setContactDetails({
          ...safeContact,
          ...updatedData,
        } as Contact)
      } else {
        setError(result.error || "Échec de la mise à jour du contact")
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du contact:", err)
      setError("Une erreur est survenue lors de la mise à jour du contact")
      throw err // Rethrow to be caught by the modal
    }
  }

  return (
    <div className="">
      <ContactDetailsHeader />

      {isLoading ? (
        <Chargement />
      ) : error ? (
        <div className="flex items-center justify-center bg-white py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      ) : !contactDetails ? (
        <div className="flex items-center justify-center bg-white py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact introuvable</h2>
            <p className="text-gray-600 mb-4">Les informations de ce contact n'ont pas pu être chargées.</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      ) : (
        <div className="flex bg-white">
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col">
            {/* Zone de contenu */}
            <div className="flex-1 flex">
              {/* Panneau gauche - Détails du contact */}
              <div className="w-[475px] border-r">
                <div className="p-6 flex flex-col">
                  {/* Avatar/logo du contact */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative inline-block">
                      <div className="w-[90px] h-[90px] bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                        {safeContact.logo ? (
                          <img
                            src={safeContact.logo || "/placeholder.svg"}
                            alt={safeContact.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <Building2 className="h-12 w-12" />
                        )}
                      </div>
                      <button
                        className="absolute -bottom-1 -right-1 bg-white border rounded-full p-1 hover:bg-gray-100 transition-colors"
                        aria-label="Supprimer l'image"
                        onClick={handleDeleteImage}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section des propriétés */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-base">Propriétés</h2>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 py-1" onClick={handleOpenEditModal}>
                      Modifier
                    </Button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <PropertyItem
                      icon={<User className="h-4 w-4 " />}
                      label="Type"
                      value={safeContact.status_contact}
                    />
                    <PropertyItem icon={<Building2 className="h-4 w-4" />} label="Nom" value={safeContact.name} />
                    <PropertyItem icon={<Mail className="h-4 w-4" />} label="Email" value={safeContact.email} />
                    <PropertyItem icon={<Phone className="h-4 w-4" />} label="Téléphone" value={safeContact.phone} />
                    <PropertyItem icon={<MapPin className="h-4 w-4" />} label="Adresse" value={safeContact.address} />
                  </div>
                </div>

                <Separator />

                {/* Section étape */}
                <div className="space-y-2 p-5">
                  <h3 className="font-medium">Étape</h3>
                  <Select value={safeContact.stage || ""}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une étape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEAD">Prospect</SelectItem>
                      <SelectItem value="WON">Client</SelectItem>
                      <SelectItem value="QUALIFIED">Prospect potentiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Section étiquettes */}
                <div className="p-6">
                  <h2 className="font-medium mb-4">Étiquettes</h2>
                  <div className="mb-4">
                    <Input
                      placeholder="Tapez votre étiquette et appuyez sur Entrée"
                      className="text-sm"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {safeContact.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="rounded-sm flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 border-gray-200"
                      >
                        {tag}
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveTag(tag)}
                          aria-label={`Supprimer l'étiquette ${tag}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panneau droit - Onglets d'activité */}
              <div className="flex-1">
                <Tabs defaultValue="activity" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start rounded-none h-14 px-4 space-x-5 bg-transparent">
                    <TabsTrigger
                      value="activity"
                      className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                    >
                      <Activity size={16} className="mr-2" />
                      Activité
                    </TabsTrigger>
                    <TabsTrigger
                      value="devis"
                      className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                    >
                      <TrendingUpDown size={16} className="mr-2" />
                      Devis
                    </TabsTrigger>
                    <TabsTrigger
                      value="facture"
                      className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                    >
                      <Building2 size={16} className="mr-2" />
                      Facture
                    </TabsTrigger>
                    <TabsTrigger
                      value="notes"
                      className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                    >
                      <FileText size={16} className="mr-2" />
                      Notes
                    </TabsTrigger>
                    <TabsTrigger
                      value="tasks"
                      className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                    >
                      <CheckSquare size={16} className="mr-2" />
                      Tâches
                    </TabsTrigger>
                    <TabsTrigger
                      value="log"
                      className="data-[state=active]:border-b-2 py-5 data-[state=active]:border-gray-800 data-[state=active]:shadow-none rounded-none"
                    >
                      <LogIn size={16} className="mr-2" />
                      Log
                    </TabsTrigger>
                  </TabsList>

                  <Separator />

                  {/* Contenu de l'onglet Activité */}
                  <TabsContent value="activity" className="p-4 mt-0 max-w-3xl">
                    <div className="mb-4">
                      <div className="flex mt-3">
                        <Avatar className="h-10 w-10 bg-gray-200 p-2.5 mr-2">
                          {safeContact.name.slice(0, 2).toUpperCase()}
                        </Avatar>{" "}
                        <div className="relative w-full">
                          <Input
                            placeholder="Laissez un commentaire..."
                            className="min-h-[80px] text-sm pt-3 pb-10"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            
                          />
                          <div className="absolute right-2 bottom-2 flex items-center gap-2">
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              aria-label="Ajouter un emoji"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                              <Smile size={18} />
                            </button>
                            {showEmojiPicker && (
                              <div
                                ref={emojiPickerRef}
                                className="absolute top-10 right-0 bg-white shadow-lg rounded-md p-10 border z-10"
                              >
                                <div className="grid grid-cols-8 gap-10 text-2xl">
                                  {[
                                    "😀",
                                    "😂",
                                    "😊",
                                    "😍",
                                    "🤔",
                                    "👍",
                                    "👎",
                                    "❤️",
                                    "🎉",
                                    "🔥",
                                    "💯",
                                    "🙏",
                                    "👏",
                                    "🤝",
                                    "💪",
                                    "⭐",
                                    "🌟",
                                    "💰",
                                    "📈",
                                    "📉",  
                                  ].map((emoji) => (
                                    <button
                                      key={emoji}
                                      className="hover:bg-gray-100 p-1 rounded"
                                      onClick={() => handleEmojiSelect(emoji)}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-black hover:bg-gray-800"
                              onClick={handlePostComment}
                              disabled={!comment.trim()}
                            >
                              Publier
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end mt-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="show-comments"
                            checked={showComments}
                            onCheckedChange={(checked) => setShowComments(!!checked)}
                          />
                          <label htmlFor="show-comments" className="text-sm cursor-pointer">
                            Afficher les commentaires
                          </label>
                        </div>
                      </div>
                    </div>

                    {showComments && contactDetails && (
                      <div className="space-y-6">
                        <ActivityEntry
                          user="Gabin Moundziegou"
                          action="a créé le contact."
                          timestamp="il y a environ 1 mois"
                        >
                          <ActivityItem contact={safeContact} />
                        </ActivityEntry>
                        {comments.map((comment) => (
                          <ActivityEntry
                            key={comment.id}
                            user={comment.user}
                            action="a commenté"
                            timestamp={`il y a ${formatTimeAgo(comment.timestamp)}`}
                          >
                            <div className="p-3 bg-gray-50 rounded-md">{comment.text}</div>
                          </ActivityEntry>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Contenu des autres onglets */}
                  <TabsContent value="devis" className="p-4">
                    <div className="text-center text-gray-500 py-8">Aucun devis pour l'instant</div>
                  </TabsContent>

                  <TabsContent value="facture" className="p-4">
                    <div className="text-center text-gray-500 py-8">Aucune facture pour l'instant</div>
                  </TabsContent>

                  <TabsContent value="notes" className="p-4">
                    <div className="text-center text-gray-500 py-8">Aucune note pour l'instant</div>
                  </TabsContent>

                  <TabsContent value="tasks" className="p-4">
                    <div className="text-center text-gray-500 py-8">Aucune tâche pour l'instant</div>
                  </TabsContent>

                  <TabsContent value="log" className="p-4">
                    <div className="text-center text-gray-500 py-8">Aucun log pour l'instant</div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {contactDetails && (
        <EditContactModal
          contact={safeContact}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveContact}
        />
      )}
    </div>
  )
}

// Composants auxiliaires
function PropertyItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-14">
      <div className="w-20 text-gray-500 flex items-center">
        <span className="mr-2 text-gray-400">{icon}</span>
        {label}
      </div>
      <div className="flex-1 truncate">{value || "-"}</div>
    </div>
  )
}

function ActivityEntry({
  user,
  action,
  timestamp,
  children,
}: {
  user: string
  action: string
  timestamp: string
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Avatar className="h-10 w-10 bg-gray-200 p-2 mr-2">
        {user
          .split(" ")
          .map((name) => name[0])
          .join("")}
      </Avatar>
      <div className="flex-1">
        <div className="text-sm mt-2">
          <span className="font-medium">{user}</span> {action}
        </div>
        <div className="mt-4">{children}</div>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          {timestamp}
        </div>
      </div>
    </div>
  )
}

function ActivityItem({ contact }: { contact: Contact }) {
  return (
    <Card className="rounded-lg border p-4 space-y-2">
      <div className="space-y-3">
        <FormField label="Nom">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.name || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Étiquettes">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input
            value={contact.tags.length ? contact.tags.join(",") : "-"}
            readOnly
            className="bg-white w-1/2 h-8"
            title={contact.tags.join(", ")}
          />
        </FormField>

        <FormField label="Email">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.email || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Image">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input
            value={contact.logo || "Pas d'image"}
            readOnly
            className="bg-white w-1/2 h-8"
            title={contact.logo || "Pas d'image"}
          />
        </FormField>

        <FormField label="Téléphone">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.phone || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Étape">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.stage || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Type">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.record || "-"} readOnly className="bg-white w-1/2 h-8" />
        </FormField>

        <FormField label="Adresse">
          <Input value="Vide" readOnly className="bg-white w-1/2 h-8" />
          <FormArrow />
          <Input value={contact.address || "-"} readOnly className="bg-white w-1/2 h-8" title={contact.address} />
        </FormField>
      </div>
    </Card>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-500 font-normal">{label}</label>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}

function FormArrow() {
  return <span className="text-gray-400 mx-1">→</span>
}