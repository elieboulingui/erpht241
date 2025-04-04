"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Product {
  id: number
  name: string
  quantity: number
  price: number
  discount: number
  tax: number
  total: number
}

interface DevisPreviewProps {
  data: {
    client: {
      name: string
      email: string
      address: string
    }
    paymentMethod: string
    sendLater: boolean
    terms: string
    creationDate: string
    dueDate: string
    products: Product[]
    totalAmount: number
  }
  onClose: () => void
  contactId: string // Add contactId to props
}

export default function DevisPreview({ data, onClose }: DevisPreviewProps) {
  const [contactName, setContactName] = useState<string | null>(null)

  useEffect(() => {
    const fetchContactName = async () => {
      try {
        // Get the current URL
        const url = window.location.href;

        // Regex to capture the contact ID from the URL
        const regex = /\/contact\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);

        if (match && match[1]) {
          const contactId = match[1];

          // Fetch contact info using the contactId
          const response = await fetch(`/api/contacts?contactId=${contactId}`);
          const contactData = await response.json();

          if (response.ok && contactData) {
            setContactName(contactData.name || "Client"); // Set the contact name (default to "Client" if not found)
          } else {
            console.error("Error fetching contact:", contactData.error);
          }
        } else {
          console.error("Contact ID not found in the URL.");
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContactName();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const subtotal = data.products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const taxAmount = subtotal * 0.01

  return (
    <div className="w-full bg-white p-6 print:p-0">
      <div className="flex justify-between items-start mb-8 print:mb-4">
        <div>
          <h1 className="text-xl font-bold">HIGH TECH 241</h1>
          <p className="text-sm">CENTRE VILLE LIBREVILLE</p>
          <p className="text-sm">AB</p>
          <p className="text-sm">+24177585811</p>
          <p className="text-sm">commercial@ht241.com</p>
          <p className="text-sm">www.ht241.com</p>
          <p className="text-sm mt-2">
            Numéro d'entreprise 74919 / Vente de <br /> Matériels Informatiques - Infrastructure Réseau - <br /> Ingénierie
            logicielle et développement - <br /> Infrastructure Système et Sécurité. HIGH TECH <br /> 241 SARL AU CAPITAL DE
            2000000 XAF
          </p>
        </div>
        <div className="w-32 h-32 relative print:w-24 print:h-24">
          <Image
            src="/placeholder.svg?height=128&width=128"
            alt="HIGH TECH 241 Logo"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-green-600 mb-4 print:text-2xl">DEVIS</h2>

      <div className="flex justify-between mb-6 print:mb-4">
        <div>
          <p className="font-bold">Délivrer À</p>
          <p className="uppercase">{contactName || data.client.name}</p> {/* Display contact name from API or fallback to client name */}
          <p>{data.client.address}</p>
        </div>
        <div className="text-right">
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            <p className="text-right font-bold">N° DE DEVIS</p>
            <p>10473</p>
            <p className="text-right font-bold">DATE</p>
            <p>{formatDate(data.creationDate)}</p>
            <p className="text-right font-bold">ÉCHÉANCE</p>
            <p>{formatDate(data.dueDate)}</p>
            <p className="text-right font-bold">MODALITÉS</p>
            <p>COMPTANT</p>
          </div>
        </div>
      </div>

      <div className="mb-6 print:mb-4">
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
            {data.products.map((product, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 px-4 text-left uppercase">{product.name}</td>
                <td className="py-2 px-4 text-center">{product.quantity}</td>
                <td className="py-2 px-4 text-right">{formatNumber(product.price)}</td>
                <td className="py-2 px-4 text-right">{formatNumber(product.price * product.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mb-6 print:mb-4">
        <div className="max-w-md">
          <p className="font-bold mb-2">
            Remarque 1: Veuillez prendre connaissance à l'arrière de votre facture notre contrat de vente.
          </p>
          <p className="font-bold">
            Remarque 2: 48h après la vente, aucune réclamation n'est admise. Merci beaucoup pour la compréhension
          </p>
        </div>
        <div className="text-right">
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            <p className="text-right font-bold">TOTAL PARTIEL</p>
            <p>{formatNumber(subtotal)}</p>
            <p className="text-right font-bold">CSS/ TVA @ 1%</p>
            <p>{formatNumber(subtotal * 0.01)}</p>
            <p className="text-right font-bold">TVA @ 1%</p>
            <p>{formatNumber(taxAmount)}</p>
            <p className="text-right font-bold">TOTAL</p>
            <p>{formatNumber(data.totalAmount)}</p>
            <p className="text-right font-bold">PAIEMENT</p>
            <p>{formatNumber(data.totalAmount)}</p>
            <p className="text-right font-bold">SOLDE À PAYER</p>
            <p>{formatNumber(data.totalAmount)}</p>
            <p className="text-right font-bold">RESTE À PAYER</p>
            <p>0,00</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-center mt-12 print:mt-8">
        <p>N° Statistique: 7491976 Tel: +24177585811 / +241 62939492 BP. 5866N - N° MAGASIN: 289 - Rue Ange MBA</p>
        <p>HIGH TECH 241 - N° RCCM: GA/LBV - 01-2019-B12-00496</p>
        <p>BGFl BANK 41049799011 / IBAN GA21 40003 04105 41049799011 69</p>
      </div>

      <div className="bg-gray-100 p-4 flex justify-end print:hidden">
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
        >
          Retour
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-[#7f1d1c] hover:bg-[#7f1d1c]/85 text-white rounded-md"
        >
          Imprimer
        </button>
      </div>
    </div>
  )
}
