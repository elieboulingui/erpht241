"use client"

import { JSX, useEffect, useState } from "react"
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  File,
  FileText,
  FileImage,
  FileArchive,
  Download,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import Chargement from "@/components/Chargement"
import { Loader } from "@/components/ChargementCart"

interface PieceJointeSheetProps {
  cardId: string
}

interface DocumentFile {
  id: string
  name: string
  type: string
  size: string
  date: string
  url: string
}

const fileIcons: { [key: string]: JSX.Element } = {
  pdf: <FileText size={20} className="text-red-400" />,
  image: <FileImage size={20} className="text-blue-400" />,
  archive: <FileArchive size={20} className="text-yellow-400" />,
  default: <File size={20} className="text-gray-400" />,
}

const FileItem = ({
  file,
  onDelete,
}: {
  file: DocumentFile
  onDelete: (id: string) => void
}) => (
  <div key={file.id} className="bg-gray-700 p-3 rounded-md">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        {fileIcons[file.type] || fileIcons.default}
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-xs text-gray-400">
            {file.size} • Ajouté le {file.date}
          </p>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={() => window.open(file.url, "_blank")}
        >
          <Download size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-red-400"
          onClick={() => onDelete(file.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  </div>
)

export function PieceJointeSheet({ cardId }: PieceJointeSheetProps) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/documentcontact?id=${cardId}`)
        if (!res.ok) throw new Error("Erreur lors du chargement des documents")
        const data = await res.json()

        const formattedDocs: DocumentFile[] = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          type: getFileType(doc.type),
          size: doc.size,
          date: new Date(doc.date).toLocaleDateString("fr-FR"),
          url: doc.url,
        }))

        setFiles(formattedDocs)
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors du chargement des fichiers")
      } finally {
        setIsLoading(false)
      }
    }

    if (cardId) {
      fetchDocuments()
    }
  }, [cardId])

  const getFileType = (mime: string) => {
    if (mime.toLowerCase().includes("pdf")) return "pdf"
    if (mime.toLowerCase().includes("image")) return "image"
    if (mime.toLowerCase().includes("zip") || mime.toLowerCase().includes("rar")) return "archive"
    return "default"
  }

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    toast.success("Fichier supprimé (localement)")
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Pièces jointes</SheetTitle>
        <SheetDescription className="text-gray-400">
          Gérez les fichiers associés à cette opportunité
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        {isLoading ? (
         <Loader/>
        ) : files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <FileItem key={file.id} file={file} onDelete={handleDeleteFile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Aucune pièce jointe</p>
          </div>
        )}
      </div>

      <SheetFooter className="mt-4">
        <SheetClose asChild>
          <Button
            variant="ghost"
            className="border-gray-600 text-white hover:bg-gray-700 hover:text-white"
          >
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
