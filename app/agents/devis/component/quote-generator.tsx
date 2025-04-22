"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrinterIcon, Download } from "lucide-react";
import Image from "next/image";
import html2pdf from "html2pdf.js";

export default function QuoteGenerator({
  clientName = "Client",
  clientLocation = "Lieu",
  products = [],
  onClose,
}: {
  clientName: string;
  clientLocation: string;
  products: any[];
  onClose: () => void;
}) {
  const [activeQuote, setActiveQuote] = useState<"economique" | "standard" | "premium">("standard");
  const [contactName, setContactName] = useState<string>("Client");
  const [organisationId, setOrganisationId] = useState<string>("");
  const [contactId, setContactId] = useState<string>("");

  // Effect to extract organisation and contact IDs from URL
  useEffect(() => {
    const url = window.location.href;
    const organisationMatch = url.match(/\/listing-organisation\/([a-zA-Z0-9]+)\//);
    const contactMatch = url.match(/\/contact\/([a-zA-Z0-9]+)/);

    if (organisationMatch && organisationMatch[1]) {
      setOrganisationId(organisationMatch[1]);
    }

    if (contactMatch && contactMatch[1]) {
      const contactId = contactMatch[1];
      setContactId(contactId); // Store contactId in state

      const fetchContactName = async () => {
        try {
          const response = await fetch(`/api/contacts?contactId=${contactId}`);
          const data = await response.json();
          setContactName(data.name || "Client");
        } catch (error) {
          console.error("Erreur lors du chargement du contact :", error);
        }
      };

      fetchContactName();
    }
  }, []);

  const calculateTotals = (modifier: number) => {
    const subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity * modifier,
      0
    );
    const css = Math.round(subtotal * 0.01);
    const tva = Math.round(subtotal * 0.18);
    const total = Math.round(subtotal + tva);
    return {
      subtotal: Math.round(subtotal),
      css,
      tva,
      total,
      payment: Math.round(total * 0.5),
      balance: Math.round(total * 0.5),
    };
  };

  const quoteTypes = {
    economique: {
      title: "DEVIS ÉCONOMIQUE",
      modifier: 0.95,
      totals: calculateTotals(0.95),
    },
    standard: {
      title: "DEVIS STANDARD",
      modifier: 1,
      totals: calculateTotals(1),
    },
    premium: {
      title: "DEVIS PREMIUM",
      modifier: 1.15,
      totals: calculateTotals(1.15),
    },
  };

  const currentDate = new Date().toLocaleDateString("fr-FR");
  const quoteNumber = Math.floor(10000 + Math.random() * 90000);

  const sendQuoteToServer = async (type: "economique" | "standard" | "premium") => {
    const quoteData = quoteTypes[type];
    const payload = {
      quoteNumber,
      date: currentDate,
      type,
      clientName: contactName,
      clientLocation,
      products: products.map((product) => ({
        name: product.name,
        quantity: product.quantity,
        unitPrice: Math.round(product.price * quoteData.modifier),
        total: Math.round(product.price * quoteData.modifier) * product.quantity,
      })),
      totals: quoteData.totals,
      organisationId,
      contactId, // Include contactId here
    };

    try {
      const res = await fetch("/api/devisia/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi du devis à l'API");
      console.log("✅ Devis sauvegardé avec succès !");
    } catch (error) {
      console.error("Erreur API :", error);
    }
  };

  const handleDownload = async () => {
    await sendQuoteToServer(activeQuote);
    const element = document.getElementById("quote-content");
    if (element) {
      html2pdf().from(element).save(`Devis_${quoteNumber}.pdf`);
    }
  };

  const handlePrint = async () => {
    await sendQuoteToServer(activeQuote);
    const element = document.getElementById("quote-content");
    if (element) {
      const printWindow = window.open("", "PRINT", "height=800,width=1200");
      if (printWindow) {
        printWindow.document.write("<html><head><title>DEVIS</title></head><body>");
        printWindow.document.write(element.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const renderQuote = (type: "economique" | "standard" | "premium") => {
    const quoteData = quoteTypes[type];
    return (
      <div className="bg-white p-0 relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="transform rotate-[-45deg] text-[300px] font-bold text-green-600">DEVIS</div>
        </div>
        {/* Header and Contact Info */}
        <div className="flex justify-between items-start">
          <div className="text-left">
            <p className="font-bold">HIGH TECH 241</p>
            <p>CENTRE VILLE LIBREVILLE</p>
            <p>AB</p>
            <p>+24177585811</p>
            <p>commercial@ht241.com</p>
            <p>www.ht241.com</p>
            <p>Numéro d'entreprise 74919 / Vente de</p>
            <p>Matériels Informatiques - Infrastructure Réseau</p>
            <p>Ingénierie logicielle et développement -</p>
            <p>Infrastructure Système et Sécurité</p>
            <p>HIGH TECH 241 SARL AU CAPITAL DE 2000000 XAF</p>
          </div>
          <div className="text-right">
            <Image src="/ht241.png" alt="HIGH TECH 241" width={150} height={150} className="object-contain" />
          </div>
        </div>
        <div className="mt-2">
          <h2 className="text-green-600 text-3xl font-bold">DEVIS</h2>
        </div>
        <div className="flex justify-between mt-2">
          <div>
            <p className="font-bold">Délivrer À</p>
            <p className="font-bold">{contactName.toUpperCase()}</p>
            <p>{clientLocation}</p>
          </div>
          <div>
            <table className="ml-auto">
              <tbody>
                <tr><td className="font-bold pr-2 text-right">N° DE DEVIS</td><td>{quoteNumber}</td></tr>
                <tr><td className="font-bold pr-2 text-right">DATE</td><td>{currentDate}</td></tr>
                <tr><td className="font-bold pr-2 text-right">ÉCHÉANCE</td><td>{currentDate}</td></tr>
                <tr><td className="font-bold pr-2 text-right">MODALITÉS</td><td>COMPTANT</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Item Table */}
        <div className="mt-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="py-2 px-4 text-left">Désignation</th>
                <th className="py-2 px-4 text-center">QTE</th>
                <th className="py-2 px-4 text-right">PRIX.U</th>
                <th className="py-2 px-4 text-right">MONTANT</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const unitPrice = Math.round(product.price * quoteData.modifier);
                const totalPrice = unitPrice * product.quantity;
                return (
                  <tr key={index} className="border-b border-green-600">
                    <td className="py-2 px-4 font-bold">{product.name.toUpperCase()}</td>
                    <td className="py-2 px-4 text-center">{product.quantity}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(unitPrice)}</td>
                    <td className="py-2 px-4 text-right">{formatCurrency(totalPrice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Totals */}
        <div className="w-full border-t border-dotted border-gray-400 mt-10"></div>
        <div className="flex mt-4">
          <div className="w-1/2 text-base">
            <p className="font-bold inline">Remarque 1: Veuillez prendre connaissance à l'arrière de votre facture notre contrat de vente.</p><br />
            <p className="font-bold inline mt-2">Remarque 2: 48h après la vente, aucune réclamation n'est admise. Merci beaucoup pour la compréhension.</p>
          </div>
          <div className="w-1/2">
            <table className="ml-auto">
              <tbody>
                <tr><td className="font-bold pr-4 text-right">TOTAL PARTIEL</td><td className="text-right">{formatCurrency(quoteData.totals.subtotal)}</td></tr>
                <tr><td className="font-bold pr-4 text-right">CSS/ TVA @ 1%</td><td className="text-right">{formatCurrency(quoteData.totals.css)}</td></tr>
                <tr><td className="font-bold pr-4 text-right">TVA @ 1%</td><td className="text-right">{formatCurrency(quoteData.totals.tva)}</td></tr>
                <tr><td className="font-bold pr-4 text-right">TOTAL</td><td className="text-right">{formatCurrency(quoteData.totals.total)}</td></tr>
                <tr><td className="font-bold pr-4 text-right">PAIEMENT</td><td className="text-right">{formatCurrency(quoteData.totals.payment)}</td></tr>
                <tr><td className="font-bold pr-4 text-right">SOLDE À PAYER</td><td className="text-right">{formatCurrency(quoteData.totals.balance)}</td></tr>
                <tr><td className="font-bold pr-4 text-right">RESTE À PAYER</td><td className="text-right">0, 00</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-16 text-xs text-center">
          <p>N° Statistique: 749197c Tel: +24177585811 / +241 62939492 BP. 5866N - N° MAGASIN: 289 - Rue Ange MBA</p>
          <p>HIGH TECH 241 - N° RCCM: GA/LBV - 01-2019-B12-00496</p>
          <p>BGFl BANK 41049799011 / IBAN GA21 40003 04105 41049799011 69</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            Devis pour {contactName} - {clientLocation}
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b">
          {["economique", "standard", "premium"].map((type) => (
            <button
              key={type}
              className={`flex-1 py-3 px-4 text-center ${activeQuote === type ? "bg-gray-100 font-medium" : "bg-gray-50"}`}
              onClick={() => setActiveQuote(type as "economique" | "standard" | "premium")}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div id="quote-content" className="p-6">
          {renderQuote(activeQuote)}
        </div>

        <div className="flex justify-between mt-6 px-6 pb-6">
          <Button variant="outline" onClick={handleDownload} className="flex items-center">
            <Download className="mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex items-center">
            <PrinterIcon className="mr-2" />
            Imprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
