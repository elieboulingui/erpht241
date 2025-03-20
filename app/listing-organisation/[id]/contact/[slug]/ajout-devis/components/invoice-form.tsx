"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, X } from "lucide-react";
import ClientSection from "./invoice-sections/client-section";
import EmailSection from "./invoice-sections/email-section";
import PaymentSection from "./invoice-sections/payment-section";
import BalanceSection from "./invoice-sections/balance-section";
import AddressSection from "./invoice-sections/address-section";
import TermsSection from "./invoice-sections/terms-section";
import ProductSection from "./invoice-sections/product-section";
import InvoiceTable from "./invoice-sections/invoice-table";
import InvoiceActions from "./invoice-sections/invoice-actions";
import FooterActions from "./invoice-sections/footer-actions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Ellipsis, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CreationDate from "@/app/listing-organisation/[id]/contact/[slug]/ajout-devis/components/invoice-sections/dateCreation";
import EcheanceDate from "@/app/listing-organisation/[id]/contact/[slug]/ajout-devis/components/invoice-sections/dateEcheance";

export default function InvoiceForm() {
  const [invoiceNumber, setInvoiceNumber] = useState("1001");
  const [client, setClient] = useState("Aymard Steve");
  const [address, setAddress] = useState("Libreville, Akanda rue Sherco");
  const [email, setEmail] = useState("");
  const [sendLater, setSendLater] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [creationDate, setCreationDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [terms, setTerms] = useState("");
  const [lineItems, setLineItems] = useState([
    { id: 1, product: "", quantity: 0, price: 0, tax: 0, total: 0 },
    { id: 2, product: "", quantity: 0, price: 0, tax: 0, total: 0 },
  ]);

  // Récupérer orgId et contactId via la regex
  const url = window.location.href;
  const orgId = url.match(/listing-organisation\/([a-z0-9]+)/)?.[1];
  const contactId = url.match(/contact\/([a-z0-9]+)/)?.[1];

  const handleAddLine = () => {
    const newId =
      lineItems.length > 0
        ? Math.max(...lineItems.map((item) => item.id)) + 1
        : 1;
    setLineItems([
      ...lineItems,
      { id: newId, product: "", quantity: 0, price: 0, tax: 0, total: 0 },
    ]);
  };

  const handleDeleteLine = (id: number) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleDeleteAllLines = () => {
    setLineItems([]);
  };

  const handleUpdateLineItem = (
    id: number,
    field: string,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Recalculer le total si la quantité ou le prix change
          if (field === "quantity" || field === "price") {
            const quantity =
              field === "quantity" ? Number(value) : item.quantity;
            const price = field === "price" ? Number(value) : item.price;
            updatedItem.total = quantity * price;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full">
      <header className="w-full items-center gap-4 bg-background/95 py-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {" "}
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

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ClientSection client={client} setClient={setClient} />
          <AddressSection address={address} setAddress={setAddress} />
        </div>

        <div className="md:col-span-1">
          <EmailSection
            email={email}
            setEmail={setEmail}
            sendLater={sendLater}
            setSendLater={setSendLater}
          />
          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        <div className="md:col-span-1">
          <BalanceSection />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TermsSection terms={terms} setTerms={setTerms} />
        </div>
        <div className="md:col-span-1">
          <CreationDate
            label="Date de création"
            date={creationDate}
            setDate={setCreationDate}
          />
        </div>
        <div className="md:col-span-1">
          <EcheanceDate
            label="Date d'échéance"
            date={dueDate}
            setDate={setDueDate}
          />
        </div>
      </div>

      <div className="p-6">
        <ProductSection />
      </div>

      <div className="p-6">
        <InvoiceTable
          lineItems={lineItems}
          onUpdateLineItem={handleUpdateLineItem}
          onDeleteLine={handleDeleteLine}
        />
      </div>

      <div className="p-6">
        <InvoiceActions
          onAddLine={handleAddLine}
          onDeleteAllLines={handleDeleteAllLines}
        />
      </div>

      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <FooterActions />
      </div>
    </div>
  );
}
