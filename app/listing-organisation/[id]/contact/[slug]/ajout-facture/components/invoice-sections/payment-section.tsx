"use client";

import { Label } from "@/components/ui/label";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
}: PaymentSectionProps) {
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
          <Label
            htmlFor="card"
            className="text-sm text-gray-500 flex items-center"
          >
            Carte
            <img
              src="/images/visa.png"
              alt="Visa"
              className="h-10 ml-2"
            />
            <img
              src="/images/mastercard.png"
              alt="Mastercard"
              className="h-10 ml-1"
            />
          </Label>
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
          <Label
            htmlFor="transfer"
            className="text-sm text-gray-500 flex items-center"
          >
            Transfere bancaire
          
          </Label>
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
          <Label htmlFor="cash" className="text-sm text-gray-500">
            Cash
          </Label>
        </div>
      </div>
    </div>
  );
}
