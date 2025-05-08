"use client"

import { useState } from "react"
import {
  X,
  Users,
  Tag,
  CheckSquare,
  Calendar,
  Paperclip,
  MapPin,
  ImageIcon,
  Copy,
  Archive,
  Share2,
  Plus,
  Info,
  Bold,
  Italic,
  List,
  Link,
  AlignLeft,
  HelpCircle,
  ChevronDown,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MembresDropdown } from "./membres-dropdown"
import { ContactsDropdown } from "./contacts-dropdown"
import type React from "react"

interface CardDetailProps {
  cardDetails: {
    list: { id: string; title: string }
    card: { id: string; title: string }
  } | null
  onClose: () => void
}

export function CardDetail({ cardDetails, onClose }: CardDetailProps) {
  const [title, setTitle] = useState(cardDetails?.card.title || "")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [description, setDescription] = useState("")
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

  if (!cardDetails) return null

  // Fonction générique pour appliquer un formatage au texte sélectionné
  const applyFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (start !== end) {
        // Si du texte est sélectionné, on l'entoure des marqueurs appropriés
        const selectedText = description.substring(start, end)
        const newText = description.substring(0, start) + prefix + selectedText + suffix + description.substring(end)
        setDescription(newText)

        // Repositionner le curseur après la sélection
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

  // Fonction pour insérer du texte à la position du curseur
  const insertAtCursor = (textToInsert: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const newText = description.substring(0, start) + textToInsert + description.substring(start)
      setDescription(newText)

      // Repositionner le curseur après le texte inséré
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length)
      }, 0)
    }
  }

  // Gestion du gras
  const handleBoldClick = () => {
    const applied = applyFormatting("**", "**")
    if (!applied) {
      setIsBold(!isBold)
    }
  }

  // Gestion de l'italique
  const handleItalicClick = () => {
    const applied = applyFormatting("*", "*")
    if (!applied) {
      setIsItalic(!isItalic)
    }
  }

  // Gestion des listes
  const handleListClick = (type: "bullet" | "number") => {
    setListType(type)
    setShowListMenu(false)

    const textarea = document.querySelector("textarea") as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const lineStart = description.lastIndexOf("\n", start - 1) + 1
      const prefix = type === "bullet" ? "- " : "1. "

      // Insérer le préfixe de liste au début de la ligne
      const newText = description.substring(0, lineStart) + prefix + description.substring(lineStart)
      setDescription(newText)

      // Repositionner le curseur après le préfixe
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)
      }, 0)
    }
  }

  // Gestion des liens
  const handleLinkClick = () => {
    const linkText = applyFormatting("[", "](url)")
    if (!linkText) {
      insertAtCursor("[texte du lien](url)")
    }
  }

  // Gestion des images
  const handleImageClick = () => {
    setShowImageMenu(!showImageMenu)
  }

  const insertImage = (type: "upload" | "url") => {
    setShowImageMenu(false)
    if (type === "upload") {
      // Simuler un clic sur un input file caché
      alert("Fonctionnalité d'upload d'image à implémenter")
    } else {
      insertAtCursor("![description de l'image](url_de_l_image)")
    }
  }

  // Gestion de l'alignement
  const handleAlignmentClick = () => {
    const newAlignment = alignment === "left" ? "center" : alignment === "center" ? "right" : "left"
    setAlignment(newAlignment)

    // Appliquer l'alignement au texte sélectionné
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

  // Gestion des styles de texte
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

        // Appliquer le style au début de la ligne
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

  // Gestion du bouton "Plus d'options"
  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu)
  }

  // Gestion du bouton d'aide
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
    // Ici, vous pourriez enregistrer la description dans votre état global
    setIsEditingDescription(false)
  }

  const renderFormattedText = (text: string) => {
    if (!text) return null

    // Remplacer les marqueurs de formatage par des balises HTML
    let formattedText = text
      // Titres
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
      // Gras et italique
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Listes
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.*?)$/gm, "<li>$2</li>")
      // Liens et images
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" style="max-width:100%;" />')
      // Citations
      .replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>")
      // Code
      .replace(/`(.*?)`/g, "<code>$1</code>")
      // Sauts de ligne
      .replace(/\n/g, "<br />")

    // Envelopper les listes dans des balises ul/ol
    if (formattedText.includes("<li>")) {
      formattedText = formattedText.replace(/(<li>.*?<\/li>)/g, "<ul>$1</ul>").replace(/<\/ul><ul>/g, "")
    }

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} className="prose prose-invert max-w-none" />
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+B pour le gras
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault()
      handleBoldClick()
    }

    // Ctrl+I pour l'italique
    if (e.ctrlKey && e.key === "i") {
      e.preventDefault()
      handleItalicClick()
    }

    // Gérer /help
    if (e.key === "/" && description === "") {
      e.preventDefault()
      handleHelpClick()
    }

    // Gérer la touche Entrée dans les listes
    if (e.key === "Enter" && !e.shiftKey) {
      const textarea = e.currentTarget
      const cursorPos = textarea.selectionStart
      const currentLine = description.substring(0, cursorPos).split("\n").pop() || ""

      // Vérifier si la ligne actuelle est une liste à puces
      if (currentLine.match(/^- /)) {
        e.preventDefault()
        insertAtCursor("\n- ")
        return
      }

      // Vérifier si la ligne actuelle est une liste numérotée
      const numberedListMatch = currentLine.match(/^(\d+)\. /)
      if (numberedListMatch) {
        e.preventDefault()
        const nextNumber = Number.parseInt(numberedListMatch[1]) + 1
        insertAtCursor(`\n${nextNumber}. `)
        return
      }
    }
  }

  return (
    <div className="max-h-[90vh] overflow-y-auto bg-gray-800 text-white w-[1000px]">
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
              dans la liste <span className="rounded bg-gray-700 px-1 py-0.5 text-white">TEXT 01</span>
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:bg-red-700 hover:text-white"
        >
          <X size={20} />
        </Button>
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
          </div>

          <div className="mb-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <span className="text-gray-400">Description</span>
            </h3>

            {isEditingDescription ? (
              <div className="rounded-md border border-gray-600">
                {/* Le reste du code de l'éditeur reste inchangé */}
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
                    onClick={() => setIsEditingDescription(false)}
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
                onClick={() => setIsEditingDescription(true)}
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
                <span className="text-xs">JN</span>
              </Avatar>
              <Textarea
                placeholder="Écrivez un commentaire..."
                className="resize-none rounded-md border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="mt-4 flex items-start gap-2">
              <Avatar className="h-8 w-8 bg-red-500">
                <span className="text-xs">JN</span>
              </Avatar>
              <div>
                <p className="text-sm">
                  <span className="font-medium">jo nath</span> a ajouté cette carte à text 01
                </p>
                <p className="text-xs text-gray-400">il y a 9 minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-60">
          <div className="space-y-2">
            <MembresDropdown />
            <ContactsDropdown />
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
            Ajouter des Po-wer-ups
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
  )
}
