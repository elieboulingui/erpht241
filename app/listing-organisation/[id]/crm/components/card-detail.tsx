"use client"

import { useState, useEffect } from "react"
import { X, Users, Tag, CheckSquare, Calendar, Paperclip, MapPin, ImageIcon, Copy, Archive, Share2, Plus, Info, Bold, Italic, List, Link, AlignLeft, HelpCircle, ChevronDown, AlignCenter, AlignRight, Save } from 'lucide-react'
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
  const [tags, setTags] = useState<Array<{ id: string; text: string; color: string }>>([])
  const [newTagText, setNewTagText] = useState("")
  const [price, setPrice] = useState(cardDetails?.card.amount?.toString() || "")
  const [selectedMembers, setSelectedMembers] = useState<Array<{ id: string; name: string }>>([])
  const [selectedContacts, setSelectedContacts] = useState<Array<{ id: string; name: string }>>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (cardDetails?.card.merchantId) {
      setSelectedMembers([{ id: cardDetails.card.contact?.name, name:cardDetails.card.contact?.name}])
    }
 
    if (cardDetails?.card.contact) {
      setSelectedContacts([{ 
        id: cardDetails.card.contact.id, 
        name: cardDetails.card.contact.name 
      }])
    }
  }, [cardDetails])

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

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!cardDetails?.list?.id) {
        console.error("ID de l'opportunité manquant")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const opportunityId = cardDetails.card.id
        console.log("Fetching opportunity with ID:", opportunityId)

        const result = await getOpportunitymemberById(opportunityId)
        if (result.data?.merchant) {
          setSelectedMembers([{ id: result.data.merchant.id, name: result.data.merchant.name }]);
        } else {
          setSelectedContacts([]);
        }
        
        if (result.error) {
          throw new Error(result.error)
        }

        console.log("Opportunity data:", result.data)
       
      } catch (err) {
        console.error("Error:", err)
        setError(err instanceof Error ? err.message : "Une erreur s'est produite")
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunity()
  }, [cardDetails?.list?.id])

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!cardDetails?.list?.id) {
        console.error("ID de l'opportunité manquant")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const opportunityId = cardDetails.card.id
        console.log("Fetching opportunity with ID:", opportunityId)

        const result = await getOpportunityById(opportunityId)
        if (result.data?.contact) {
          setSelectedContacts([{ id: result.data.contact.id, name: result.data.contact.name }]);
        } else {
          setSelectedContacts([]);
        }
        
        if (result.error) {
          throw new Error(result.error)
        }

        console.log("Opportunity data:", result.data)
       
      } catch (err) {
        console.error("Error:", err)
        setError(err instanceof Error ? err.message : "Une erreur s'est produite")
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunity()
  }, [cardDetails?.list?.id])

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

      setTags([
        ...tags,
        {
          id: Date.now().toString(),
          text: newTagText.trim(),
          color: randomColor,
        },
      ])

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
      toast.error("Le titre est obligatoire")
      return
    }

    if (!cardDetails?.card.id) {
      toast.error("ID de la carte manquant")
      return
    }

    setIsSaving(true)

    try {
      const dealData = {
        id: cardDetails.card.id,
        label: title,
        description: description,
        amount: price ? Number.parseFloat(price) : 0,
        merchantId: selectedMembers.length > 0 ? selectedMembers[0].id : null,
        contactId: selectedContacts.length > 0 ? selectedContacts[0].id : cardDetails.card.contact?.id || null,
      }

      const result = await updateDeal(dealData as any)

      if (result.success) {
        toast.success("La carte a été mise à jour avec succès")
        if (onSave) {
          onSave(result.success)
        }
        onClose()
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour")
        console.error("Erreur détaillée:", result.error)
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la carte:", error)
      toast.error("Une erreur s'est produite lors de la mise à jour")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] overflow-y-auto bg-gray-800 text-white w-[1000px] rounded-md">
        <div className="flex items-start justify-between p-4">
          <div className="flex items-start gap-3">
            <Input type="radio" className="h-4 w-4 text-gray-400 bg-black mt-2" />
            <div className="">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-1 pl-2 resize-none border-none bg-transparent text-xl font-medium text-white hover:bg-gray-700 focus:bg-gray-700"
              />
              <p className="text-sm text-gray-400">
                dans la liste <span className="rounded bg-gray-700 px-1 py-0.5 text-white">{list}</span>
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
              className="text-gray-400 hover:bg-red-700 hover:text-white"
              aria-label="Fermer"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="flex gap-6 p-4 pt-0">
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-gray-400">Notifications</span>
              </h3>
              <Button
                variant="ghost"
                className="flex w-1/5 items-center justify-start gap-2 text-gray-300 hover:bg-gray-700"
              >
                <Users size={16} className="text-gray-400" />
                <span>Suivre</span>
              </Button>

              {(selectedMembers.length > 0 || selectedContacts.length > 0) && (
                <div>
                  {selectedMembers.length > 0 && (
                    <div>
                      <h4 className="text-xs text-gray-400 mb-1">Membre assigné</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-1 bg-gray-700 rounded-full px-2 py-1 text-sm cursor-pointer hover:bg-gray-600"
                            onClick={() => setSelectedMembers([])}
                          >
                            <span>{member.name}</span>
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
                      <h4 className="text-xs text-gray-400 mt-2">Contact assigné</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex items-center gap-1 bg-gray-700 rounded-full px-2 py-1 text-sm cursor-pointer hover:bg-gray-600"
                            onClick={() => setSelectedContacts([])}
                          >
                            <span>{contact.name}</span>
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
            </div>

            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-gray-400">Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`inline-flex items-center rounded-full bg-${tag.color}-500/20 px-2.5 py-0.5 text-xs font-medium text-${tag.color}-400 cursor-pointer hover:bg-${tag.color}-500/30`}
                    onClick={() => {
                      setNewTagText(tag.text)
                      setTags(tags.filter((t) => t.id !== tag.id))
                    }}
                  >
                    {tag.text}
                    <button
                      className={`ml-1 text-${tag.color}-400 hover:text-${tag.color}-300`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setTags(tags.filter((t) => t.id !== tag.id))
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
                  className="ml-2 h-8 px-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={addTag}
                  disabled={!newTagText.trim()}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-gray-400">Prix</span>
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
                  className="ml-2 h-8 px-2 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Appliquer
                </Button>
              </div>
              <div
                id="price-display"
                className={`mt-2 text-sm font-medium text-green-400 ${!price ? "hidden" : ""} cursor-pointer hover:text-green-300`}
              >
                {price ? `${price} FCFA` : ""}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <span className="text-gray-400">Description</span>
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
                      className="text-gray-300 hover:bg-gray-700"
                      onClick={() => {
                        setDescription(tempDescription)
                        setIsEditingDescription(false)
                      }}
                    >
                      Annuler
                    </Button>
                    <div className="flex-1"></div>
                    <Button variant="ghost" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                      Aide de mise en forme
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setTempDescription(description)
                    setIsEditingDescription(true)
                  }}
                  className="w-full rounded-md bg-gray-700/50 p-3 text-left text-gray-400 hover:bg-gray-700 min-h-[40px] cursor-pointer"
                >
                  {description ? renderFormattedText(description) : "Ajouter une description plus détaillée..."}
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <span className="text-gray-400">Activité</span>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Afficher les détails
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-red-500">
                  <AvatarFallback className="text-xs">JN</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder="Écrivez un commentaire..."
                  className="resize-none rounded-md border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="mt-4 flex items-start gap-2">
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
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Tag size={16} className="mr-2" />
                Étiquettes
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <CheckSquare size={16} className="mr-2" />
                Checklist
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Calendar size={16} className="mr-2" />
                Dates
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Paperclip size={16} className="mr-2" />
                Pièce jointe
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <MapPin size={16} className="mr-2" />
                Emplacement
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <ImageIcon size={16} className="mr-2" />
                Image de couverture
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-400 text-[10px]">
                  <span>...</span>
                </div>
                Champs personnalisés
              </Button>
            </div>

            <h3 className="mb-2 mt-6 text-xs font-medium uppercase text-gray-400">Power-Ups</h3>
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
              <Plus size={16} className="mr-2" />
              Ajouter des Power
            </Button>

            <h3 className="mb-2 mt-6 text-xs font-medium uppercase text-gray-400">Automatisation</h3>
            <div className="flex items-center justify-between">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Plus size={16} className="mr-2" />
                Ajouter un bouton
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-700">
                <Info size={16} />
              </Button>
            </div>

            <h3 className="mb-2 mt-6 text-xs font-medium uppercase text-gray-400">Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Share2 size={16} className="mr-2" />
                Déplacer
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Copy size={16} className="mr-2" />
                Copier
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700">
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-400 text-[10px]">
                  <span>M</span>
                </div>
                Miroir
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-400 text-[10px]">
                  <span>T</span>
                </div>
                Créer un modèle
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Archive size={16} className="mr-2" />
                Archiver
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white">
                <Share2 size={16} className="mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}