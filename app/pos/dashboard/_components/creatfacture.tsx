"use client";
import { JSX, useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Calendar, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import { createDevisByContactName } from "../action/facture";
import { toast } from "sonner";

interface ProductSelection {
  id: string;
  quantity: number;
  totalPrice: number;
}

interface HeaderProps {
  selectedItems: ProductSelection[];
}

interface Contact {
  id: string;
  name: string;
}

export default function Header({ selectedItems }: HeaderProps): JSX.Element {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Formatage de la date selon la locale FR
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  const currentDate = formatDate(new Date());

  // Récupération des contacts à l'initialisation
  useEffect(() => {
    fetch("/api/costumer")
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        if (data.length > 0) setSelectedContactId(data[0].id);
      })
      .catch(console.error);
  }, []);

  // Ouvre le panneau latéral seulement si au moins un produit est sélectionné
  const openSheet = () => {
    if (selectedItems.length === 0) {
      toast.message("Veuillez sélectionner au moins un produit");
      return;
    }
    setIsSheetOpen(true);
  };

  // Création de la facture en passant contact + produits sélectionnés
  const handleCreateFacture = async () => {
    const selectedContactName = contacts.find(c => c.id === selectedContactId)?.name;

    if (!selectedContactName) {
      toast.message("Nom du contact introuvable.");
      return;
    }

    try {
      await createDevisByContactName(selectedContactName, selectedItems);
      toast.message("Facture créée avec succès !");
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Erreur API:", error);
      toast.message("Erreur lors de la création de la facture");
    }
  };

  return (
    <>
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={50}
                className="object-contain"
              />
            </div>
            <div className="ml-8 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input className="pl-10 w-80 bg-gray-100 border-0" placeholder="Rechercher" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{currentDate}</span>
            </div>
            <Bell className="h-5 w-5" />

            <Button onClick={openSheet} className="bg-red-900 hover:bg-red-800">
              <Plus className="h-4 w-4 mr-2" />
              Créer Facture
            </Button>

            <div className="ml-4 px-2 py-1 border rounded">
              <span>FR</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sheet - panneau latéral */}
      {isSheetOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "350px",
            height: "100vh",
            backgroundColor: "white",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
            padding: "1rem",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <h2 className="text-xl font-bold mb-4">Créer une facture</h2>

          <label className="block mb-2 font-medium">Contact</label>
          <select
            value={selectedContactId ?? ""}
            onChange={(e) => setSelectedContactId(e.target.value)}
            className="border rounded px-3 py-2 mb-4 w-full"
          >
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name}
              </option>
            ))}
          </select>

          <div className="mb-4">
            <p className="font-medium">Produits sélectionnés :</p>
            <ul className="list-disc list-inside max-h-40 overflow-auto border p-2 rounded bg-gray-50">
              {selectedItems.length > 0 ? (
                selectedItems.map(item => (
                  <li key={item.id}>
                    Produit ID: {item.id} - Quantité: {item.quantity} - Prix total: {item.totalPrice} FCFA
                  </li>
                ))
              ) : (
                <li>Aucun produit sélectionné</li>
              )}
            </ul>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateFacture} className="bg-red-900 hover:bg-red-800">
              Confirmer
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
