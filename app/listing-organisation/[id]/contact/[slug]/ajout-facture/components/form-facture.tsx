"use client";

import { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Ellipsis, Star } from "lucide-react";
import FactureForm from "@/app/agents/facture/component/facture-form";

export default function AjoutFactureManuel() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("1001");

  // Extraction des IDs avec fallback robuste
  const getRouteIds = () => {
    // Essayer d'abord avec useParams()
    if (params?.organisationId && params?.contactSlug) {
      return {
        orgId: params.organisationId as string,
        contactId: params.contactSlug as string
      };
    }

    // Fallback: analyser le pathname si useParams() ne fonctionne pas
    const segments = pathname?.split('/') || [];
    const orgIndex = segments.indexOf('listing-organisation');
    const contactIndex = segments.indexOf('contact');

    return {
      orgId: orgIndex !== -1 ? segments[orgIndex + 1] : '',
      contactId: contactIndex !== -1 ? segments[contactIndex + 1] : ''
    };
  };

  const { orgId, contactId } = getRouteIds();

  // Validation des IDs
  if (!orgId || !contactId) {
    console.error("Impossible de déterminer les IDs de l'organisation ou du contact");
    // Option: rediriger vers une page d'erreur
    // router.push('/erreur');
  }

  // Données initiales pour le formulaire
  const initialData = {
    client: {
      name: "",
      email: "",
      address: "",
    },
    paymentMethod: "carte",
    sendLater: false,
    terms: "",
    creationDate: new Date().toISOString().split("T")[0],
    dueDate: "",
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

  const handleSaveFacture = async (factureData: any) => {
    setIsSaving(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirection après succès
      router.push(`/listing-organisation/${orgId}/contact/${contactId}`);
      
      toast.success("Facture créée avec succès", {
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      toast.error("Erreur lors de la création de la facture", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <header className="w-full items-center gap-4 bg-background/95 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="text-gray-600" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-gray-500 font-medium hover:text-gray-700"
                    href={`/listing-organisation/${orgId}/contact`}
                  >
                    Contacts
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                <ChevronRight className="h-4 w-4 text-gray-400" />
                
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-gray-500 font-medium hover:text-gray-700"
                    href={`/listing-organisation/${orgId}/contact/${contactId}`}
                  >
                    Détail du contact
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                <ChevronRight className="h-4 w-4 text-gray-400" />
                
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-gray-900">
                    Facture #{invoiceNumber}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4 text-gray-600 hover:text-yellow-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Ellipsis className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        <Separator className="mt-2" />
      </header>

      {/* Contenu principal */}
      <main className="p-5">
        <div className="bg-gray-50 rounded-lg shadow-sm">
          <FactureForm 
            initialData={initialData} 
            onSave={handleSaveFacture}
          />
        </div>
      </main>
    </div>
  );
}