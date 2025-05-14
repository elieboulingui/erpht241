"use client"

import { useState, useEffect } from "react"
import { X, Users, Tag, CheckSquare, Paperclip, MapPin, ImageIcon, Copy, Archive, Share2, Plus, Info, Bold, Italic, List, Link, AlignLeft, HelpCircle, ChevronDown, AlignCenter, AlignRight, Save, CalendarCheck, StickyNote, FileText, CreditCard, CalendarIcon, Pencil } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MembresDropdown } from "./membres-dropdown"
import { ContactsDropdown } from "./contacts-dropdown"
import { updateDeal } from "../action/updateDeal"
import { toast } from "sonner"
import { getOpportunityById } from "../action/opportunity-actions"
import { getOpportunitymemberById } from "../action/getOpportunitymemberById"
import { Calendar } from "@/components/ui/calendar"
import { format, setDate } from "date-fns"
import { getOpportunitytags } from "../action/getOpportunitytags"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DevisSheet } from "./sheets/devis-sheet"
import { RendezVousSheet } from "./sheets/rendez-vous-sheet"
import { PieceJointeSheet } from "./sheets/piece-jointe-sheet"
import { FacturesSheet } from "./sheets/factures-sheet"
import { NotesSheet } from "./sheets/notes-sheet"
import React from "react"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import TaskSheet from "./sheets/taches-sheet"

interface CardDetailProps {
  cardDetails: {
    list: { id: string; title: string }
    card: {
      id: string
      title: string
      description?: string
      amount?: number
      merchantId?: string | null
      contact?: { id: any; name: any } | null
      deadline?: string
    }
  } | null
  onClose: () => void
  onSave?: (cardData: any) => void
}

