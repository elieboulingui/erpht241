"use client"

import { useState } from "react"
import { ClientInfo } from "./client-info"
import { DateTerms } from "./date-terms"
import { ProductSearch } from "./product-search"
import { ProductTable } from "./product-table"
import { TableActions } from "./table-actions"
import { FormActions } from "./form-actions"
import type { DevisFormProps, Product } from "./types"
import { calculateProductTotal, getTotalAmount } from "./utils"

export default function DevisForm({ initialData }: DevisFormProps) {
  const [client, setClient] = useState({
    name: initialData.client.name || "",
    email: initialData.client.email || "",
    address: initialData.client.address || "",
  })

  const [sendLater, setSendLater] = useState(initialData.sendLater || false)
  const [paymentMethod, setPaymentMethod] = useState(initialData.paymentMethod || "carte")
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState("")
  const [terms, setTerms] = useState(initialData.terms || "")

  const [products, setProducts] = useState<Product[]>(() => {
    return initialData.products.map((product) => ({
      ...product,
      total: calculateProductTotal(product as Product),
    }))
  })

  const [searchProduct, setSearchProduct] = useState("")
  const [searchQuantity, setSearchQuantity] = useState("")

  const updateProduct = (id: number, field: keyof Product, value: string | number) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const updatedProduct = {
            ...product,
            [field]: typeof value === "string" && field !== "name" ? Number.parseFloat(value as string) || 0 : value,
          }
          updatedProduct.total = calculateProductTotal(updatedProduct)
          return updatedProduct
        }
        return product
      }),
    )
  }

  const addProductLine = () => {
    const newId = Math.max(0, ...products.map((p) => p.id)) + 1
    setProducts([
      ...products,
      {
        id: newId,
        name: "",
        quantity: 0,
        price: 0,
        discount: 0,
        tax: 0,
        total: 0,
      },
    ])
  }

  const removeProductLine = (id: number) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const clearAllLines = () => {
    setProducts([{ id: 1, name: "", quantity: 0, price: 0, discount: 0, tax: 0, total: 0 }])
  }

  const addProduct = () => {
    if (searchProduct.trim() && searchQuantity.trim()) {
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1
      const newProduct = {
        id: newId,
        name: searchProduct,
        quantity: Number.parseInt(searchQuantity) || 1,
        price: 0,
        discount: 0,
        tax: 0,
        total: 0,
      }
      setProducts([...products, newProduct])
      setSearchProduct("")
      setSearchQuantity("")
    }
  }

  const handlePreview = () => {
    alert("Prévisualisation du devis")
  }

  const handleSave = () => {
    alert("Devis sauvegardé")
  }

  const handleSaveAndSend = () => {
    alert("Devis sauvegardé et envoyé")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-end mb-6">
        <div className="text-right text-[#7f1d1c] text-3xl font-bold mb-2">
          Solde à payer
          <div className="text-3xl font-bold text-black">{getTotalAmount(products).toLocaleString("fr-FR")} Fcfa</div>
        </div>
      </div>

      <ClientInfo
        client={client}
        setClient={setClient}
        sendLater={sendLater}
        setSendLater={setSendLater}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      <DateTerms
        terms={terms}
        setTerms={setTerms}
        creationDate={creationDate}
        setCreationDate={setCreationDate}
        dueDate={dueDate}
        setDueDate={setDueDate}
      />

      <ProductSearch
        searchProduct={searchProduct}
        setSearchProduct={setSearchProduct}
        searchQuantity={searchQuantity}
        setSearchQuantity={setSearchQuantity}
        addProduct={addProduct}
      />

      <ProductTable products={products} updateProduct={updateProduct} removeProductLine={removeProductLine} />

      <TableActions addProductLine={addProductLine} clearAllLines={clearAllLines} />

      <FormActions handlePreview={handlePreview} handleSave={handleSave} handleSaveAndSend={handleSaveAndSend} />
    </div>
  )
}

