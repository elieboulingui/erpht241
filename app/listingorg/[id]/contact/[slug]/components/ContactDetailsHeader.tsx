"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ChevronRight, Ellipsis, Star } from "lucide-react"
import { GetcontactDetails } from "../actions/GetcontactDetails"
import { useSidebar } from "@/components/ui/sidebar"

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
}

export default function ContactDetailsHeader() {
  const [contactId, setContactId] = useState<string | null>(null)
  const [contactDetails, setContactDetails] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toggleSidebar } = useSidebar()

  // Structure de contact vide sans valeurs par défaut
  const safeContact = contactDetails || {
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    icon: undefined,
    stage: "",
    tags: [],
    record: "",
  }

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const url = window.location.href
        const regex = /\/contact\/([a-zA-Z0-9]+)/ // Extraire l'ID du contact de l'URL
        const match = url.match(regex)

        if (!match) {
          return
        }

        const id = match[1]
        setContactId(id)

        // Récupérer les détails du contact
        const data = await GetcontactDetails(id)

        if (!data) {
          return
        }

        // Transformer les données API pour correspondre à l'interface Contact
        const transformedData: Contact = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.Adresse || "",
          logo: data.logo || "",
          icon: undefined,
          stage: data.stage || "",
          tags: data.tabs ? (Array.isArray(data.tabs) ? data.tabs : [data.tabs]) : [],
          record: data.Record || "",
        }

        setContactDetails(transformedData)
        setIsLoading(false)
      } catch (err) {
        console.error("Erreur lors de la récupération des détails du contact:", err)
        setIsLoading(false)
      }
    }

    fetchContactData()
  }, [])

  return (
    <header className="w-full items-center gap-4 bg-background/95 py-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2 ">
          <SidebarTrigger className=""  />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Contact</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <ChevronRight className="h-4 w-4" color="gray" />
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbItem>
                {
                  safeContact.name || "Contact sans nom"
                }
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star fill="black" className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="mt-2" />
    </header>
  )
}

