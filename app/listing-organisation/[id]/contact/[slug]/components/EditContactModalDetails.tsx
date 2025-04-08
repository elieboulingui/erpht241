"use client";

import type React from "react";
import { useState } from "react";
import { Building2, Mail, MapPin, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  niveau: string;
  status_contact: string; // Doit être une string, pas un array
  sector: string;
}

interface EditContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Contact) => Promise<void>;
}

export function EditContactModalDetails({
  contact,
  isOpen,
  onClose,
  onSave,
}: EditContactModalProps) {
  const [formData, setFormData] = useState<Contact>({ ...contact });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Modifier les informations du contact</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">

            <div className="flex items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right flex items-center justify-end"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="email"
                className="text-right flex items-center justify-end"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="phone"
                className="text-right flex items-center justify-end"
              >
                <Phone className="h-4 w-4 mr-2" />
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="address"
                className="text-right flex items-center justify-end"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label
                htmlFor="status_contact"
                className="text-right flex items-center justify-end"
              >
                <User className="h-4 w-4 mr-2" />
                Type
              </Label>

              <Input id="status_contact" name="status_contact" value={formData.status_contact} onChange={handleChange} className="col-span-3" disabled />

            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="name" className="text-right flex items-center justify-end">
                <Building2 className="h-4 w-4 mr-2" />
                Secteur
              </Label>

              <Input id="sector" name="sector" value={formData.sector} onChange={handleChange} className="col-span-3" />

            </div>
          </div>

          <SheetFooter className="mt-6 flex justify-end space-x-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </SheetClose>
            <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}