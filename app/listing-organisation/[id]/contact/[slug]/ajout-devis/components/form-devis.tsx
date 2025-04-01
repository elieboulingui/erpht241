// client-side code (AjoutDevisManuel)
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DevisForm from "@/app/agents/devis/component/devis-form";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Ellipsis, Star } from "lucide-react";
import { Createdevis } from "../action/Createdevis"; // Assurez-vous d'importer la fonction correcte
import { getDevisByOrganisationId } from "../action/getdevislength";

// Assurez-vous que cette fonction est bien importée

export default function AjoutDevisManuel() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("1001");

  // Extraction des IDs avec fallback robuste
  const getRouteIds = () => {
    if (params?.organisationId && params?.contactSlug) {
      return {
        orgId: params.organisationId as string,
        contactId: params.contactSlug as string,
      };
    }

    const segments = pathname?.split("/") || [];
    const orgIndex = segments.indexOf("listing-organisation");
    const contactIndex = segments.indexOf("contact");

    return {
      orgId: orgIndex !== -1 ? segments[orgIndex + 1] : "",
      contactId: contactIndex !== -1 ? segments[contactIndex + 1] : "",
    };
  };

  const { orgId, contactId } = getRouteIds();

  // Récupérer le dernier numéro de devis ou définir 1000 si aucun devis trouvé
  useEffect(() => {
    const checkExistingDevis = async () => {
      try {
        const devis = await getDevisByOrganisationId(orgId);
        if (devis.length > 0) {
          const lastDevis = devis[devis.length - 1];
          const lastInvoiceNumber = parseInt(lastDevis.devisNumber.replace("HT", ""));
          setInvoiceNumber((lastInvoiceNumber + 1).toString());
        } else {
          setInvoiceNumber("1000");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des devis :", error);
      }
    };

    checkExistingDevis();
  }, [orgId]);

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

  const isErrorResponse = (response: any): response is { error: string } => {
    return response && response.error;
  };

  const handleSaveDevis = async (devisData: any) => {
    setIsSaving(true);
    try {
      devisData.devisNumber = `HT${invoiceNumber}`;
      const response = await Createdevis(devisData);

      if (isErrorResponse(response)) {
        toast.error(response.error, {
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        toast.success("Devis créé avec succès", {
          position: "bottom-right",
          duration: 3000,
        });
        router.push(`/listing-organisation/${orgId}/contact/${contactId}`);
      }
    } catch (error) {
      toast.error("Erreur lors de la création du devis", {
        position: "bottom-right",
        duration: 3000,
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
                    Devis #{invoiceNumber}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
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

      <main className="p-5">
        <div className="bg-gray-50 rounded-lg shadow-sm">
          <DevisForm
            initialData={initialData}
            onSave={handleSaveDevis}
          />
        </div>
      </main>
    </div>
  );
}
