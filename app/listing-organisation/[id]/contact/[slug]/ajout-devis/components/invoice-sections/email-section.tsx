"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";

interface EmailSectionProps {
  email: string;
  setEmail: (value: string) => void;
  sendLater: boolean;
  setSendLater: (value: boolean) => void;
}

export default function EmailSection({
  email,
  setEmail,
  sendLater,
  setSendLater,
}: EmailSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Label className="text-gray-500 text-sm">Email Client</Label>
        <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
      </div>
      <div className="mb-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <span className="text-xs text-gray-400 mt-1">Facultatif</span>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="sendLater"
          checked={sendLater}
          onChange={(e) => setSendLater(e.target.checked)}
          className="mr-2 accent-[#7f1d1c]"
        />
        <Label htmlFor="sendLater" className="text-xs text-gray-600">
          Envoyer plutard
        </Label>
      </div>
    </div>
  );
}
