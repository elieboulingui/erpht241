"use client";

import { useState, useEffect } from "react";
import { Building2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Chargement from "@/components/Chargement";
import { Contact } from "@/contact";
import { ContactProperties } from "./ContactProperties";
import { ContactStage } from "./ContactStage";
import { ContactTags } from "./ContactTags";
import { ContactTabs } from "./ContactTabs";
import { EditContactModal } from "./EditContactModal";
import { DeleteImage } from "../actions/deleteImage";
import { UpdateContactDetail } from "../actions/updateContactDetail";

export default function ContactInfo() {
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactDetails, setContactDetails] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Structure de contact vide sans valeurs par défaut
  const safeContact = contactDetails || {
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    icon: null,
    niveau: "",
    tags: [],
    status_contact: "",
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const url = window.location.href;
        const regex = /\/contact\/([a-zA-Z0-9]+)/; // Extraire l'ID du contact de l'URL
        const match = url.match(regex);
  
        if (!match) {
          throw new Error("ID de contact non trouvé dans l'URL");
        }
  
        const id = match[1];
        setContactId(id);
  
        // Récupérer les détails du contact
        const response = await fetch(`/api/getcontactDetails?id=${id}`);
  
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (!data) {
          throw new Error("Aucune donnée retournée par l'API");
        }
  
        // Transformer les données API pour correspondre à l'interface Contact
        const transformedData: Contact = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.adresse || "",
          logo: data.logo || "",
          icon: null,
          niveau: data.niveau || "",
          tags: data.tags
            ? Array.isArray(data.tags)
              ? data.tags
              : [data.tags]
            : [],
          status_contact: data.status_contact || "",
        };
  
        setContactDetails(transformedData);
        setIsLoading(false);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des détails du contact:",
          err
        );
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setIsLoading(false);
      }
    };
  
    fetchContactData();
  }, []);
  

  const handleDeleteImage = async () => {
    if (!contactId) return;

    try {
      const result = await DeleteImage(contactId);

      if (result.success) {
        // Update the local state to reflect the change immediately
        setContactDetails({
          ...safeContact,
          logo: "",
        } as Contact);
      } else {
        setError(result.error || "Échec de la suppression de l'image");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image:", err);
      setError("Une erreur est survenue lors de la suppression de l'image");
    }
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveContact = async (updatedData: Contact) => {
    if (!contactId) return;

    try {
      const result = await UpdateContactDetail(contactId, {
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        address: updatedData.address,
      });

      if (result.success) {
        // Update the local state to reflect the changes immediately
        setContactDetails({
          ...safeContact,
          ...updatedData,
        } as Contact);
      } else {
        setError(result.error || "Échec de la mise à jour du contact");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du contact:", err);
      setError("Une erreur est survenue lors de la mise à jour du contact");
      throw err; // Rethrow to be caught by the modal
    }
  };

  const handleUpdateTags = (tags: string[]) => {
    setContactDetails({
      ...safeContact,
      tags,
    } as Contact);
  };

  return (
    <div className="">
      {isLoading ? (
        <Chargement />
      ) : error ? (
        <div className="flex items-center justify-center bg-white py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      ) : !contactDetails ? (
        <div className="flex items-center justify-center bg-white py-20">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Contact introuvable
            </h2>
            <p className="text-gray-600 mb-4">
              Les informations de ce contact n'ont pas pu être chargées.
            </p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      ) : (
        <div className="flex bg-white">
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col">
            {/* Zone de contenu */}
            <div className="flex-1 flex">
              {/* Panneau gauche - Détails du contact */}
              <div className="w-[475px] border-r">
                <div className="p-6 flex flex-col">
                  {/* Avatar/logo du contact */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative inline-block">
                      <div className="w-[90px] h-[90px] bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                        {safeContact.logo ? (
                          <img
                            src={safeContact.logo || "/placeholder.svg"}
                            alt={safeContact.name}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <Building2 className="h-12 w-12" />
                        )}
                      </div>
                      <button
                        className="absolute -bottom-1 -right-1 bg-white border rounded-full p-1 hover:bg-gray-100 transition-colors"
                        aria-label="Supprimer l'image"
                        onClick={handleDeleteImage}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section des propriétés */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-medium text-base">Propriétés</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2 py-1"
                      onClick={handleOpenEditModal}
                    >
                      Modifier
                    </Button>
                  </div>

                  <ContactProperties contact={safeContact} />
                </div>

                <Separator />

                {/* Section étape */}
                <ContactStage niveau={safeContact.niveau} />

                <Separator />

                {/* Section étiquettes */}
                <ContactTags
                  tags={safeContact.tags}
                  onUpdateTags={handleUpdateTags}
                />
              </div>

              {/* Panneau droit - Onglets d'activité */}
              <ContactTabs contact={safeContact} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {contactDetails && (
        <EditContactModal
          contact={safeContact}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
}
