"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Check, Search, Download, ExternalLink, Facebook, Instagram, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContactData, ExistingContact, Niveau } from "./types"
import { isDuplicateContact } from "./utils"

interface SocialMedia {
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
}

interface Business {
  name: string
  service: string
  phone: string
  phoneNumbers?: string
  address: string
  email: string
  website?: string
  socialMedia?: SocialMedia
}

interface AIContactGeneratorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  organisationId: string | null
  saveContactToDatabase: (contactData: any) => Promise<any>
  onManualFallback: () => void
}

export default function AIContactGenerator({
  isOpen,
  onOpenChange,
  organisationId,
  saveContactToDatabase,
  onManualFallback,
}: AIContactGeneratorProps) {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set())

  const scrapeData = async () => {
    if (!searchQuery.trim()) {
      setError("Veuillez entrer un terme de recherche")
      return
    }

    setSearchLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/scrape?query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`)
      }

      const data = await response.json()
      setBusinesses(data)
      setSearchPerformed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite")
    } finally {
      setSearchLoading(false)
    }
  }

  const exportToCSV = () => {
    if (businesses.length === 0) return

    const headers = ["Nom", "Service", "Téléphone", "Adresse", "Email", "Site Web", "Facebook", "Instagram"]
    const csvContent = [
      headers.join(","),
      ...businesses.map((business) =>
        [
          `"${(business.name || "").replace(/"/g, '""')}"`,
          `"${(business.service || "").replace(/"/g, '""')}"`,
          `"${(business.phone || "").replace(/"/g, '""')}"`,
          `"${(business.address || "").replace(/"/g, '""')}"`,
          `"${(business.email || "").replace(/"/g, '""')}"`,
          `"${(business.website || "").replace(/"/g, '""')}"`,
          `"${(business.socialMedia?.facebook || "").replace(/"/g, '""')}"`,
          `"${(business.socialMedia?.instagram || "").replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `resultats-recherche-${searchQuery}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleContactSelection = async () => {
    if (selectedContactIds.size === 0) {
      toast.error("Veuillez sélectionner au moins un contact")
      return
    }

    setSaveLoading(true)

    try {
      const selectedContacts = Array.from(selectedContactIds).map((index) => {
        const business = businesses[index]
        return {
          name: business.name,
          email: business.email,
          phone: business.phone,
          adresse: business.address,
          description: business.service,
        }
      })

      const existingContacts: ExistingContact[] = []
      const duplicates = selectedContacts.filter((contact) => isDuplicateContact(contact, existingContacts))

      if (duplicates.length > 0) {
        toast.error(`${duplicates.length} contact(s) existe(nt) déjà et ne sera(ont) pas ajouté(s)`)
        const validContacts = selectedContacts.filter((contact) => !isDuplicateContact(contact, existingContacts))

        if (validContacts.length > 0) {
          await saveSelectedContacts(validContacts)
          resetDialog(true) // Fermer le dialog après sauvegarde
        }
      } else {
        await saveSelectedContacts(selectedContacts)
        resetDialog(true) // Fermer le dialog après sauvegarde
      }
    } catch (error) {
      console.error("Erreur lors de la sélection des contacts:", error)
      toast.error("Une erreur est survenue lors de la sauvegarde")
    } finally {
      setSaveLoading(false)
    }
  }

  const saveSelectedContacts = async (contacts: ContactData[]) => {
    try {
      const savedContacts = []

      for (const contact of contacts) {
        const contactToSave = {
          name: contact.name || "",
          email: contact.email || "",
          phone: contact.phone || "",
          niveau: "CLIENT" as Niveau,
          tags: "",
          organisationIds: [organisationId!],
          logo: null,
          adresse: contact.adresse || "",
          status_contact: "COMPAGNIE",
          sector: contact.description || "",
        }

        const savedContact = await saveContactToDatabase(contactToSave)
        savedContacts.push(savedContact)
      }

      toast.success(`${contacts.length} contact(s) ajouté(s) avec succès !`)
      return savedContacts
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde des contacts:", error)
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`)
      throw error
    }
  }

  const resetDialog = (shouldClose = false) => {
    setSearchQuery("")
    setBusinesses([])
    setSelectedContactIds(new Set())
    setSearchPerformed(false)
    setError(null)
    if (shouldClose) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetDialog()
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between ">

          <div>
            <DialogTitle className="text-xl font-semibold">Générateur de contact</DialogTitle>
            <DialogDescription className="text-sm text-black">Recherchez et générez des contacts</DialogDescription>
          </div>
          <div>

            {businesses.length > 0 && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusinesses([])
                    setSelectedContactIds(new Set())
                  }}
                  disabled={searchLoading || saveLoading}
                >
                  Nouvelle recherche
                </Button>
                <Button
                  onClick={handleContactSelection}
                  disabled={selectedContactIds.size === 0 || searchLoading || saveLoading}
                  className="gap-2 bg-[#7f1d1c] text-white hover:bg-[#7f1d1c]"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sauvegarde en cours...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Sélectionner {selectedContactIds.size} contact
                      {selectedContactIds.size > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Entrez votre terme de recherche..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !searchLoading && !saveLoading && scrapeData()}
              />
            </div>
            <Button
              onClick={scrapeData}
              disabled={searchLoading || saveLoading || searchQuery.trim().length === 0}
              className="w-full sm:w-auto bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white font-bold px-4 py-2 rounded-lg"
            >
              {searchLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recherche en cours...
                </>
              ) : (
                "Recherche"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {searchPerformed && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold">Résultats ({businesses.length})</h3>
                <p className="text-sm text-gray-600">Résultats pour: "{searchQuery}"</p>
              </div>

              <Tabs defaultValue="cards">
                <TabsList>
                  <TabsTrigger value="cards">Cartes</TabsTrigger>
                  <TabsTrigger value="table">Tableau</TabsTrigger>
                </TabsList>

                {businesses.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mt-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContactIds(new Set())}
                        disabled={selectedContactIds.size === 0 || searchLoading || saveLoading}
                      >
                        Tout désélectionner
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContactIds(new Set(businesses.map((_, i) => i)))}
                          disabled={selectedContactIds.size === businesses.length || searchLoading || saveLoading}
                        >
                          Tout sélectionner
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={exportToCSV}
                          disabled={searchLoading || saveLoading}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Exporter CSV
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="cards">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {businesses.map((business, index) => (
                          <Card
                            key={index}
                            className={`border h-full cursor-pointer ${selectedContactIds.has(index) ? "border-black" : "border-gray-200"} hover:border-gray-400 transition-colors`}
                            onClick={() => {
                              if (searchLoading || saveLoading) return
                              const newSelected = new Set(selectedContactIds)
                              if (newSelected.has(index)) {
                                newSelected.delete(index)
                              } else {
                                newSelected.add(index)
                              }
                              setSelectedContactIds(newSelected)
                            }}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{business.name}</CardTitle>
                                <div
                                  className={`w-5 h-5 rounded-full border ${selectedContactIds.has(index)
                                    ? "bg-black text-white flex items-center justify-center"
                                    : "border-gray-300"
                                    }`}
                                >
                                  {selectedContactIds.has(index) && <Check className="h-3 w-3" />}
                                </div>
                              </div>
                              {business.service && (
                                <CardDescription className="line-clamp-2">{business.service}</CardDescription>
                              )}
                            </CardHeader>
                            <CardContent className="pb-2 pt-0">
                              <div className="grid gap-1 text-sm">
                                {business.email && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Email:</span>{" "}
                                    <span className="truncate">{business.email}</span>
                                  </div>
                                )}
                                {business.phone && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Téléphone:</span> {business.phone}
                                  </div>
                                )}
                                {business.address && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Adresse:</span>{" "}
                                    <span className="truncate">{business.address}</span>
                                  </div>
                                )}
                                {business.website && business.website !== "Non disponible" && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Site Web:</span>
                                    <a
                                      href={business.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {business.website?.replace(/^https?:\/\//, "").split("/")[0]}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </div>
                                )}
                                {business.socialMedia && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-medium">Réseaux:</span>
                                    <div className="flex space-x-2">
                                      {business.socialMedia?.facebook && (
                                        <a
                                          href={business.socialMedia.facebook}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Facebook className="h-4 w-4" />
                                        </a>
                                      )}
                                      {business.socialMedia?.instagram && (
                                        <a
                                          href={business.socialMedia.instagram}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <Instagram className="h-4 w-4" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="table">
                      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30px]"></TableHead>
                              <TableHead>Nom</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Téléphone</TableHead>
                              <TableHead>Adresse</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Liens</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {businesses.map((business, index) => (
                              <TableRow
                                key={index}
                                className={`cursor-pointer ${selectedContactIds.has(index) ? "bg-muted/50" : ""}`}
                                onClick={() => {
                                  if (searchLoading || saveLoading) return
                                  const newSelected = new Set(selectedContactIds)
                                  if (newSelected.has(index)) {
                                    newSelected.delete(index)
                                  } else {
                                    newSelected.add(index)
                                  }
                                  setSelectedContactIds(newSelected)
                                }}
                              >
                                <TableCell>
                                  <div
                                    className={`w-5 h-5 rounded-full border ${selectedContactIds.has(index)
                                      ? "bg-black text-white flex items-center justify-center"
                                      : "border-gray-300"
                                      }`}
                                  >
                                    {selectedContactIds.has(index) && <Check className="h-3 w-3" />}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{business.name}</TableCell>
                                <TableCell>{business.service}</TableCell>
                                <TableCell className="whitespace-pre-wrap">{business.phone}</TableCell>
                                <TableCell>{business.address}</TableCell>
                                <TableCell>
                                  {business.email && business.email !== "Non disponible" ? (
                                    <a
                                      href={`mailto:${business.email}`}
                                      className="text-blue-600 hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {business.email}
                                    </a>
                                  ) : (
                                    "Non disponible"
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    {business.website && business.website !== "Non disponible" && (
                                      <a
                                        href={business.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Globe className="h-4 w-4" />
                                      </a>
                                    )}
                                    {business.socialMedia?.facebook && (
                                      <a
                                        href={business.socialMedia.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Facebook className="h-4 w-4" />
                                      </a>
                                    )}
                                    {business.socialMedia?.instagram && (
                                      <a
                                        href={business.socialMedia.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Instagram className="h-4 w-4" />
                                      </a>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  </>
                ) : (
                  <div className="flex items-center justify-center py-8 text-gray-500">Aucun résultat trouvé</div>
                )}
              </Tabs>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}