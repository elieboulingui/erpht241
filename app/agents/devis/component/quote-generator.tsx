"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrinterIcon, Download, Share2 } from "lucide-react";
import Image from "next/image";

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
  const [activeQuote, setActiveQuote] = useState("standard");

  // Calculate totals
  const calculateTotals = (modifier: number) => {
    const subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity * modifier,
      0
    );
    const css = Math.round(subtotal * 0.01); // 1% CSS
    const tva = Math.round(subtotal * 0.18); // 18% TVA
    const total = Math.round(subtotal + tva);

    return {
      subtotal: Math.round(subtotal),
      css,
      tva,
      total,
      payment: Math.round(total * 0.5), // 50% payment
      balance: Math.round(total * 0.5), // 50% balance
    };
  };

  // Different quote types with price modifiers
  const quoteTypes = {
    economique: {
      title: "DEVIS ÉCONOMIQUE",
      modifier: 0.95, // 5% discount
      totals: calculateTotals(0.95),
    },
    standard: {
      title: "DEVIS STANDARD",
      modifier: 1, // standard price
      totals: calculateTotals(1),
    },
    premium: {
      title: "DEVIS PREMIUM",
      modifier: 1.15, // 15% premium
      totals: calculateTotals(1.15),
    },
  };

  const currentDate = new Date().toLocaleDateString("fr-FR");
  const quoteNumber = Math.floor(10000 + Math.random() * 90000);

  const renderQuote = (type: "economique" | "standard" | "premium") => {
    const quoteData = quoteTypes[type];

    return (
      <div className="bg-white p-0 relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="transform rotate-[-45deg] text-[300px] font-bold text-green-600">
            DEVIS
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-left">
            <p className="font-bold">HIGH TECH 241</p>
            <p>CENTRE VILLE LIBREVILLE</p>
            <p>AB</p>
            <p>+24177585811</p>
            <p>commercial@ht241.com</p>
            <p>www.ht241.com</p>
            <p>Numéro d'entreprise 74919 / Vente de</p>
            <p>Matériels Informatiques - Infrastructure Réseau -</p>
            <p>Ingénierie logicielle et développement -</p>
            <p>Infrastructure Système et Sécurité. HIGH TECH</p>
            <p>241 SARL AU CAPITAL DE 2000000 XAF</p>
          </div>
          <div className="text-right">
            <Image
              src="/ht241.png"
              alt="HIGH TECH 241"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <div className="mt-2">
          <h2 className="text-green-600 text-3xl font-bold">DEVIS</h2>
        </div>

        {/* Client and Quote Info */}
        <div className="flex justify-between mt-2">
          <div>
            <p className="font-bold">Délivrer À</p>
            <p className="font-bold">{clientName.toUpperCase()}</p>
            <p>{clientLocation}</p>
          </div>
          <div className="">
            <table className="ml-auto">
              <tbody>
                <tr>
                  <td className="font-bold pr-2 text-right">N° DE DEVIS</td>
                  <td>{quoteNumber}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2 text-right">DATE</td>
                  <td>{currentDate}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2 text-right">ÉCHÉANCE</td>
                  <td>{currentDate}</td>
                </tr>
                <tr>
                  <td className="font-bold pr-2 text-right">MODALITÉS</td>
                  <td>COMPTANT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-green-600 my-4"></div>

        {/* Products Table */}
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
                const unitPrice = Math.round(
                  product.price * quoteData.modifier
                );
                const totalPrice = unitPrice * product.quantity;

                return (
                  <tr key={index} className="border-b border-green-600">
                    <td className="py-2 px-4 font-bold">
                      {product.name.toUpperCase()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {product.quantity}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {formatCurrency(unitPrice)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      {formatCurrency(totalPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dotted Line */}
        <div className="w-full border-t border-dotted border-gray-400 mt-10"></div>

        {/* Remarks and Totals */}
        <div className="flex mt-4">
          <div className="w-1/2 text-base">
            <p className="font-bold inline">
              Remarque 1: Veuillez prendre connaissance à l'arrière de votre
              facture notre contrat de vente.
            </p>{" "}
            <br />
            <p className="font-bold inline mt-2">
              Remarque 2: 48h après la vente, aucune réclamation n'est admise.
              Merci beaucoup pour la compréhension.
            </p>
          </div>

          <div className="w-1/2">
            <table className="ml-auto">
              <tbody>
                <tr>
                  <td className="font-bold pr-4 text-right">TOTAL PARTIEL</td>
                  <td className="text-right">
                    {formatCurrency(quoteData.totals.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 text-right">CSS/ TVA @ 1%</td>
                  <td className="text-right">
                    {formatCurrency(quoteData.totals.css)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 text-right">TVA @ 1%</td>
                  <td className="text-right">
                    {formatCurrency(quoteData.totals.tva)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 text-right">TOTAL</td>
                  <td className="text-right">
                    {formatCurrency(quoteData.totals.total)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 text-right">PAIEMENT</td>
                  <td className="text-right">
                    {formatCurrency(quoteData.totals.payment)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 text-right">SOLDE À PAYER</td>
                  <td className="text-right">
                    {formatCurrency(quoteData.totals.balance)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pr-4 text-right">RESTE À PAYER</td>
                  <td className="text-right">0, 00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-xs text-center">
          <p>
            N° Statistique: 749197c Tel: +24177585811 / +241 62939492 BP. 5866N
            - N° MAGASIN: 289 - Rue Ange MBA
          </p>
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
            Devis pour {clientName} - {clientLocation}
          </DialogTitle>
        </DialogHeader>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center ${activeQuote === "economique" ? "bg-gray-100 font-medium" : "bg-gray-50"}`}
            onClick={() => setActiveQuote("economique")}
          >
            Économique
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${activeQuote === "standard" ? "bg-gray-100 font-medium" : "bg-gray-50"}`}
            onClick={() => setActiveQuote("standard")}
          >
            Standard
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center ${activeQuote === "premium" ? "bg-gray-100 font-medium" : "bg-gray-50"}`}
            onClick={() => setActiveQuote("premium")}
          >
            Premium
          </button>
        </div>

        <div className="p-6">
          {activeQuote === "economique" && renderQuote("economique")}
          {activeQuote === "standard" && renderQuote("standard")}
          {activeQuote === "premium" && renderQuote("premium")}
        </div>

        <div className="flex justify-between p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <PrinterIcon className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