export function CardDetail({ cardDetails, onClose, onSave }: CardDetailProps) {
  const [title, setTitle] = useState(cardDetails?.card.title || "")
  const [list, setList] = useState(cardDetails?.list.title || "")
  const [loading, setLoading] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(
    cardDetails?.card.deadline ? new Date(cardDetails.card.deadline) : undefined
  );
  const [error, setError] = useState<string | null>(null)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [description, setDescription] = useState(cardDetails?.card.description || "")
  const [tempDescription, setTempDescription] = useState(cardDetails?.card.description || "")
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [textStyle, setTextStyle] = useState("normal")
  const [listType, setListType] = useState<"none" | "bullet" | "number">("none")
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")
  const [showTextStyleMenu, setShowTextStyleMenu] = useState(false)
  const [showListMenu, setShowListMenu] = useState(false)
  const [showImageMenu, setShowImageMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTagText, setNewTagText] = useState("")
  const [price, setPrice] = useState(cardDetails?.card.amount?.toString() || "")
  const [selectedMembers, setSelectedMembers] = useState<Array<{ id: string; name: string }>>([])
  const [selectedContacts, setSelectedContacts] = useState<Array<{ id: string; name: string }>>([])
  const [isSaving, setIsSaving] = useState(false)



  useEffect(() => {
    const fetchContact = async () => {
      if (!cardDetails?.card?.id) {
        console.error("ID de l'opportunité manquant")
        return
      }

      try {
        const opportunityId = cardDetails.card.id
        console.log("Fetching opportunity with ID:", opportunityId)

        const result = await getOpportunityById(opportunityId)

        if (result.error) {
          throw new Error(result.error)
        }

        const contact = result.data?.contact

        if (contact) {
          setSelectedContacts([{
            id: contact.id,
            name: contact.name
          }])
        } else {
          setSelectedContacts([])
        }

        console.log("Contact récupéré:", contact)

      } catch (err) {
        console.error("Erreur lors de la récupération du contact:", err)
      }
    }

    fetchContact()
  }, [cardDetails?.card?.id])


  const [opportunityId, setOpportunityId] = useState<string | undefined>(cardDetails?.card.id);

  useEffect(() => {
    const fetchOpportunityData = async () => {
      if (!opportunityId) {
        console.error("ID de l'opportunité manquant")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const memberResult = await getOpportunitymemberById(opportunityId)
        if (memberResult.data?.merchant) {
          setSelectedMembers([{ id: memberResult.data.merchant.id, name: memberResult.data.merchant.name }]);
        } else {
          setSelectedContacts([]);
        }

        if (memberResult.error) {
          throw new Error(memberResult.error)
        }

        const tagsResult = await getOpportunitytags(opportunityId)
        if (tagsResult.data?.tags && Array.isArray(tagsResult.data.tags)) {
          setTags(tagsResult.data.tags);
        } else {
          setTags([]);
        }

        if (tagsResult.error) {
          throw new Error(tagsResult.error)
        }

      } catch (err) {
        console.error("Error:", err)
        setError(err instanceof Error ? err.message : "Une erreur s'est produite")
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunityData()
  }, [opportunityId])

  if (!cardDetails) return null

  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end) {
        const selectedText = description.substring(start, end)
        const newText = description.substring(0, start) + prefix + selectedText + suffix + description.substring(end)
        setDescription(newText)

        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + prefix.length, end + prefix.length)
        }, 0)
        return true
      }
      return false
    }
    return false
  }

  const insertAtCursor = (textToInsert: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const newText = description.substring(0, start) + textToInsert + description.substring(start)
      setDescription(newText)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length)
      }, 0)
    }
  }

  const handleBoldClick = () => {
    const applied = applyFormatting("**", "**")
    if (!applied) {
      setIsBold(!isBold)
    }
  }

  const handleItalicClick = () => {
    const applied = applyFormatting("*", "*")
    if (!applied) {
      setIsItalic(!isItalic)
    }
  }

  const handleListClick = (type: "bullet" | "number") => {
    setListType(type)
    setShowListMenu(false)

    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const lineStart = description.lastIndexOf("\n", start - 1) + 1
      const prefix = type === "bullet" ? "- " : "1. "

      const newText = description.substring(0, lineStart) + prefix + description.substring(lineStart)
      setDescription(newText)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)
      }, 0)
    }
  }

  const handleLinkClick = () => {
    const linkText = applyFormatting("[", "](url)")
    if (!linkText) {
      insertAtCursor("[texte du lien](url)")
    }
  }

  const handleImageClick = () => {
    setShowImageMenu(!showImageMenu)
  }

  const insertImage = (type: "upload" | "url") => {
    setShowImageMenu(false)
    if (type === "upload") {
      alert("Fonctionnalité d'upload d'image à implémenter")
    } else {
      insertAtCursor("![description de l'image](url_de_l_image)")
    }
  }

  const handleAlignmentClick = () => {
    const newAlignment = alignment === "left" ? "center" : alignment === "center" ? "right" : "left"
    setAlignment(newAlignment)

    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end) {
        const selectedText = description.substring(start, end)
        const alignTag = `<div style="text-align:${newAlignment}">${selectedText}</div>`
        const newText = description.substring(0, start) + alignTag + description.substring(end)
        setDescription(newText)
      }
    }
  }

  const handleTextStyleClick = () => {
    setShowTextStyleMenu(!showTextStyleMenu)
  }

  const applyTextStyle = (style: string) => {
    setTextStyle(style)
    setShowTextStyleMenu(false)

    let prefix = ""
    let suffix = ""

    switch (style) {
      case "heading1":
        prefix = "# "
        break
      case "heading2":
        prefix = "## "
        break
      case "heading3":
        prefix = "### "
        break
      case "code":
        prefix = "`"
        suffix = "`"
        break
      case "quote":
        prefix = "> "
        break
    }

    if (prefix) {
      const textarea = document.querySelector("textarea") as HTMLTextAreaElement
      if (textarea) {
        const start = textarea.selectionStart
        const lineStart = description.lastIndexOf("\n", start - 1) + 1

        const newText =
          description.substring(0, lineStart) +
          prefix +
          description.substring(lineStart, start) +
          (suffix && start !== textarea.selectionEnd
            ? description.substring(start, textarea.selectionEnd) + suffix
            : "") +
          description.substring(Math.max(start, textarea.selectionEnd))
        setDescription(newText)
      }
    }
  }

  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu)
  }

  const handleHelpClick = () => {
    setShowHelpMenu(!showHelpMenu)
    alert(`Guide de formatage:
  **texte** ou Ctrl+B = Gras
  *texte* ou Ctrl+I = Italique
  # Texte = Titre principal
  ## Texte = Sous-titre
  - texte = Liste à puces
  1. texte = Liste numérotée
  [texte](url) = Lien
  ![alt](url) = Image
  > texte = Citation
  \`code\` = Code`)
  }

  const handleSaveDescription = () => {
    setIsEditingDescription(false)
  }

  const renderFormattedText = (text: string) => {
    if (!text) return null

    let formattedText = text
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.*?)$/gm, "<li>$2</li>")
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" style="max-width:100%;" />')
      .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br />")

    if (formattedText.includes("<li>")) {
      formattedText = formattedText.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>").replace(/<\/ul><ul>/g, "")
    }

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} className="prose prose-invert max-w-none" />
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault()
      handleBoldClick()
    }

    if (e.ctrlKey && e.key === "i") {
      e.preventDefault()
      handleItalicClick()
    }

    if (e.key === "/" && description === "") {
      e.preventDefault()
      handleHelpClick()
    }

    if (e.key === "Enter" && !e.shiftKey) {
      const textarea = e.currentTarget
      const cursorPos = textarea.selectionStart
      const currentLine = description.substring(0, cursorPos).split("\n").pop() || ""

      if (currentLine.match(/^- /)) {
        e.preventDefault()
        insertAtCursor("\n- ")
        return
      }

      const numberedListMatch = currentLine.match(/^(\d+)\. /)
      if (numberedListMatch) {
        e.preventDefault()
        const nextNumber = Number.parseInt(numberedListMatch[1]) + 1
        insertAtCursor(`\n${nextNumber}. `)
        return
      }
    }
  }

  const addTag = () => {
    if (newTagText.trim()) {
      const colors = ["blue", "green", "yellow", "red", "purple", "pink", "indigo"]
      const randomColor = colors[Math.floor(Math.random() * colors.length)]

      setTags([...tags, newTagText.trim()])

      setNewTagText("")
    }
  }

  const handleMemberSelect = (member: { id: string; name: string }) => {
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers([member])
    }
  }

  const handleContactSelect = (contact: { id: string; name: string }) => {
    if (!selectedContacts.some((c) => c.id === contact.id)) {
      setSelectedContacts([contact])
    }
  }

  const handleSaveCard = async () => {
    if (!title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (!cardDetails?.card.id) {
      toast.error("ID de la carte manquant");
      return;
    }

    setIsSaving(true);

    try {
      // Prepare the deal data
      const dealData = {
        id: cardDetails.card.id,
        label: title,
        description,
        amount: price ? parseFloat(price) : 0,
        merchantId: selectedMembers.length > 0 ? selectedMembers[0].id : null,
        contactId: selectedContacts.length > 0 ? selectedContacts[0].id : cardDetails.card.contact?.id || null,
        deadline: dueDate ? dueDate.toISOString() : null,
        tags, // Tags array passed directly
      };

      // Perform the update
      const result = await updateDeal(dealData);

      if (result.success) {
        toast.success("La carte a été mise à jour avec succès");
        onSave?.(result.success);
        onClose();
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
        console.error("Erreur détaillée:", result.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la carte:", error);
      toast.error("Une erreur s'est produite lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className=" bg-white text-black rounded-md">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <Input type="radio" className="h-4 w-4 text-black shadow-lg bg-white mt-2" />
          <div className="">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-1 pl-2 resize-none border-none bg-transparent text-xl font-medium text-black hover:bg-black hover:text-white"
            />
            <p className="text-sm text-black">
              dans la liste <span className="font-bold px-1 py-0.5 text-black">{list}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSaveCard}
            disabled={isSaving}
            className="flex items-center gap-1 bg-[#7f1d1c] hover:bg-[#7f1d1c]/80"
          >
            <Save size={16} />
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:bg-transparent hover:text-white"
            aria-label="Fermer"
          >
          </Button>
        </div>
      </div>

      <div className="flex gap-6 p-4 pt-0">
        <div className="flex-1">
          <div className="mb-6">


            {(selectedMembers.length > 0 || selectedContacts.length > 0) && (
              <div>
                {selectedMembers.length > 0 && (
                  <div>
                    <h4 className="text-xs text-black mb-1">Commercial assigné</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-1 bg-gray-700 rounded-full px-2 py-1 text-sm cursor-pointer hover:bg-gray-600"
                          onClick={() => setSelectedMembers([])}
                        >
                          <span className="text-white">{member.name}</span>
                          <button
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMembers([]);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContacts.length > 0 && (
                  <div>
                    <h4 className="text-xs text-black mt-2">Client assigné</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center gap-1 bg-gray-700 rounded-full px-2 py-1 text-sm cursor-pointer hover:bg-gray-600"
                          onClick={() => setSelectedContacts([])}
                        >
                          <span className="text-white">{contact.name}</span>
                          <button
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContacts([]);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-black">Description</span>
              </h3>

              {isEditingDescription ? (
                <div className="rounded-md border border-gray-600">
                  <div className="border-b border-gray-600 bg-gray-900 p-1">
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                          onClick={handleTextStyleClick}
                        >
                          <span className="flex items-center gap-1 text-xs font-bold">
                            Aa <ChevronDown size={12} />
                          </span>
                        </Button>
                        {showTextStyleMenu && (
                          <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-md border border-gray-600 bg-gray-800 shadow-lg">
                            <div className="p-1">
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => applyTextStyle("heading1")}
                              >
                                <span className="text-lg font-bold">Titre principal</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => applyTextStyle("heading2")}
                              >
                                <span className="text-base font-bold">Sous-titre</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => applyTextStyle("heading3")}
                              >
                                <span className="text-sm font-bold">Petit titre</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => applyTextStyle("normal")}
                              >
                                <span className="text-sm">Texte normal</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => applyTextStyle("code")}
                              >
                                <span className="font-mono text-sm">Code</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => applyTextStyle("quote")}
                              >
                                <span className="text-sm italic">Citation</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${isBold ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700"}`}
                        onClick={handleBoldClick}
                      >
                        <Bold size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${isItalic ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700"}`}
                        onClick={handleItalicClick}
                      >
                        <Italic size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                        onClick={handleMoreClick}
                      >
                        <span className="text-lg font-bold">...</span>
                      </Button>
                      {showMoreMenu && (
                        <div
                          className="absolute z-50 mt-1 w-48 rounded-md border border-gray-600 bg-gray-800 shadow-lg"
                          style={{ top: "120px", left: "100px" }}
                        >
                          <div className="p-1">
                            <button
                              className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                              onClick={() => applyFormatting("~~", "~~")}
                            >
                              <span className="line-through text-sm">Barré</span>
                            </button>
                            <button
                              className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                              onClick={() => applyFormatting("<u>", "</u>")}
                            >
                              <span className="underline text-sm">Souligné</span>
                            </button>
                            <button
                              className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                              onClick={() => insertAtCursor("---\n")}
                            >
                              <span className="text-sm">Séparateur</span>
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="h-6 border-l border-gray-600"></div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                          onClick={() => setShowListMenu(!showListMenu)}
                        >
                          <div className="flex items-center">
                            <List size={16} />
                            <ChevronDown size={12} />
                          </div>
                        </Button>
                        {showListMenu && (
                          <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-md border border-gray-600 bg-gray-800 shadow-lg">
                            <div className="p-1">
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => handleListClick("bullet")}
                              >
                                <span className="mr-2">•</span>
                                <span>Liste à puces</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => handleListClick("number")}
                              >
                                <span className="mr-2">1.</span>
                                <span>Liste numérotée</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                        onClick={handleLinkClick}
                      >
                        <Link size={16} />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                          onClick={handleImageClick}
                        >
                          <div className="flex items-center">
                            <ImageIcon size={16} />
                            <ChevronDown size={12} />
                          </div>
                        </Button>
                        {showImageMenu && (
                          <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-md border border-gray-600 bg-gray-800 shadow-lg">
                            <div className="p-1">
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => insertImage("upload")}
                              >
                                <span>Télécharger une image</span>
                              </button>
                              <button
                                className="flex w-full items-center px-2 py-1 text-left text-sm text-white hover:bg-gray-700"
                                onClick={() => insertImage("url")}
                              >
                                <span>Ajouter une image par URL</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="h-6 border-l border-gray-600"></div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${alignment !== "left" ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700"}`}
                        onClick={handleAlignmentClick}
                      >
                        {alignment === "left" && <AlignLeft size={16} />}
                        {alignment === "center" && <AlignCenter size={16} />}
                        {alignment === "right" && <AlignRight size={16} />}
                      </Button>
                      <div className="flex-1"></div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:bg-gray-700"
                        onClick={handleHelpClick}
                      >
                        <HelpCircle size={16} />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Vous avez besoin d'aide pour la mise en forme ? Tapez /help."
                    className="min-h-[120px] resize-none border-none bg-gray-900 p-3 text-white placeholder:text-gray-500"
                    style={{
                      fontWeight: isBold ? "bold" : "normal",
                      fontStyle: isItalic ? "italic" : "normal",
                    }}
                  />
                  <div className="flex items-center gap-2 bg-gray-900 p-2">
                    <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/80" onClick={handleSaveDescription}>
                      Sauvegarder
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={() => {
                        setDescription(tempDescription)
                        setIsEditingDescription(false)
                      }}
                    >
                      Annuler
                    </Button>
                    {/* <div className="flex-1"></div>
                    <Button variant="ghost" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                      Aide de mise en forme
                    </Button> */}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setTempDescription(description)
                    setIsEditingDescription(true)
                  }}
                  className="w-full rounded-md bg-gray-700/50 p-3 text-left text-white hover:bg-gray-700 min-h-[40px] cursor-pointer"
                >
                  {description ? renderFormattedText(description) : "Ajouter une description plus détaillée..."}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <span className="text-black">Prix</span>
            </h3>
            <div className="flex items-center">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-8 bg-gray-700 border-gray-600 text-sm text-white placeholder:text-gray-400"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">FCFA</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 h-8 px-2 bg-[#7f1d1c] hover:bg-[#7f1d1c]/80 text-white hover:text-white"
              >
                Appliquer
              </Button>
            </div>
            <div
              id="price-display"
              className={`mt-2 text-sm font-medium text-[#7f1d1c] ${!price ? "hidden" : ""} cursor-pointer hover:text-[#7f1d1c]`}
            >
              {price ? `${price} FCFA` : ""}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <span className="text-black">Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-400 cursor-pointer hover:bg-blue-500/30`}
                  onClick={() => {
                    setNewTagText(tag);
                    setTags(tags.filter((t) => t !== tag));
                  }}
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTags(tags.filter((t) => t !== tag));
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}

            </div>
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Ajouter un tag..."
                value={newTagText}
                onChange={(e) => setNewTagText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTagText.trim()) {
                    addTag()
                  }
                }}
                className="h-8 bg-gray-700 border-gray-600 text-sm text-white placeholder:text-gray-400"
              />
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 h-8 px-2 bg-[#7f1d1c] hover:bg-[#7f1d1c]/80 text-white hover:text-white"
                onClick={addTag}
                disabled={!newTagText.trim()}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <span className="text-black">Échéance</span>
              {dueDate && (
                <span className="text-black font-bold">{format(dueDate, "dd/MM/yyyy")}</span>
              )}
            </h3>

            <div>
              <Popover >
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[248px] justify-start text-left items-center mb-2 border-none bg-[#7f1d1c] hover:bg-[#7f1d1c]/80 text-white hover:text-white  font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="" align="start">
                  <Calendar className="bg-[#7f1d1c] text-white"
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mt-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-black">Activité</span>
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-black hover:bg-gray-700 hover:text-white"
              >
                Afficher les détails
              </Button>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <Avatar className="h-8 w-8 bg-red-500">
                <AvatarFallback className="text-xs">JN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">
                  <span className="font-medium">jo nath</span> a ajouté cette carte à {list}
                </p>
                <p className="text-xs text-gray-400">il y a 9 minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-60">
          <div className="space-y-2">
            <MembresDropdown onMemberSelect={handleMemberSelect} />
            <ContactsDropdown onContactSelect={handleContactSelect} />

            {/* Devis Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-700 hover:text-white">
                  <FileText size={16} className="mr-2" />
                  Devis
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <DevisSheet cardId={cardDetails.card.id} />
              </SheetContent>
            </Sheet>

            {/* Rendez-vous Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-700 hover:text-white">
                  <CalendarCheck size={16} className="mr-2" />
                  Rendez-vous
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <RendezVousSheet cardId={cardDetails.card.id} />
              </SheetContent>
            </Sheet>

            {/* Pièce jointe Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-700 hover:text-white">
                  <Paperclip size={16} className="mr-2" />
                  Pièce jointe
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <PieceJointeSheet cardId={cardDetails.card.id} />
              </SheetContent>
            </Sheet>

            {/* Factures Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-700 hover:text-white">
                  <CreditCard size={16} className="mr-2" />
                  Factures
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <FacturesSheet cardId={cardDetails.card.id} />
              </SheetContent>
            </Sheet>

            {/* Notes Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-700 hover:text-white">
                  <StickyNote size={16} className="mr-2" />
                  Notes
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <NotesSheet cardId={cardDetails.card.id} />
              </SheetContent>
            </Sheet>


            {/* Tâches Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-black hover:bg-gray-700 hover:text-white">
                  <Pencil size={16} className="mr-2" />
                  Tâches
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-800 text-white border-gray-700">
                <TaskSheet  />
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </div>
    </div>
  )
}
