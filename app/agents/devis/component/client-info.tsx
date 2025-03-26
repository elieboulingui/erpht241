"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Client } from "./types";
interface ClientInfoProps {
  client: Client;
  setClient: (client: Client) => void;
  sendLater: boolean;
  setSendLater: (value: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export function ClientInfo({
  client,
  setClient,
  sendLater,
  setSendLater,
  paymentMethod,
  setPaymentMethod,
}: ClientInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
      <div>
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <Label htmlFor="client" className="text-sm font-medium">
              Client
            </Label>
            <div className="ml-1 text-gray-400">ⓘ</div>
          </div>
          <Input
            id="client"
            value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="address" className="text-sm font-medium">
            Adresse
          </Label>
          <Input
            id="address"
            value={client.address}
            onChange={(e) => setClient({ ...client, address: e.target.value })}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Client
            </Label>
            <div className="ml-1 text-gray-400">ⓘ</div>
          </div>
          <Input
            id="email"
            type="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            className="w-full"
            placeholder="Facultatif"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <Checkbox
              id="sendLater"
              checked={sendLater}
              onCheckedChange={(checked) => setSendLater(checked as boolean)}
            />
            <Label htmlFor="sendLater" className="ml-2 text-sm">
              Envoyer plutard
            </Label>
          </div>
        </div>

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
                className="mr-2 appearance-none w-4 h-4 border border-black rounded-full checked:bg-black checked:border-black focus:outline-none focus:ring-0"
              />
              <Label
                htmlFor="card"
                className="text-sm text-gray-500 flex items-center"
              >
                Carte
                <img src="/images/visa.png" alt="Visa" className="h-10 ml-2" />
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
                className="mr-2 appearance-none w-4 h-4 border border-black rounded-full checked:bg-black checked:border-black focus:outline-none focus:ring-0"
              />
              <Label
                htmlFor="transfer"
                className="text-sm text-gray-500 flex items-center"
              >
                Transfert bancaire
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
                className="mr-2 appearance-none w-4 h-4 border border-black rounded-full checked:bg-black checked:border-black focus:outline-none focus:ring-0"
              />
              <Label htmlFor="cash" className="text-sm text-gray-500">
                Cash
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
