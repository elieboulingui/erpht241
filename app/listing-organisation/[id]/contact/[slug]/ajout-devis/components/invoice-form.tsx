"use client"

import { useState } from "react"
import { RefreshCcw, X } from "lucide-react"
import ClientSection from "./invoice-sections/client-section"
import EmailSection from "./invoice-sections/email-section"
import PaymentSection from "./invoice-sections/payment-section"
import BalanceSection from "./invoice-sections/balance-section"
import AddressSection from "./invoice-sections/address-section"
import TermsSection from "./invoice-sections/terms-section"
import DateSection from "./invoice-sections/date-section"
import ProductSection from "./invoice-sections/product-section"
import InvoiceTable from "./invoice-sections/invoice-table"
import InvoiceActions from "./invoice-sections/invoice-actions"
import FooterActions from "./invoice-sections/footer-actions"

export default function InvoiceForm() {
  const [invoiceNumber, setInvoiceNumber] = useState("1001")
  const [client, setClient] = useState("Aymard Steve")
  const [address, setAddress] = useState("Libreville, Akanda rue Sherco")
  const [email, setEmail] = useState("")
  const [sendLater, setSendLater] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [creationDate, setCreationDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [terms, setTerms] = useState("")
  const [lineItems, setLineItems] = useState([
    { id: 1, product: "", quantity: 0, price: 0, tax: 0, total: 0 },
    { id: 2, product: "", quantity: 0, price: 0, tax: 0, total: 0 },
  ])

  const handleAddLine = () => {
    const newId = lineItems.length > 0 ? Math.max(...lineItems.map((item) => item.id)) + 1 : 1
    setLineItems([...lineItems, { id: newId, product: "", quantity: 0, price: 0, tax: 0, total: 0 }])
  }

  const handleDeleteLine = (id: number) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const handleDeleteAllLines = () => {
    setLineItems([])
  }

  const handleUpdateLineItem = (id: number, field: string, value: string | number) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or price changes
          if (field === "quantity" || field === "price") {
            const quantity = field === "quantity" ? Number(value) : item.quantity
            const price = field === "price" ? Number(value) : item.price
            updatedItem.total = quantity * price
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full ">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <RefreshCcw className="h-5 w-5 text-gray-500" />
          <h1 className="text-xl font-bold">Devis #{invoiceNumber}</h1>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ClientSection client={client} setClient={setClient} />
          <AddressSection address={address} setAddress={setAddress} />
        </div>

        <div className="md:col-span-1">
          <EmailSection email={email} setEmail={setEmail} sendLater={sendLater} setSendLater={setSendLater} />
          <PaymentSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
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
          <DateSection label="Date de création" date={creationDate} setDate={setCreationDate} />
          <div className="mt-2 text-center">
            <button className="text-blue-500 text-sm">Créer une facture récurrente</button>
          </div>
        </div>
        <div className="md:col-span-1">
          <DateSection label="Date d'échéance" date={dueDate} setDate={setDueDate} />
        </div>
      </div>

      <div className="p-6">
        <ProductSection />
      </div>

      <div className="p-6">
        <InvoiceTable lineItems={lineItems} onUpdateLineItem={handleUpdateLineItem} onDeleteLine={handleDeleteLine} />
      </div>

      <div className="p-6">
        <InvoiceActions onAddLine={handleAddLine} onDeleteAllLines={handleDeleteAllLines} />
      </div>

      <div className="p-4 border-t bg-gray-50 flex justify-between">
        <FooterActions />
      </div>
    </div>
  )
}

