"use client"

import type React from "react"

import { useState } from "react"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { File, FileText, FileImage, FileArchive, Download, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"

interface PieceJointeSheetProps {
  cardId: string
}

export function PieceJointeSheet({ cardId }: PieceJointeSheetProps) {
  const [files, setFiles] = useState<
    Array<{
      id: string
      name: string
      type: string
      size: string
      date: string
      url: string
    }>
  >([
    {
      id: "1",
      name: "Cahier des charges.pdf",
      type: "pdf",
      size: "2.4 MB",
      date: "10/05/2023",
      url: "#",
    },
    {
      id: "2",
      name: "Maquette.png",
      type: "image",
      size: "1.8 MB",
      date: "12/05/2023",
      url: "#",
    },
    {
      id: "3",
      name: "Documents.zip",
      type: "archive",
      size: "5.7 MB",
      date: "15/05/2023",
      url: "#",
    },
  ])

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
    toast.success("Fichier supprimé")
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      // Add files to the list
      const newFiles = Array.from(fileList).map((file) => {
        const fileType = file.type.split("/")[0]
        let type = "document"

        if (fileType === "image") type = "image"
        else if (file.name.endsWith(".pdf")) type = "pdf"
        else if (file.name.endsWith(".zip") || file.name.endsWith(".rar")) type = "archive"

        return {
          id: Date.now().toString() + file.name,
          name: file.name,
          type,
          size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
          date: new Date().toLocaleDateString("fr-FR"),
          url: "#",
        }
      })

      setFiles([...files, ...newFiles])
      setIsUploading(false)
      setUploadProgress(0)
      toast.success("Fichier(s) téléchargé(s) avec succès")
    }, 3000)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText size={20} className="text-red-400" />
      case "image":
        return <FileImage size={20} className="text-blue-400" />
      case "archive":
        return <FileArchive size={20} className="text-yellow-400" />
      default:
        return <File size={20} className="text-gray-400" />
    }
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-white">Pièces jointes</SheetTitle>
        <SheetDescription className="text-gray-400">Gérez les fichiers associés à cette opportunité</SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-4">
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            dragActive ? "border-[#7f1d1c] bg-[#7f1d1c]/10" : "border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
          <Label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <Upload size={24} className="mb-2 text-gray-400" />
            <p className="text-sm font-medium mb-1">Glissez-déposez des fichiers ou cliquez pour parcourir</p>
            <p className="text-xs text-gray-400">PNG, JPG, PDF, DOCX, XLSX, ZIP jusqu'à 10 MB</p>
          </Label>
        </div>

        {isUploading && (
          <div className="bg-gray-700 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Téléchargement en cours...</span>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div className="bg-[#7f1d1c] h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        )}

        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="bg-gray-700 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {file.size} • Ajouté le {file.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-400"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
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
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 hover:text-white">
            Fermer
          </Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
