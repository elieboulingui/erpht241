"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Eye, File, FileText, FileIcon as FilePdf, FileImage, FileSpreadsheet, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Document = {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: {
    id: string
    name: string
    avatar?: string
  }
  contact: {
    id: string
    name: string
  }
}

export default function DocumentsTab() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Proposition commerciale - Solution Enterprise.pdf",
      type: "pdf",
      size: 2500000, // 2.5 MB
      uploadedAt: new Date(2025, 4, 5),
      uploadedBy: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "2",
      name: "Présentation produits premium 2025.pptx",
      type: "pptx",
      size: 4800000, // 4.8 MB
      uploadedAt: new Date(2025, 4, 6),
      uploadedBy: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "3",
      name: "Analyse besoins client - Projet expansion.xlsx",
      type: "xlsx",
      size: 1200000, // 1.2 MB
      uploadedAt: new Date(2025, 4, 7),
      uploadedBy: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact3",
        name: "Client 123",
      },
    },
    {
      id: "4",
      name: "Contrat signé - Partenariat stratégique.pdf",
      type: "pdf",
      size: 3200000, // 3.2 MB
      uploadedAt: new Date(2025, 4, 8),
      uploadedBy: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "5",
      name: "Étude comparative concurrence.docx",
      type: "docx",
      size: 1800000, // 1.8 MB
      uploadedAt: new Date(2025, 4, 10),
      uploadedBy: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "6",
      name: "Fiche technique produit v2.pdf",
      type: "pdf",
      size: 1500000, // 1.5 MB
      uploadedAt: new Date(2025, 4, 12),
      uploadedBy: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      contact: {
        id: "contact3",
        name: "Client 123",
      },
    },
  ])

  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [selectedContact, setSelectedContact] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  const contacts = [
    { id: "all", name: "Tous les contacts" },
    { id: "contact1", name: "Entreprise ABC" },
    { id: "contact2", name: "Société XYZ" },
    { id: "contact3", name: "Client 123" },
  ]

  const documentTypes = [
    { id: "all", name: "Tous les types" },
    { id: "pdf", name: "PDF" },
    { id: "docx", name: "Word" },
    { id: "xlsx", name: "Excel" },
    { id: "pptx", name: "PowerPoint" },
  ]

  const filteredDocuments = documents
    .filter((doc) => selectedContact === "all" || doc.contact.id === selectedContact)
    .filter((doc) => selectedType === "all" || doc.type.toLowerCase() === selectedType)

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FilePdf className="h-6 w-6 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="h-6 w-6 text-purple-500" />
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className="h-6 w-6 text-green-600" />
      case "docx":
      case "doc":
      case "txt":
        return <FileText className="h-6 w-6 text-blue-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents commerciaux</h3>
        <div className="flex items-center gap-2">
          <Select value={selectedContact} onValueChange={setSelectedContact}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun document</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {getFileIcon(doc.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        <div className="text-xs text-[#7f1d1c] font-medium mt-1">Contact: {doc.contact.name}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>{formatFileSize(doc.size)}</span>
                          <span className="mx-1">•</span>
                          <span>Importé le {format(doc.uploadedAt, "d MMM yyyy", { locale: fr })}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            setPreviewDocument(doc)
                            setIsPreviewOpen(true)
                          }}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Aperçu
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Télécharger
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={doc.uploadedBy.avatar || "/placeholder.svg"} alt={doc.uploadedBy.name} />
                        <AvatarFallback>{doc.uploadedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{doc.uploadedBy.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="sm:max-w-4xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {previewDocument && getFileIcon(previewDocument.type)}
              <span>{previewDocument?.name}</span>
            </SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <div className="border rounded-md p-8 min-h-[400px] flex items-center justify-center bg-gray-50">
              {previewDocument?.type.toLowerCase() === "jpg" ||
              previewDocument?.type.toLowerCase() === "jpeg" ||
              previewDocument?.type.toLowerCase() === "png" ? (
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt={previewDocument.name}
                  className="max-h-[400px] object-contain"
                />
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-4">{previewDocument && getFileIcon(previewDocument.type)}</div>
                  <p className="text-gray-500">Aperçu non disponible pour ce type de fichier</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger pour visualiser
                  </Button>
                </div>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Fermer
            </Button>
            <Button className="bg-[#7f1d1c] hover:bg-[#7f1d1c]/90 text-white">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
