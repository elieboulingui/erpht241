"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DevisForm from "@/app/agents/devis/component/devis-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Ellipsis, Star } from "lucide-react";

export default function AjoutDevisManuel() {
  const router = useRouter();
  const params = useParams(); // Utilisez useParams() au lieu de l'extraction manuelle
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("1001");

  // Supprimez cette extraction manuelle problématique
  // const url = window.location.href;
  // const orgId = url.match(/listing-organisation\/([a-z0-9]+)/)?.[1];
  // const contactId = url.match(/contact\/([a-z0-9]+)/)?.[1];

  // Utilisez directement les params
  const orgId = params.organisationId;
  const contactId = params.contactSlug;

  const initialData = {
    client: {
      name: "",
      email: "",
      address: "",
    },
    paymentMethod: "carte",
    sendLater: false,
    terms: "",
    products: [
      {
        id: 1,
        name: "",
        quantity: 1,
        price: 0,
        discount: 0,
        tax: 0,
      },
    ],
  };

  const handleSaveDevis = async (devisData: any) => {
    setIsSaving(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigation après succès
      router.push(`/listing-organisation/${orgId}/contact/${contactId}`);
      
      toast.success("Devis créé avec succès", {
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Erreur lors de la création du devis");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="">
      <header className="w-full items-center gap-4 bg-background/95 py-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-gray-500 font-bold"
                    href={`/listing-organisation/${orgId}/contact`}
                  >
                    Contacts
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <ChevronRight className="h-4 w-4" color="gray" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-gray-500 font-bold"
                    href={`/listing-organisation/${orgId}/contact/${contactId}`}
                  >
                    Contact Detail
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <ChevronRight className="h-4 w-4" color="gray" />
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbItem className="font-bold text-black">
                  Devis #{invoiceNumber || "Nom non disponible"}
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

      <div className="bg-gray-50">
        <DevisForm initialData={initialData} onSave={handleSaveDevis} />
      </div>
    </div>
  );
}