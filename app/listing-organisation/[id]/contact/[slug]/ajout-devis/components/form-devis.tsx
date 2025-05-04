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
import { getDevisByOrganisationId } from "../action/getdevislength"; // Your API call to check existing invoices

export default function AjoutDevisManuel() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSaving, setIsSaving] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(1001); // Start with a numeric value for invoiceNumber

  // Function to extract orgId and contactId from params or URL
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

  useEffect(() => {
    if (!orgId || orgId.length < 24) {
      toast.error("ID de l'organisation invalide");
      return;
    }

    const checkExistingDevis = async () => {
      try {
        const devis = await getDevisByOrganisationId(orgId);
        if (devis.length > 0) {
          const lastDevis = devis[devis.length - 1];
          const lastInvoiceNumber = parseInt(lastDevis.devisNumber.replace("HT", ""));
          setInvoiceNumber(lastInvoiceNumber + 1); // Ensure invoice number is an integer
        } else {
          setInvoiceNumber(1000); // Start from 1000 if no previous invoices
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

  // Function to validate if the amounts are valid
  const validateAmounts = (products: any[]) => {
    return products.every((product, index) => {
      const { price, discount, tax, quantity } = product;
      
      // Vérification de chaque montant
      if (isNaN(price) || price < 0) {
        toast.error(`Le prix de l'article ${index + 1} doit être un nombre valide et supérieur ou égal à 0`);
        return false;
      }
      if (isNaN(discount) || discount < 0) {
        toast.error(`Le rabais de l'article ${index + 1} doit être un nombre valide et supérieur ou égal à 0`);
        return false;
      }
      if (isNaN(tax) || tax < 0) {
        toast.error(`Le taux de taxe de l'article ${index + 1} doit être un nombre valide et supérieur ou égal à 0`);
        return false;
      }
      if (isNaN(quantity) || quantity <= 0) {
        toast.error(`La quantité de l'article ${index + 1} doit être un nombre valide et supérieur à 0`);
        return false;
      }
      return true;
    });
  };

  const handleSaveDevis = async (devisData: any) => {
    setIsSaving(true);

    // Validate amounts before saving
    if (!validateAmounts(devisData.products)) {
      toast.error("Les montants doivent être des nombres valides", {
        position: "bottom-right",
        duration: 3000,
      });
      setIsSaving(false);
      return;
    }

    try {
      // Ensure that devisNumber is always correctly formatted and numeric
    
      devisData.devisNumber = `HT${invoiceNumber}`;

      // Sending both orgId and contactId in the API request
      const response = await fetch(`/api/devis?organisationId=${orgId}&contactId=${contactId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error, {
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
