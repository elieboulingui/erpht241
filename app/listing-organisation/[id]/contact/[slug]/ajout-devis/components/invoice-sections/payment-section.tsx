"use client"

interface PaymentSectionProps {
  paymentMethod: string
  setPaymentMethod: (value: string) => void
}

export default function PaymentSection({ paymentMethod, setPaymentMethod }: PaymentSectionProps) {
  return (
    <div className="mb-6">
      <label className="text-gray-500 text-sm block mb-2">Paiement</label>
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
            className="mr-2"
          />
          <label htmlFor="card" className="text-sm text-gray-600 flex items-center">
            Carte
            <img src="https://v0.blob.com/visa.png" alt="Visa" className="h-6 ml-2" />
            <img src="https://v0.blob.com/mastercard.png" alt="Mastercard" className="h-6 ml-1" />
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="transfer"
            name="paymentMethod"
            value="transfer"
            checked={paymentMethod === "transfer"}
            onChange={() => setPaymentMethod("transfer")}
            className="mr-2"
          />
          <label htmlFor="transfer" className="text-sm text-gray-600 flex items-center">
            Transfere bancaire
            <span className="ml-2 bg-gray-200 text-xs px-2 py-1 rounded">Bank</span>
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="cash"
            name="paymentMethod"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
            className="mr-2"
          />
          <label htmlFor="cash" className="text-sm text-gray-600">
            Cash
          </label>
        </div>
      </div>
    </div>
  )
}

