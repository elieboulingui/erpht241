"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, FileIcon as FilePdf, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Quote = {
  id: string
  reference: string
  title: string
  description?: string
  amount: number
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  createdAt: Date
  validUntil: Date
  createdBy: {
    id: string
    name: string
    avatar?: string
  }
  items: {
    id: string
    name: string
    description?: string
    quantity: number
    unitPrice: number
  }[]
  contact: {
    id: string
    name: string
  }
}

export default function QuotesTab() {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: "1",
      reference: "DEV-2025-001",
      title: "Solution complète de gestion commerciale",
      description: "Déploiement d'une solution intégrée avec modules CRM, facturation et analyse des ventes",
      amount: 15000000,
      status: "sent",
      createdAt: new Date(2025, 4, 1),
      validUntil: new Date(2025, 5, 1),
      createdBy: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      items: [
        {
          id: "item1",
          name: "Licence CRM Enterprise",
          description: "Licence annuelle pour 25 utilisateurs",
          quantity: 1,
          unitPrice: 8000000,
        },
        {
          id: "item2",
          name: "Module facturation avancée",
          description: "Avec intégration comptable et suivi des paiements",
          quantity: 1,
          unitPrice: 4000000,
        },
        {
          id: "item3",
          name: "Formation utilisateurs",
          description: "5 jours de formation sur site",
          quantity: 1,
          unitPrice: 3000000,
        },
      ],
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "2",
      reference: "MAINT-2025-002",
      title: "Contrat de maintenance premium",
      description: "Support technique prioritaire et mises à jour incluses",
      amount: 6000000,
      status: "accepted",
      createdAt: new Date(2025, 4, 5),
      validUntil: new Date(2025, 5, 5),
      createdBy: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      items: [
        {
          id: "item1",
          name: "Maintenance technique",
          description: "Support 24/7 et résolution prioritaire des incidents",
          quantity: 12,
          unitPrice: 400000,
        },
        {
          id: "item2",
          name: "Mises à jour logicielles",
          description: "Accès à toutes les nouvelles versions et fonctionnalités",
          quantity: 1,
          unitPrice: 1200000,
        },
      ],
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
    {
      id: "3",
      reference: "CONS-2025-003",
      title: "Audit et optimisation des processus commerciaux",
      description: "Analyse complète et recommandations pour améliorer l'efficacité commerciale",
      amount: 3500000,
      status: "draft",
      createdAt: new Date(2025, 4, 8),
      validUntil: new Date(2025, 5, 8),
      createdBy: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      items: [
        {
          id: "item1",
          name: "Audit des processus existants",
          description: "Analyse détaillée et identification des points d'amélioration",
          quantity: 1,
          unitPrice: 1500000,
        },
        {
          id: "item2",
          name: "Recommandations stratégiques",
          description: "Rapport détaillé et plan d'action",
          quantity: 1,
          unitPrice: 1200000,
        },
        {
          id: "item3",
          name: "Accompagnement à la mise en œuvre",
          description: "5 jours de conseil sur site",
          quantity: 1,
          unitPrice: 800000,
        },
      ],
      contact: {
        id: "contact3",
        name: "Client 123",
      },
    },
    {
      id: "4",
      reference: "FORM-2025-004",
      title: "Programme de formation commerciale avancée",
      description: "Formation complète pour l'équipe commerciale sur les techniques de vente consultative",
      amount: 4200000,
      status: "rejected",
      createdAt: new Date(2025, 4, 10),
      validUntil: new Date(2025, 5, 10),
      createdBy: {
        id: "user2",
        name: "Thomas Dubois",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      items: [
        {
          id: "item1",
          name: "Formation vente consultative",
          description: "3 jours pour 10 commerciaux",
          quantity: 1,
          unitPrice: 2500000,
        },
        {
          id: "item2",
          name: "Ateliers pratiques",
          description: "Mise en situation et coaching personnalisé",
          quantity: 1,
          unitPrice: 1200000,
        },
        {
          id: "item3",
          name: "Suivi post-formation",
          description: "Sessions de coaching individuel",
          quantity: 5,
          unitPrice: 100000,
        },
      ],
      contact: {
        id: "contact1",
        name: "Entreprise ABC",
      },
    },
    {
      id: "5",
      reference: "INTG-2025-005",
      title: "Intégration CRM avec ERP existant",
      description: "Développement d'une interface sur mesure entre les systèmes",
      amount: 7800000,
      status: "expired",
      createdAt: new Date(2025, 3, 15),
      validUntil: new Date(2025, 4, 15),
      createdBy: {
        id: "user1",
        name: "Sophie Martin",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      items: [
        {
          id: "item1",
          name: "Analyse technique préalable",
          description: "Étude de faisabilité et spécifications",
          quantity: 1,
          unitPrice: 1800000,
        },
        {
          id: "item2",
          name: "Développement de l'interface",
          description: "Programmation et tests",
          quantity: 1,
          unitPrice: 4500000,
        },
        {
          id: "item3",
          name: "Migration des données",
          description: "Transfert et validation des données existantes",
          quantity: 1,
          unitPrice: 1500000,
        },
      ],
      contact: {
        id: "contact2",
        name: "Société XYZ",
      },
    },
  ])

  const [isViewQuoteOpen, setIsViewQuoteOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const [selectedContact, setSelectedContact] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const contacts = [
    { id: "all", name: "Tous les contacts" },
    { id: "contact1", name: "Entreprise ABC" },
    { id: "contact2", name: "Société XYZ" },
    { id: "contact3", name: "Client 123" },
  ]

  const statuses = [
    { id: "all", name: "Tous les statuts" },
    { id: "draft", name: "Brouillon" },
    { id: "sent", name: "Envoyé" },
    { id: "accepted", name: "Accepté" },
    { id: "rejected", name: "Refusé" },
    { id: "expired", name: "Expiré" },
  ]

  const filteredQuotes = quotes
    .filter((quote) => selectedContact === "all" || quote.contact.id === selectedContact)
    .filter((quote) => selectedStatus === "all" || quote.status === selectedStatus)

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter((quote) => quote.id !== id))
  }

  const getStatusBadge = (status: Quote["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            Brouillon
          </Badge>
        )
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Envoyé</Badge>
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepté</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refusé</Badge>
      case "expired":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Expiré</Badge>
    }
  }

  const calculateTotal = (items: Quote["items"]) => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Devis commerciaux</h3>
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

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun devis pour le moment</p>
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <FilePdf className="h-6 w-6 text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{quote.title}</h4>
                        {getStatusBadge(quote.status)}
                      </div>
                      <div className="text-xs text-[#7f1d1c] font-medium mt-1">Contact: {quote.contact.name}</div>

                      <div className="text-sm text-gray-600 mt-1">
                        <div>Réf: {quote.reference}</div>
                        {quote.description && <div className="mt-1">{quote.description}</div>}
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <div className="font-medium">{quote.amount.toLocaleString()} FCFA</div>
                        <div className="text-gray-500">
                          Valide jusqu'au {format(quote.validUntil, "d MMM yyyy", { locale: fr })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={quote.createdBy.avatar || "/placeholder.svg"} alt={quote.createdBy.name} />
                          <AvatarFallback>{quote.createdBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">
                          Créé par {quote.createdBy.name} le {format(quote.createdAt, "d MMM yyyy", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setSelectedQuote(quote)
                        setIsViewQuoteOpen(true)
                      }}
                    >
                      Voir
                    </Button>

                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      PDF
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => deleteQuote(quote.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Sheet open={isViewQuoteOpen} onOpenChange={setIsViewQuoteOpen}>
        <SheetContent className="sm:max-w-4xl">
          {selectedQuote && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl">{selectedQuote.title}</SheetTitle>
                  {getStatusBadge(selectedQuote.status)}
                </div>
                <SheetDescription>Référence: {selectedQuote.reference}</SheetDescription>
              </SheetHeader>

              <div className="py-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Détails du devis</h4>
                    <p className="mt-1">Créé le {format(selectedQuote.createdAt, "d MMMM yyyy", { locale: fr })}</p>
                    <p>Valide jusqu'au {format(selectedQuote.validUntil, "d MMMM yyyy", { locale: fr })}</p>
                    {selectedQuote.description && <p className="mt-2">{selectedQuote.description}</p>}
                  </div>

                  <div className="text-right">
                    <h4 className="font-medium text-sm text-gray-500">Client</h4>
                    <p className="mt-1">{selectedQuote.contact.name}</p>
                    <p>Adresse du client</p>
                    <p>Email / Téléphone</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Article</TableHead>
                      <TableHead className="text-right">Qté</TableHead>
                      <TableHead className="text-right">Prix unitaire</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuote.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.unitPrice.toLocaleString()} FCFA</TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.quantity * item.unitPrice).toLocaleString()} FCFA
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{selectedQuote.amount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (0%):</span>
                      <span>0 FCFA</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total:</span>
                      <span>{selectedQuote.amount.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-4 text-sm text-gray-600">
                  <h4 className="font-medium mb-2">Conditions</h4>
                  <p>
                    Ce devis est valable jusqu'au {format(selectedQuote.validUntil, "d MMMM yyyy", { locale: fr })}.
                  </p>
                  <p>Modalités de paiement : 50% à la commande, 50% à la livraison.</p>
                </div>
              </div>

              <SheetFooter>
                <div className="flex justify-between w-full">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsViewQuoteOpen(false)}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
