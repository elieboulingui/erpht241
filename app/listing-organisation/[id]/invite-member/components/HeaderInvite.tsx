'use client'
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sendInvitationToUser } from "../actions/SendInvitation";

// Fonction pour extraire l'ID de l'URL
const extractIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listing-organisation\/([^\/]+)\//); // Modifié pour prendre l'ID de l'organisation
  return match ? match[1] : null;
};

export default function HeaderInvite() {
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [emailValid, setEmailValid] = useState(true);

  // Vérifier si l'ID de l'organisation est présent dans l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const orgId = extractIdFromUrl(window.location.href);
      if (orgId) {
        setOrganisationId(orgId); // L'ID de l'organisation est correctement extrait et mis dans le state
      } else {
        toast.error("L'ID de l'organisation est introuvable dans l'URL.");
      }
    }
  }, []);

  // Valider l'email
  useEffect(() => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailValid(isValid);
  }, [email]);

  // Fonction pour envoyer l'invitation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis et valides
    if (!email || !role || !organisationId || !emailValid) {
      toast.error("Veuillez remplir tous les champs correctement.");
      return;
    }

    // Appeler la fonction sendInvitationToUser et lui passer l'ID de l'organisation
    sendInvitationToUser(organisationId, email, role)
      .then(() => {
        toast.success("Invitation envoyée avec succès !");
      })
      .catch((error) => {
        toast.error("Une erreur est survenue : " + error.message);
      });
  };

  // Vérification de la validité du formulaire
  const isFormValid = email && role && emailValid && organisationId;

  return (
    <header className="w-full items-center gap-4 bg-background/95 py-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>

        <div className="flex items-center justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">envoyez une invitation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Envoyer une invitation</DialogTitle>
                <DialogDescription>
                  Entrez l'email et le rôle pour envoyer l'invitation.
                </DialogDescription>
              </DialogHeader>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                {/* Champ Email */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez l'email"
                    className="col-span-3"
                  />
                </div>

                {/* Champ Rôle (Select) */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="col-span-3 border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="MEMBRE">MEMBRE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                {/* Bouton d'envoi */}
                <DialogFooter>
                  <Button type="submit" disabled={!isFormValid}>
                    Envoyer l'invitation
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="mt-2" />
    </header>
  );
}
